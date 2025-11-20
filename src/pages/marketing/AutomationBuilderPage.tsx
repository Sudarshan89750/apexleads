import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mail, Tag, Plus, Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from '@/lib/api-client';
import type { Workflow, WorkflowAction } from '@shared/types';
import { toast } from "sonner";
const iconMap: Record<WorkflowAction['type'] | Workflow['trigger']['type'], JSX.Element> = {
  contact_created: <PlayCircle className="h-6 w-6 text-green-500" />,
  form_submitted: <PlayCircle className="h-6 w-6 text-green-500" />,
  send_email: <Mail className="h-6 w-6 text-blue-500" />,
  add_tag: <Tag className="h-6 w-6 text-purple-500" />,
};
export function AutomationBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [isEditActionOpen, setIsEditActionOpen] = useState(false);
  const [newActionType, setNewActionType] = useState<WorkflowAction['type'] | ''>('');
  const [editingAction, setEditingAction] = useState<{ action: WorkflowAction; index: number } | null>(null);
  const fetchWorkflow = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api<Workflow>(`/api/workflows/${id}`);
      setWorkflow(data);
    } catch (error) {
      toast.error("Failed to fetch workflow details.");
      setWorkflow(null);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);
  const handleSaveWorkflow = async () => {
    if (!workflow) return;
    setIsSaving(true);
    try {
      await api(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        body: JSON.stringify(workflow),
      });
      toast.success("Workflow saved successfully.");
    } catch (error) {
      toast.error("Failed to save workflow.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleAddAction = () => {
    if (!newActionType || !workflow) return;
    const newAction: WorkflowAction = newActionType === 'send_email'
      ? { type: 'send_email', name: 'Send Email', details: 'Template: New Email' }
      : { type: 'add_tag', name: 'Add Tag', details: 'Tag: New Tag' };
    setWorkflow(prev => prev ? { ...prev, actions: [...prev.actions, newAction] } : null);
    setIsAddActionOpen(false);
    setNewActionType('');
  };
  const handleEditActionClick = (action: WorkflowAction, index: number) => {
    setEditingAction({ action, index });
    setIsEditActionOpen(true);
  };
  const handleUpdateAction = () => {
    if (!editingAction || !workflow) return;
    const updatedActions = [...workflow.actions];
    updatedActions[editingAction.index] = editingAction.action;
    setWorkflow({ ...workflow, actions: updatedActions });
    setIsEditActionOpen(false);
    setEditingAction(null);
  };
  const handleDeleteAction = (index: number) => {
    if (!workflow) return;
    const updatedActions = workflow.actions.filter((_, i) => i !== index);
    setWorkflow({ ...workflow, actions: updatedActions });
    toast.info("Action removed. Save to persist changes.");
  };
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <Skeleton className="h-16 w-full mb-8" />
        <Skeleton className="h-24 w-1/2 mx-auto" />
      </div>
    );
  }
  if (!workflow) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Workflow not found</h2>
        <p className="text-muted-foreground mt-2">The requested workflow could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link to="/marketing/automations">Back to Automations</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/marketing/automations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Automations
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{workflow.name}</h1>
        <Button onClick={handleSaveWorkflow} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Workflow
        </Button>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {iconMap[workflow.trigger.type]}
              <span>Trigger</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{workflow.trigger.name}</p>
          </CardContent>
        </Card>
        <div className="h-8 w-px bg-border" />
        {workflow.actions.map((action, index) => (
          <>
            <Card key={index} className="w-full max-w-md group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {iconMap[action.type]}
                    <span>{action.name}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditActionClick(action, index)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteAction(index)} className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{action.details}</p>
              </CardContent>
            </Card>
            <div className="h-8 w-px bg-border" />
          </>
        ))}
        <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full max-w-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new action</DialogTitle>
              <DialogDescription>Select the type of action you want to add to your workflow.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select onValueChange={(value: WorkflowAction['type']) => setNewActionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="add_tag">Add Tag</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddAction} disabled={!newActionType}>Add Action</Button>
          </DialogContent>
        </Dialog>
      </div>
      {/* Edit Action Dialog */}
      <Dialog open={isEditActionOpen} onOpenChange={setIsEditActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Action</DialogTitle>
            <DialogDescription>Update the details for this workflow action.</DialogDescription>
          </DialogHeader>
          {editingAction && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="action-name">Action Name</Label>
                <Input
                  id="action-name"
                  value={editingAction.action.name}
                  onChange={(e) => setEditingAction({ ...editingAction, action: { ...editingAction.action, name: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action-details">Details</Label>
                <Input
                  id="action-details"
                  value={editingAction.action.details}
                  onChange={(e) => setEditingAction({ ...editingAction, action: { ...editingAction.action, details: e.target.value } })}
                />
              </div>
            </div>
          )}
          <Button onClick={handleUpdateAction}>Update Action</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}