import { Edge, Node } from '@xyflow/react';
import type { Workflow, WorkflowAction } from '@shared/types';
const NODE_WIDTH = 320;
const NODE_HEIGHT = 120;
const VERTICAL_GAP = 80;
const HORIZONTAL_GAP = 150;
export const workflowToGraph = (workflow: Workflow): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  // Trigger Node
  const triggerId = 'trigger';
  nodes.push({
    id: triggerId,
    type: 'trigger',
    position: { x: 0, y: 0 },
    data: { label: workflow.trigger.name, type: workflow.trigger.type },
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
      const yesBranchId = `${actionId}-yes`;
      nodes.push({
        id: yesBranchId,
        type: 'placeholder',
        position: { x: -HORIZONTAL_GAP, y: yPos + NODE_HEIGHT + VERTICAL_GAP },
        data: { label: 'Add action for YES' },
      });
      edges.push({ id: `${actionId}-${yesBranchId}`, source: actionId, target: yesBranchId, sourceHandle: 'yes', label: 'Yes', type: 'smoothstep' });
      // Placeholder for 'No' branch
      const noBranchId = `${actionId}-no`;
      nodes.push({
        id: noBranchId,
        type: 'placeholder',
        position: { x: HORIZONTAL_GAP, y: yPos + NODE_HEIGHT + VERTICAL_GAP },
        data: { label: 'Add action for NO' },
      });
      edges.push({ id: `${actionId}-${noBranchId}`, source: actionId, target: noBranchId, sourceHandle: 'no', label: 'No', type: 'smoothstep' });
      // For simplicity, we don't continue the main flow after a branch in this visualizer
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
  return { nodes, edges };
};