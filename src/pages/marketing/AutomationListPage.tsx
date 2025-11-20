import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from '@/lib/api-client';
import type { Workflow } from '@shared/types';
import { PlusCircle, MoreHorizontal, Loader2, Zap } from 'lucide-react';
import { toast } from "sonner";
import { formatDistanceToNow } from 'date-fns';
export function AutomationListPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await api<Workflow[]>('/api/workflows');
      setWorkflows(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast.error("Failed to fetch workflows.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWorkflows();
  }, []);
  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) {
      toast.error("Workflow name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newWorkflow = await api<Workflow>('/api/workflows', {
        method: 'POST',
        body: JSON.stringify({ name: newWorkflowName }),
      });
      toast.success("Workflow created successfully.");
      setIsCreateDialogOpen(false);
      setNewWorkflowName("");
      navigate(`/marketing/automations/${newWorkflow.id}`);
    } catch (error) {
      toast.error("Failed to create workflow.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleToggleStatus = async (workflow: Workflow) => {
    const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
    try {
      await api(`/api/workflows/${workflow.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Workflow status updated to ${newStatus}.`);
      fetchWorkflows();
    } catch (error) {
      toast.error("Failed to update workflow status.");
    }
  };
  const handleDeleteClick = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedWorkflow) return;
    setIsSubmitting(true);
    try {
      await api(`/api/workflows/${selectedWorkflow.id}`, { method: 'DELETE' });
      toast.success("Workflow deleted successfully.");
      setIsDeleteDialogOpen(false);
      fetchWorkflows();
    } catch (error) {
      toast.error("Failed to delete workflow.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Automation Workflows</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell>
                </TableRow>
              ))
            ) : workflows.length > 0 ? (
              workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">
                    <Link to={`/marketing/automations/${workflow.id}`} className="hover:underline">{workflow.name}</Link>
                  </TableCell>
                  <TableCell>{workflow.trigger.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={workflow.status === 'active'}
                        onCheckedChange={() => handleToggleStatus(workflow)}
                        aria-label="Toggle workflow status"
                      />
                      <Badge variant={workflow.status === 'active' ? 'default' : 'outline'}>
                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatDistanceToNow(new Date(workflow.createdAt), { addSuffix: true })}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to={`/marketing/automations/${workflow.id}`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(workflow)} className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No workflows found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>Give your new automation a name to get started.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={newWorkflowName} onChange={(e) => setNewWorkflowName(e.target.value)} className="col-span-3" placeholder="e.g., New Lead Welcome Series" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateWorkflow} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create and Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the workflow "{selectedWorkflow?.name}". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}