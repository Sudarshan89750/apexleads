import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PlayCircle, Mail, Tag, Clock, GitFork, MessageSquare, CalendarPlus, TagIcon, PlusCircle
} from 'lucide-react';
import type { WorkflowAction, WorkflowTrigger } from '@shared/types';
const iconMap: Record<WorkflowAction['type'] | WorkflowTrigger['type'], JSX.Element> = {
  contact_created: <PlayCircle className="h-5 w-5 text-green-500" />,
  form_submitted: <PlayCircle className="h-5 w-5 text-green-500" />,
  appointment_booked: <CalendarPlus className="h-5 w-5 text-green-500" />,
  tag_added: <TagIcon className="h-5 w-5 text-green-500" />,
  send_email: <Mail className="h-5 w-5 text-blue-500" />,
  add_tag: <Tag className="h-5 w-5 text-purple-500" />,
  wait: <Clock className="h-5 w-5 text-yellow-500" />,
  if_else: <GitFork className="h-5 w-5 text-orange-500" />,
  send_sms: <MessageSquare className="h-5 w-5 text-teal-500" />,
};
export const TriggerNode: React.FC<NodeProps<{ label: string; type: WorkflowTrigger['type'] }>> = ({ data }) => {
  return (
    <Card className="w-80 shadow-md border-2 border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          {iconMap[data.type]}
          <span>Trigger</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{data.label}</p>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </Card>
  );
};
export const ActionNode: React.FC<NodeProps<WorkflowAction>> = ({ data }) => {
  const isBranching = data.type === 'if_else';
  return (
    <Card className="w-80 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          {iconMap[data.type]}
          <span>{data.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{data.details}</p>
      </CardContent>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      {isBranching ? (
        <>
          <Handle type="source" position={Position.Bottom} id="yes" style={{ left: '25%' }} className="!bg-green-500" />
          <Handle type="source" position={Position.Bottom} id="no" style={{ left: '75%' }} className="!bg-red-500" />
        </>
      ) : (
        <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
      )}
    </Card>
  );
};
export const PlaceholderNode: React.FC<NodeProps<{ label: string }>> = ({ data }) => {
  return (
    <>
      <div className="w-80 h-30 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer">
        <div className="text-center text-muted-foreground">
          <PlusCircle className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm font-medium">{data.label}</p>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    </>
  );
};