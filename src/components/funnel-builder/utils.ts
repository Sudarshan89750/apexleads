import { Edge, Node } from '@xyflow/react';
import type { Funnel, FunnelStep } from '@shared/types';
const NODE_WIDTH = 256;
const NODE_HEIGHT = 120;
const VERTICAL_GAP = 80;
export const funnelToGraph = (funnel: Funnel): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node<FunnelStep>[] = [];
  const edges: Edge[] = [];
  let yPos = 0;
  funnel.steps.forEach((step, index) => {
    const nodeId = step.id;
    nodes.push({
      id: nodeId,
      type: step.type,
      position: { x: NODE_WIDTH / 2, y: yPos },
      data: step,
    });
    if (index > 0) {
      const prevNodeId = funnel.steps[index - 1].id;
      edges.push({
        id: `${prevNodeId}-${nodeId}`,
        source: prevNodeId,
        target: nodeId,
        type: 'smoothstep',
      });
    }
    yPos += NODE_HEIGHT + VERTICAL_GAP;
  });
  // Add a final placeholder node
  const lastNodeId = funnel.steps[funnel.steps.length - 1]?.id;
  if (lastNodeId) {
    const placeholderId = 'final-placeholder';
    nodes.push({
      id: placeholderId,
      type: 'placeholder',
      position: { x: NODE_WIDTH / 2, y: yPos },
      data: {},
    });
    edges.push({
      id: `${lastNodeId}-${placeholderId}`,
      source: lastNodeId,
      target: placeholderId,
      type: 'smoothstep',
    });
  }
  return { nodes, edges };
};
export const graphToFunnel = (originalFunnel: Funnel, nodes: Node[]): Funnel => {
  const steps: FunnelStep[] = nodes
    .filter((node): node is Node<FunnelStep> => !!node.data.id)
    .sort((a, b) => a.position.y - b.position.y)
    .map(node => node.data);
  return {
    ...originalFunnel,
    steps,
  };
};