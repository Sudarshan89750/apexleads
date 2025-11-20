import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Plus } from 'lucide-react';
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider, useReactFlow, NodeTypes } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Funnel } from '@shared/types';
import { toast } from "sonner";
import { PageNode, FormNode, UpsellNode, ThankYouNode, PlaceholderNode } from '@/components/funnel-builder/nodes';
import { useFunnelBuilderStore } from '@/components/funnel-builder/store';
const nodeTypes: NodeTypes = {
  page: PageNode,
  form: FormNode,
  upsell: UpsellNode,
  thank_you: ThankYouNode,
  placeholder: PlaceholderNode,
};
function FunnelBuilderContent() {
  const { id } = useParams<{ id: string }>();
  const { fitView } = useReactFlow();
  const {
    funnel,
    nodes,
    edges,
    setFunnel,
    onNodesChange,
    onEdgesChange,
    getFunnelPayload,
  } = useFunnelBuilderStore((s) => s);
  const [loading, setLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  useEffect(() => {
    if (!id) return;
    const fetchFunnel = async () => {
      try {
        setLoading(true);
        const data = await api<Funnel>(`/api/funnels/${id}`);
        setFunnel(data);
      } catch (error) {
        toast.error("Failed to fetch funnel details.");
      } finally {
        setLoading(false);
      }
    };
    fetchFunnel();
  }, [id, setFunnel]);
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => fitView(), 50);
    }
  }, [nodes.length, fitView]);
  const handleSaveFunnel = async () => {
    const payload = getFunnelPayload();
    if (!payload) return;
    setIsSaving(true);
    try {
      await api(`/api/funnels/${payload.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      toast.success("Funnel saved successfully.");
    } catch (error) {
      toast.error("Failed to save funnel.");
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
  if (!funnel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Funnel not found</h2>
        <p className="text-muted-foreground mt-2">The requested funnel could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link to="/marketing/funnels">Back to Funnels</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col">
      <header className="p-4 border-b flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/marketing/funnels">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">{funnel.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
          <Button onClick={handleSaveFunnel} disabled={isSaving}>
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
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
export function FunnelBuilderPage() {
  return (
    <ReactFlowProvider>
      <FunnelBuilderContent />
    </ReactFlowProvider>
  );
}