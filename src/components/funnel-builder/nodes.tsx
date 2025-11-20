import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ListChecks, ArrowUpCircle, PartyPopper, PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { FunnelStep } from '@shared/types';
import { useFunnelBuilderStore } from './store';
const iconMap: Record<FunnelStep['type'], JSX.Element> = {
  page: <FileText className="h-5 w-5 text-blue-500" />,
  form: <ListChecks className="h-5 w-5 text-purple-500" />,
  upsell: <ArrowUpCircle className="h-5 w-5 text-green-500" />,
  thank_you: <PartyPopper className="h-5 w-5 text-yellow-500" />,
};
const BaseNode: React.FC<NodeProps<FunnelStep>> = ({ data, id }) => {
  const openDialog = useFunnelBuilderStore((s) => s.openDialog);
  return (
    <Card className="w-64 shadow-md group">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-3">
            {iconMap[data.type]}
            <span>{data.name}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDialog({ type: 'edit', step: data, nodeId: id })}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => openDialog({ type: 'delete', nodeId: id })}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">Path: {data.path}</p>
      </CardContent>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </Card>
  );
};
export const PageNode: React.FC<NodeProps<FunnelStep>> = (props) => <BaseNode {...props} />;
export const FormNode: React.FC<NodeProps<FunnelStep>> = (props) => <BaseNode {...props} />;
export const UpsellNode: React.FC<NodeProps<FunnelStep>> = (props) => <BaseNode {...props} />;
export const ThankYouNode: React.FC<NodeProps<FunnelStep>> = (props) => <BaseNode {...props} />;
export const PlaceholderNode: React.FC<NodeProps<{ parentNodeId: string }>> = ({ data }) => {
  const openDialog = useFunnelBuilderStore((s) => s.openDialog);
  return (
    <>
      <div
        className="w-64 h-24 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer"
        onClick={() => openDialog({ type: 'add', parentNodeId: data.parentNodeId })}
      >
        <div className="text-center text-muted-foreground">
          <PlusCircle className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm font-medium">Add Funnel Step</p>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
    </>
  );
};