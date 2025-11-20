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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from '@/lib/api-client';
import type { Funnel } from '@shared/types';
import { PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { format } from 'date-fns';
export function FunnelListPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);
  const [newFunnelName, setNewFunnelName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const fetchFunnels = async () => {
    try {
      setLoading(true);
      const data = await api<Funnel[]>('/api/funnels');
      setFunnels(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast.error("Failed to fetch funnels.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFunnels();
  }, []);
  const handleCreateFunnel = async () => {
    if (!newFunnelName.trim()) {
      toast.error("Funnel name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newFunnel = await api<Funnel>('/api/funnels', {
        method: 'POST',
        body: JSON.stringify({ name: newFunnelName }),
      });
      toast.success("Funnel created successfully.");
      setIsCreateDialogOpen(false);
      setNewFunnelName("");
      navigate(`/marketing/funnels/${newFunnel.id}`);
    } catch (error) {
      toast.error("Failed to create funnel.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteClick = (funnel: Funnel) => {
    setSelectedFunnel(funnel);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedFunnel) return;
    setIsSubmitting(true);
    try {
      await api(`/api/funnels/${selectedFunnel.id}`, { method: 'DELETE' });
      toast.success("Funnel deleted successfully.");
      setIsDeleteDialogOpen(false);
      fetchFunnels();
    } catch (error) {
      toast.error("Failed to delete funnel.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Funnels</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Funnel
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funnel Name</TableHead>
              <TableHead>Domain</TableHead>
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
            ) : funnels.length > 0 ? (
              funnels.map((funnel) => (
                <TableRow key={funnel.id}>
                  <TableCell className="font-medium">
                    <Link to={`/marketing/funnels/${funnel.id}`} className="hover:underline">{funnel.name}</Link>
                  </TableCell>
                  <TableCell>{funnel.domain}</TableCell>
                  <TableCell>
                    <Badge variant={funnel.status === 'active' ? 'default' : 'secondary'}>
                      {funnel.status.charAt(0).toUpperCase() + funnel.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(funnel.createdAt), 'PPP')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to={`/marketing/funnels/${funnel.id}`}>Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(funnel)} className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No funnels found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Funnel</DialogTitle>
            <DialogDescription>Give your new funnel a name to get started.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={newFunnelName} onChange={(e) => setNewFunnelName(e.target.value)} className="col-span-3" placeholder="e.g., SaaS Trial Funnel" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFunnel} disabled={isSubmitting}>
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
              This will permanently delete the funnel "{selectedFunnel?.name}". This action cannot be undone.
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