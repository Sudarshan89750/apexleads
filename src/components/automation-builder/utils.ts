import { Edge, Node } from '@xyflow/react';
import type { Workflow, WorkflowAction } from '@shared/types';
const NODE_HEIGHT = 120;
const VERTICAL_GAP = 80;
const HORIZONTAL_GAP = 150;
export const workflowToGraph = (workflow: Workflow): { nodes: Node<any>[]; edges: Edge[] } => {
  const nodes: Node<any>[] = [];
  const edges: Edge[] = [];
  // Trigger Node
  const triggerId = 'trigger';
  nodes.push({
    id: triggerId,
    type: 'trigger',
    position: { x: 0, y: 0 },
    data: { label: workflow.trigger.name, type: workflow.trigger.type },
    deletable: false,
  });
  let lastNodeId = triggerId;
  let yPos = NODE_HEIGHT + VERTICAL_GAP;
  workflow.actions.forEach((action, index) => {
    const actionId = `action-${index}`;
    if (action.type === 'if_else') {
      // Main If/Else node
      nodes.push({
        id: actionId,
        type: 'action',
        position: { x: 0, y: yPos },
        data: action,
      });
      edges.push({ id: `${lastNodeId}-${actionId}`, source: lastNodeId, target: actionId, type: 'smoothstep' });
      // Placeholder for 'Yes' branch
      const yesBranchId = `${actionId}-yes-placeholder`;
      nodes.push({
        id: yesBranchId,
        type: 'placeholder',
        position: { x: -HORIZONTAL_GAP, y: yPos + NODE_HEIGHT + VERTICAL_GAP },
        data: { label: 'Add action for YES', parentNodeId: actionId, sourceHandle: 'yes' },
      });
      edges.push({ id: `${actionId}-${yesBranchId}`, source: actionId, target: yesBranchId, sourceHandle: 'yes', label: 'Yes', type: 'smoothstep' });
      // Placeholder for 'No' branch
      const noBranchId = `${actionId}-no-placeholder`;
      nodes.push({
        id: noBranchId,
        type: 'placeholder',
        position: { x: HORIZONTAL_GAP, y: yPos + NODE_HEIGHT + VERTICAL_GAP },
        data: { label: 'Add action for NO', parentNodeId: actionId, sourceHandle: 'no' },
      });
      edges.push({ id: `${actionId}-${noBranchId}`, source: actionId, target: noBranchId, sourceHandle: 'no', label: 'No', type: 'smoothstep' });
      lastNodeId = ''; // End the main flow
    } else {
      nodes.push({
        id: actionId,
        type: 'action',
        position: { x: 0, y: yPos },
        data: action,
      });
      if (lastNodeId) {
        edges.push({ id: `${lastNodeId}-${actionId}`, source: lastNodeId, target: actionId, type: 'smoothstep' });
      }
      lastNodeId = actionId;
      yPos += NODE_HEIGHT + VERTICAL_GAP;
    }
  });
  // Add a final placeholder if the last action was not a branch
  if (lastNodeId) {
    const finalPlaceholderId = 'final-placeholder';
    nodes.push({
      id: finalPlaceholderId,
      type: 'placeholder',
      position: { x: 0, y: yPos },
      data: { label: 'Add action', parentNodeId: lastNodeId },
    });
    edges.push({ id: `${lastNodeId}-${finalPlaceholderId}`, source: lastNodeId, target: finalPlaceholderId, type: 'smoothstep' });
  }
  return { nodes, edges };
};
export const graphToWorkflow = (
  originalWorkflow: Workflow,
  nodes: Node<any>[],
  _edges: Edge[]
): Workflow => {
  const actions: WorkflowAction[] = [];
  const actionNodes = nodes.filter(node => node.type === 'action');
  // This is a simplified conversion that assumes a linear flow for now.
  // A production implementation would need to traverse the graph from the trigger.
  actionNodes.sort((a, b) => a.position.y - b.position.y);
  for (const node of actionNodes) {
    // Type guard to ensure node.data is a valid WorkflowAction
    if (node.data && 'type' in node.data && 'name' in node.data && 'details' in node.data) {
      actions.push(node.data as WorkflowAction);
    }
  }
  return {
    ...originalWorkflow,
    actions,
  };
};