import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Funnel } from '@shared/types';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { funnelToGraph, graphToFunnel } from './utils';
type FunnelState = {
  funnel: Funnel | null;
  nodes: Node[];
  edges: Edge[];
  setFunnel: (funnel: Funnel) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  getFunnelPayload: () => Funnel | null;
};
export const useFunnelBuilderStore = create<FunnelState>()(
  immer((set, get) => ({
    funnel: null,
    nodes: [],
    edges: [],
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
    getFunnelPayload: () => {
      const { nodes, funnel } = get();
      if (!funnel) return null;
      return graphToFunnel(funnel, nodes);
    },
  }))
);