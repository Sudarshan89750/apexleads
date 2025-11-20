import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Workflow, WorkflowAction } from '@shared/types';
import type { Node, Edge } from '@xyflow/react';
import { workflowToGraph, graphToWorkflow } from './utils';
import { applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
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
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
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
    onNodesChange: (changes) => {
      set((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes);
      });
    },
    onEdgesChange: (changes) => {
      set((state) => {
        state.edges = applyEdgeChanges(changes, state.edges);
      });
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