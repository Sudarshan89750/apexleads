import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, Save, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { ReactFlow, Background, Controls, MiniMap, Panel, useReactFlow, NodeTypes } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Workflow } from '@shared/types';
import { toast } from "sonner";
import { TriggerNode, ActionNode, PlaceholderNode } from '@/components/automation-builder/nodes';
import { useAutomationBuilderStore } from '@/components/automation-builder/store';
import { ActionDialogs } from '@/components/automation-builder/ActionDialogs';
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  placeholder: PlaceholderNode,
};
function AutomationBuilderContent() {
  const { id } = useParams<{ id: string }>();
  const { fitView } = useReactFlow();
  const {
    workflow,
    nodes,
    edges,
    setWorkflow,
    onNodesChange,
    onEdgesChange,
    getWorkflowPayload,
  } = useAutomationBuilderStore((s) => ({
    workflow: s.workflow,
    nodes: s.nodes,
    edges: s.edges,
    setWorkflow: s.setWorkflow,
    onNodesChange: s.onNodesChange,
    onEdgesChange: s.onEdgesChange,
    getWorkflowPayload: s.getWorkflowPayload,
  }));
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  useEffect(() => {
    if (!id) return;
    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        const data = await api<Workflow>(`/api/workflows/${id}`);
        setWorkflow(data);
      } catch (error) {
        toast.error("Failed to fetch workflow details.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflow();
  }, [id, setWorkflow]);
  useEffect(() => {
    // Ensure fitView is called after nodes are loaded
    if (nodes.length > 0) {
      setTimeout(() => fitView(), 50);
    }
  }, [nodes.length, fitView]);
  const handleSaveWorkflow = async () => {
    const payload = getWorkflowPayload();
    if (!payload) return;
    setIsSaving(true);
    try {
      await api(`/api/workflows/${payload.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
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
            <Button variant="outline" size="icon" onClick={() => fitView()}><Maximize className="h-4 w-4" /></Button>
          </Panel>
        </ReactFlow>
        <ActionDialogs />
      </div>
    </div>
  );
}
import { ReactFlowProvider } from '@xyflow/react';
export function AutomationBuilderPage() {
  return (
    <ReactFlowProvider>
      <AutomationBuilderContent />
    </ReactFlowProvider>
  );
}