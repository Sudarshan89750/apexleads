import { useState, useEffect, useCallback } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from '@/lib/api-client';
import type { Opportunity, PipelineStage } from '@shared/types';
import { PlusCircle } from 'lucide-react';
import { OpportunityForm, OpportunityFormValues } from '@/components/OpportunityForm';
import { toast } from "sonner";
type OpportunitiesData = {
  opportunities: Opportunity[];
  stages: PipelineStage[];
};
export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api<OpportunitiesData>('/api/opportunities');
      setOpportunities(data.opportunities);
      setStages(data.stages);
    } catch (error) {
      toast.error("Failed to fetch opportunities.");
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);
  const handleAddOpportunity = async (values: OpportunityFormValues) => {
    setIsSubmitting(true);
    try {
      // Add to the first stage by default
      const firstStageId = stages[0]?.id;
      if (!firstStageId) {
        toast.error("No pipeline stages found. Cannot add opportunity.");
        return;
      }
      await api('/api/opportunities', {
        method: 'POST',
        body: JSON.stringify({ ...values, stageId: firstStageId }),
      });
      toast.success("Opportunity created successfully.");
      setIsFormOpen(false);
      fetchOpportunities(); // Refresh data
    } catch (error) {
      toast.error("Failed to create opportunity.");
      console.error("Failed to create opportunity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities Pipeline</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>
      <div className="flex-1 overflow-x-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex gap-4">
            <Skeleton className="w-72 h-[600px]" />
            <Skeleton className="w-72 h-[600px]" />
            <Skeleton className="w-72 h-[600px]" />
            <Skeleton className="w-72 h-[600px]" />
          </div>
        ) : stages.length > 0 ? (
          <KanbanBoard
            stages={stages}
            opportunities={opportunities}
            onDataChange={fetchOpportunities}
          />
        ) : (
          <div className="text-center text-muted-foreground">Could not load opportunities pipeline.</div>
        )}
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Opportunity</DialogTitle>
            <DialogDescription>
              Fill in the details for the new opportunity. It will be added to the first stage of the pipeline.
            </DialogDescription>
          </DialogHeader>
          <OpportunityForm
            onSubmit={handleAddOpportunity}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}