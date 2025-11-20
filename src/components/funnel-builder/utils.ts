import { Edge, Node } from '@xyflow/react';
import type { Funnel, FunnelStep } from '@shared/types';
const NODE_WIDTH = 256;
const NODE_HEIGHT = 120;
const VERTICAL_GAP = 80;
export const funnelToGraph = (funnel: Funnel): { nodes: Node<any>[]; edges: Edge[] } => {
  const nodes: Node<any>[] = [];
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
  const lastNodeId = funnel.steps[funnel.steps.length - 1]?.id;
  if (lastNodeId) {
    const placeholderId = 'final-placeholder';
    nodes.push({
      id: placeholderId,
      type: 'placeholder',
      position: { x: NODE_WIDTH / 2, y: yPos },
      data: { parentNodeId: lastNodeId },
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
function isFunnelStepNode(node: Node<any>): node is Node<FunnelStep> {
    return node.data && 'id' in node.data && 'type' in node.data && 'name' in node.data && 'path' in node.data && node.type !== 'placeholder';
}
export const graphToFunnel = (originalFunnel: Funnel, nodes: Node<any>[]): Funnel => {
  const steps: FunnelStep[] = nodes
    .filter(isFunnelStepNode)
    .sort((a, b) => a.position.y - b.position.y)
    .map(node => node.data);
  return {
    ...originalFunnel,
    steps,
  };
};
export const addStepToGraph = (
  nodes: Node<any>[],
  edges: Edge[],
  parentNodeId: string,
  newStep: FunnelStep
): { nodes: Node<any>[]; edges: Edge[] } => {
  const parentNode = nodes.find(n => n.id === parentNodeId);
  if (!parentNode) return { nodes, edges };
  const newNodes = [...nodes];
  const newEdges = [...edges];
  const newNode: Node<FunnelStep> = {
    id: newStep.id,
    type: newStep.type,
    position: { x: parentNode.position.x, y: parentNode.position.y + NODE_HEIGHT + VERTICAL_GAP },
    data: newStep,
  };
  const originalTargetEdge = edges.find(e => e.source === parentNodeId);
  const originalTargetNodeId = originalTargetEdge?.target;
  const filteredEdges = edges.filter(e => e.source !== parentNodeId);
  newNodes.push(newNode);
  filteredEdges.push({ id: `${parentNodeId}-${newNode.id}`, source: parentNodeId, target: newNode.id, type: 'smoothstep' });
  if (originalTargetNodeId) {
    filteredEdges.push({ id: `${newNode.id}-${originalTargetNodeId}`, source: newNode.id, target: originalTargetNodeId, type: 'smoothstep' });
  }
  const sortedNodes = newNodes
    .filter(n => n.type !== 'placeholder')
    .sort((a, b) => a.position.y - b.position.y);
  let yPos = 0;
  const finalNodes = sortedNodes.map(n => {
    const updatedNode = { ...n, position: { ...n.position, y: yPos } };
    yPos += NODE_HEIGHT + VERTICAL_GAP;
    return updatedNode;
  });
  const lastNode = finalNodes[finalNodes.length - 1];
  const placeholder = nodes.find(n => n.type === 'placeholder');
  if (placeholder && lastNode) {
    finalNodes.push({ ...placeholder, position: { ...placeholder.position, y: yPos }, data: { parentNodeId: lastNode.id } });
  }
  return { nodes: finalNodes, edges: filteredEdges };
};
export const removeStepFromGraph = (
  nodes: Node<any>[],
  edges: Edge[],
  nodeIdToRemove: string
): { nodes: Node<any>[]; edges: Edge[] } => {
  const nodeToRemove = nodes.find(n => n.id === nodeIdToRemove);
  if (!nodeToRemove || nodeToRemove.type === 'placeholder') return { nodes, edges };
  const incomingEdge = edges.find(e => e.target === nodeIdToRemove);
  const outgoingEdge = edges.find(e => e.source === nodeIdToRemove);
  let newEdges = edges.filter(e => e.source !== nodeIdToRemove && e.target !== nodeIdToRemove);
  if (incomingEdge && outgoingEdge) {
    newEdges.push({
      id: `${incomingEdge.source}-${outgoingEdge.target}`,
      source: incomingEdge.source,
      target: outgoingEdge.target,
      type: 'smoothstep',
    });
  }
  const remainingNodes = nodes.filter(n => n.id !== nodeIdToRemove);
  const sortedNodes = remainingNodes
    .filter(n => n.type !== 'placeholder')
    .sort((a, b) => a.position.y - b.position.y);
  let yPos = 0;
  const finalNodes = sortedNodes.map(n => {
    const updatedNode = { ...n, position: { ...n.position, y: yPos } };
    yPos += NODE_HEIGHT + VERTICAL_GAP;
    return updatedNode;
  });
  const placeholder = remainingNodes.find(n => n.type === 'placeholder');
  const lastNode = finalNodes[finalNodes.length - 1];
  if (placeholder && lastNode) {
    finalNodes.push({ ...placeholder, position: { ...placeholder.position, y: yPos }, data: { parentNodeId: lastNode.id } });
  }
  return { nodes: finalNodes, edges: newEdges };
};