import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Save, ZoomIn, ZoomOut, FitScreen } from 'lucide-react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Panel } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Workflow } from '@shared/types';
import { toast } from "sonner";
import { workflowToGraph } from '@/components/automation-builder/utils';
import { TriggerNode, ActionNode, PlaceholderNode } from '@/components/automation-builder/nodes';
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  placeholder: PlaceholderNode,
};
export function AutomationBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const fetchWorkflow = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api<Workflow>(`/api/workflows/${id}`);
      setWorkflow(data);
      const { nodes: initialNodes, edges: initialEdges } = workflowToGraph(data);
      setNodes(initialNodes);
      setEdges(initialEdges);
    } catch (error) {
      toast.error("Failed to fetch workflow details.");
      setWorkflow(null);
    } finally {
      setLoading(false);
    }
  }, [id, setNodes, setEdges]);
  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);
  const handleSaveWorkflow = async () => {
    if (!workflow) return;
    setIsSaving(true);
    try {
      // In a real app, you'd convert the graph back to the workflow structure
      // For this demo, we save the original workflow data structure
      await api(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        body: JSON.stringify(workflow),
      });
      toast.success("Workflow saved successfully.");
    } catch (error) {
      toast.error("Failed to save workflow.");
    } finally {
      setIsSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="w-full h-full p-4">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="w-full h-[calc(100vh-10rem)]" />
      </div>
    );
  }
  if (!workflow) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Workflow not found</h2>
        <p className="text-muted-foreground mt-2">The requested workflow could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link to="/marketing/automations">Back to Automations</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col">
      <header className="p-4 border-b flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/marketing/automations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">{workflow.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
          <Button onClick={handleSaveWorkflow} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
      </header>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/30"
        >
          <Background />
          <Controls showZoom={false} showFitView={false} showInteractive={false} />
          <MiniMap />
          <Panel position="top-right" className="flex gap-2 p-2">
             <Button variant="outline" size="icon" onClick={() => {}}><ZoomIn className="h-4 w-4" /></Button>
             <Button variant="outline" size="icon" onClick={() => {}}><ZoomOut className="h-4 w-4" /></Button>
             <Button variant="outline" size="icon" onClick={() => {}}><FitScreen className="h-4 w-4" /></Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}