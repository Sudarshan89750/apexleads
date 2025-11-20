import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Workflow, WorkflowAction } from '@shared/types';
import type { Node, Edge } from '@xyflow/react';
import { workflowToGraph, graphToWorkflow } from './utils';
export type DialogState = 
  | { type: 'add'; parentNodeId: string; sourceHandle?: string }
  | { type: 'edit'; action: WorkflowAction; nodeId: string }
  | { type: 'delete'; nodeId: string }
  | null;
type AutomationState = {
  workflow: Workflow | null;
  nodes: Node[];
  edges: Edge[];
  dialogState: DialogState;
  setWorkflow: (workflow: Workflow) => void;
  setNodes: (nodes: Node[]) => void;
  onNodesChange: (changes: any) => void;
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: (changes: any) => void;
  openDialog: (dialogState: NonNullable<DialogState>) => void;
  closeDialog: () => void;
  updateAction: (nodeId: string, updatedAction: WorkflowAction) => void;
  deleteAction: (nodeId: string) => void;
  addAction: (parentNodeId: string, newAction: WorkflowAction, sourceHandle?: string) => void;
  getWorkflowPayload: () => Workflow | null;
};
export const useAutomationBuilderStore = create<AutomationState>()(
  immer((set, get) => ({
    workflow: null,
    nodes: [],
    edges: [],
    dialogState: null,
    setWorkflow: (workflow) => {
      const { nodes, edges } = workflowToGraph(workflow);
      set({ workflow, nodes, edges });
    },
    setNodes: (nodes) => set({ nodes }),
    onNodesChange: (changes) => {
      // This is a simplified handler. For production, you'd use applyNodeChanges from @xyflow/react
      set((state) => {
        changes.forEach((change: any) => {
          if (change.type === 'position' && change.position) {
            const node = state.nodes.find(n => n.id === change.id);
            if (node) {
              node.position = change.position;
            }
          }
        });
      });
    },
    setEdges: (edges) => set({ edges }),
    onEdgesChange: (changes) => {
      // This is a simplified handler. For production, you'd use applyEdgeChanges from @xyflow/react
      // For this app, we don't expect user-driven edge changes.
    },
    openDialog: (dialogState) => set({ dialogState }),
    closeDialog: () => set({ dialogState: null }),
    updateAction: (nodeId, updatedAction) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id === nodeId);
        if (node) {
          node.data = updatedAction;
        }
      });
    },
    deleteAction: (nodeId) => {
      set((state) => {
        state.nodes = state.nodes.filter((n) => n.id !== nodeId);
        state.edges = state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
        // This is a simplified delete. A real implementation would need to reconnect nodes.
      });
    },
    addAction: (parentNodeId, newAction, sourceHandle) => {
      // This is a placeholder for a more complex graph manipulation logic
      console.log("Adding action:", { parentNodeId, newAction, sourceHandle });
      // A real implementation would create a new node, position it, and create an edge.
    },
    getWorkflowPayload: () => {
      const { nodes, edges, workflow } = get();
      if (!workflow) return null;
      return graphToWorkflow(workflow, nodes, edges);
    },
  }))
);