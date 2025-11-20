import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners } from
'@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
"@/components/ui/dialog";
import type { Opportunity, PipelineStage } from '@shared/types';
import { GripVertical, MoreHorizontal, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from "sonner";
import { OpportunityForm, OpportunityFormValues } from './OpportunityForm';
type KanbanBoardProps = {
  stages: PipelineStage[];
  opportunities: Opportunity[];
  onDataChange: () => void;
};
type OpportunityCardProps = {
  opportunity: Opportunity;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
};
function OpportunityCard({ opportunity, onEdit, onDelete }: OpportunityCardProps) {
  return (
    <Card className="mb-4 bg-card hover:shadow-md transition-shadow duration-200 group">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium leading-none">{opportunity.title}</CardTitle>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(opportunity)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(opportunity)} className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        </div>
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
    </Card>);
}
function SortableOpportunityCard({ opportunity, onEdit, onDelete }: OpportunityCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opportunity.id,
    data: {
      type: 'Opportunity',
      opportunity
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="opacity-50"><OpportunityCard opportunity={opportunity} onEdit={() => {}} onDelete={() => {}} /></div>;
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OpportunityCard opportunity={opportunity} onEdit={onEdit} onDelete={onDelete} />
    </div>);
}
type StageColumnProps = {
  stage: PipelineStage;
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
};
function StageColumn({ stage, opportunities, onEdit, onDelete }: StageColumnProps) {
  const opportunitiesIds = useMemo(() => opportunities.map((opp) => opp.id), [opportunities]);
  const { setNodeRef } = useSortable({
    id: stage.id,
    data: {
      type: 'Stage'
    }
  });
  return (
    <div ref={setNodeRef} className="flex flex-col w-72 shrink-0">
      <div className="p-2 mb-4">
        <h3 className="text-lg font-semibold text-foreground">{stage.title}</h3>
      </div>
      <div className="flex-1 bg-muted/50 rounded-lg p-2">
        <SortableContext items={opportunitiesIds}>
          {opportunities.map((opp) =>
          <SortableOpportunityCard key={opp.id} opportunity={opp} onEdit={onEdit} onDelete={onDelete} />
          )}
        </SortableContext>
      </div>
    </div>);
}
export function KanbanBoard({ stages, opportunities: initialOpportunities, onDataChange }: KanbanBoardProps) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setOpportunities(initialOpportunities);
  }, [initialOpportunities]);
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
        distance: 10
      }
    })
  );
  const onDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Opportunity') {
      setActiveOpportunity(event.active.data.current.opportunity);
    }
  }, []);
  const onDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveOpportunity(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const activeOpp = opportunities.find(o => o.id === activeId);
    if (!activeOpp) return;
    // Dropping on a stage column
    const overStageId = over.data.current?.type === 'Stage' ? overId : opportunities.find(o => o.id === overId)?.stageId;
    if (overStageId && activeOpp.stageId !== overStageId) {
        try {
            await api(`/api/opportunities/${activeOpp.id}`, {
                method: 'PUT',
                body: JSON.stringify({ stageId: overStageId })
            });
            toast.success(`Moved "${activeOpp.title}" to new stage.`);
            onDataChange();
        } catch (error) {
            toast.error("Failed to move opportunity.");
            console.error("Failed to update opportunity stage:", error);
            // Revert optimistic update on failure
            setOpportunities(initialOpportunities);
        }
    }
  }, [onDataChange, opportunities, initialOpportunities]);
  const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const isActiveAnOpportunity = active.data.current?.type === 'Opportunity';
    const isOverAnOpportunity = over.data.current?.type === 'Opportunity';
    if (!isActiveAnOpportunity) return;
    if (isActiveAnOpportunity && isOverAnOpportunity) {
      setOpportunities((prev) => {
        const activeIndex = prev.findIndex((o) => o.id === active.id);
        const overIndex = prev.findIndex((o) => o.id === over.id);
        if (prev[activeIndex].stageId !== prev[overIndex].stageId) {
          const updatedOpportunities = [...prev];
          updatedOpportunities[activeIndex] = { ...updatedOpportunities[activeIndex], stageId: prev[overIndex].stageId };
          return arrayMove(updatedOpportunities, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    const isOverAStage = over.data.current?.type === 'Stage';
    if (isActiveAnOpportunity && isOverAStage) {
      setOpportunities((prev) => {
        const activeIndex = prev.findIndex((o) => o.id === active.id);
        const updatedOpportunities = [...prev];
        if (updatedOpportunities[activeIndex].stageId !== over.id) {
          updatedOpportunities[activeIndex] = { ...updatedOpportunities[activeIndex], stageId: String(over.id) };
        }
        return updatedOpportunities;
      });
    }
  }, []);
  const handleEditClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditFormOpen(true);
  };
  const handleDeleteClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDeleteConfirmOpen(true);
  };
  const handleEditSubmit = async (values: OpportunityFormValues) => {
    if (!selectedOpportunity) return;
    setIsSubmitting(true);
    try {
      await api(`/api/opportunities/${selectedOpportunity.id}`, {
        method: 'PUT',
        body: JSON.stringify(values)
      });
      toast.success("Opportunity updated successfully.");
      setIsEditFormOpen(false);
      onDataChange();
    } catch (error) {
      toast.error("Failed to update opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const confirmDelete = async () => {
    if (!selectedOpportunity) return;
    setIsSubmitting(true);
    try {
      await api(`/api/opportunities/${selectedOpportunity.id}`, { method: 'DELETE' });
      toast.success("Opportunity deleted successfully.");
      setIsDeleteConfirmOpen(false);
      onDataChange();
    } catch (error) {
      toast.error("Failed to delete opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCorners}>
        <div className="flex gap-4 p-1">
          <SortableContext items={stages.map((s) => s.id)}>
            {stages.map((stage) =>
            <StageColumn
              key={stage.id}
              stage={stage}
              opportunities={opportunitiesByStage[stage.id] || []}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick} />
            )}
          </SortableContext>
        </div>
        <DragOverlay>
          {activeOpportunity ? <OpportunityCard opportunity={activeOpportunity} onEdit={() => {}} onDelete={() => {}} /> : null}
        </DragOverlay>
      </DndContext>
      {}
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
          </DialogHeader>
          <OpportunityForm
            initialData={selectedOpportunity}
            onSubmit={handleEditSubmit}
            isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>
      {}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the opportunity "{selectedOpportunity?.title}". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}