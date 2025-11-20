import { useState, useEffect } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Opportunity, PipelineStage } from '@shared/types';
type OpportunitiesData = {
  opportunities: Opportunity[];
  stages: PipelineStage[];
};
export function OpportunitiesPage() {
  const [data, setData] = useState<OpportunitiesData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchOpportunities() {
      try {
        setLoading(true);
        const opportunitiesData = await api<OpportunitiesData>('/api/opportunities');
        setData(opportunitiesData);
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunities();
  }, []);
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities Pipeline</h1>
      </div>
      <div className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex gap-4">
            <Skeleton className="w-72 h-[600px]" />
            <Skeleton className="w-72 h-[600px]" />
            <Skeleton className="w-72 h-[600px]" />
            <Skeleton className="w-72 h-[600px]" />
          </div>
        ) : data ? (
          <KanbanBoard stages={data.stages} opportunities={data.opportunities} />
        ) : (
          <div className="text-center text-muted-foreground">Could not load opportunities.</div>
        )}
      </div>
    </div>
  );
}