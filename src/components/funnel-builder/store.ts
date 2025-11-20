import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Funnel, FunnelStep } from '@shared/types';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { funnelToGraph, graphToFunnel, addStepToGraph, removeStepFromGraph } from './utils';
export type DialogState =
  | { type: 'add'; parentNodeId: string }
  | { type: 'edit'; step: FunnelStep; nodeId: string }
  | { type: 'delete'; nodeId: string }
  | null;
type FunnelState = {
  funnel: Funnel | null;
  nodes: Node[];
  edges: Edge[];
  dialogState: DialogState;
  setFunnel: (funnel: Funnel) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  openDialog: (dialogState: NonNullable<DialogState>) => void;
  closeDialog: () => void;
  addStep: (parentNodeId: string, stepType: FunnelStep['type']) => void;
  updateStep: (nodeId: string, updatedStep: FunnelStep) => void;
  deleteStep: (nodeId: string) => void;
  getFunnelPayload: () => Funnel | null;
};
export const useFunnelBuilderStore = create<FunnelState>()(
  immer((set, get) => ({
    funnel: null,
    nodes: [],
    edges: [],
    dialogState: null,
    setFunnel: (funnel) => {
      const { nodes, edges } = funnelToGraph(funnel);
      set({ funnel, nodes, edges });
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
    addStep: (parentNodeId, stepType) => {
      const newStep: FunnelStep = {
        id: crypto.randomUUID(),
        type: stepType,
        name: `${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Step`,
        path: `/${stepType}-${Math.random().toString(36).substring(7)}`,
      };
      const { nodes, edges } = addStepToGraph(get().nodes, get().edges, parentNodeId, newStep);
      set({ nodes, edges });
    },
    updateStep: (nodeId, updatedStep) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id === nodeId);
        if (node) {
          node.data = updatedStep;
        }
      });
    },
    deleteStep: (nodeId) => {
      const { nodes, edges } = removeStepFromGraph(get().nodes, get().edges, nodeId);
      set({ nodes, edges });
    },
    getFunnelPayload: () => {
      const { nodes, funnel } = get();
      if (!funnel) return null;
      return graphToFunnel(funnel, nodes);
    },
  }))
);