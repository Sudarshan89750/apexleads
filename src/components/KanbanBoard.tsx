import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Opportunity, PipelineStage } from '@shared/types';
import { GripVertical } from 'lucide-react';
type KanbanBoardProps = {
  stages: PipelineStage[];
  opportunities: Opportunity[];
};
type OpportunityCardProps = {
  opportunity: Opportunity;
};
function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Card className="mb-4 bg-card hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium leading-none">{opportunity.title}</CardTitle>
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{opportunity.contactName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{opportunity.contactName}</span>
          </div>
          <Badge variant="secondary">${opportunity.value.toLocaleString()}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
function SortableOpportunityCard({ opportunity }: OpportunityCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opportunity.id,
    data: {
      type: 'Opportunity',
      opportunity,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="opacity-50"><OpportunityCard opportunity={opportunity} /></div>;
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OpportunityCard opportunity={opportunity} />
    </div>
  );
}
type StageColumnProps = {
  stage: PipelineStage;
  opportunities: Opportunity[];
};
function StageColumn({ stage, opportunities }: StageColumnProps) {
  const opportunitiesIds = useMemo(() => opportunities.map((opp) => opp.id), [opportunities]);
  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="p-2 mb-4">
        <h3 className="text-lg font-semibold text-foreground">{stage.title}</h3>
      </div>
      <div className="flex-1 bg-muted/50 rounded-lg p-2">
        <SortableContext items={opportunitiesIds}>
          {opportunities.map((opp) => (
            <SortableOpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
export function KanbanBoard({ stages, opportunities: initialOpportunities }: KanbanBoardProps) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);
  const opportunitiesByStage = useMemo(() => {
    const grouped: Record<string, Opportunity[]> = {};
    stages.forEach((stage) => {
      grouped[stage.id] = [];
    });
    opportunities.forEach((opp) => {
      if (grouped[opp.stageId]) {
        grouped[opp.stageId].push(opp);
      }
    });
    return grouped;
  }, [opportunities, stages]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Opportunity') {
      setActiveOpportunity(event.active.data.current.opportunity);
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveOpportunity(null);
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const activeStageId = active.data.current?.opportunity.stageId;
    const overStageId = over.data.current?.opportunity?.stageId || over.id;
    if (activeStageId !== overStageId) {
      // This is a simplified update. A real app would persist this change.
      setOpportunities((prev) => {
        const activeIndex = prev.findIndex((o) => o.id === active.id);
        if (activeIndex === -1) return prev;
        prev[activeIndex].stageId = String(overStageId);
        return arrayMove(prev, activeIndex, activeIndex);
      });
    }
  }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const isActiveAnOpportunity = active.data.current?.type === 'Opportunity';
    const isOverAnOpportunity = over.data.current?.type === 'Opportunity';
    if (!isActiveAnOpportunity) return;
    // Dropping an Opportunity over another Opportunity
    if (isActiveAnOpportunity && isOverAnOpportunity) {
      setOpportunities((prev) => {
        const activeIndex = prev.findIndex((o) => o.id === active.id);
        const overIndex = prev.findIndex((o) => o.id === over.id);
        if (prev[activeIndex].stageId !== prev[overIndex].stageId) {
          prev[activeIndex].stageId = prev[overIndex].stageId;
          return arrayMove(prev, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    // Dropping an Opportunity over a Stage column
    const isOverAStage = stages.some(s => s.id === over.id);
    if (isActiveAnOpportunity && isOverAStage) {
      setOpportunities((prev) => {
        const activeIndex = prev.findIndex((o) => o.id === active.id);
        prev[activeIndex].stageId = String(over.id);
        return arrayMove(prev, activeIndex, activeIndex);
      });
    }
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCorners}
    >
      <div className="flex gap-4 overflow-x-auto p-1">
        {stages.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            opportunities={opportunitiesByStage[stage.id] || []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeOpportunity ? <OpportunityCard opportunity={activeOpportunity} /> : null}
      </DragOverlay>
    </DndContext>
  );
}