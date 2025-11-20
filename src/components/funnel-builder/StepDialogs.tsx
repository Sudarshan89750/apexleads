import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFunnelBuilderStore } from './store';
import type { FunnelStep } from '@shared/types';
import { Loader2 } from 'lucide-react';
const stepSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  path: z.string().min(1, 'Path is required').startsWith('/', 'Path must start with /'),
});
type StepFormValues = z.infer<typeof stepSchema>;
export function StepDialogs() {
  const { dialogState, closeDialog, addStep, updateStep, deleteStep } = useFunnelBuilderStore((s) => s);
  const [stepType, setStepType] = useState<FunnelStep['type'] | ''>('');
  const form = useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
  });
  useEffect(() => {
    if (dialogState?.type === 'edit') {
      form.reset({
        name: dialogState.step.name,
        path: dialogState.step.path,
      });
    } else {
      form.reset({ name: '', path: '' });
    }
  }, [dialogState, form]);
  const handleAddStep = () => {
    if (dialogState?.type === 'add' && stepType) {
      addStep(dialogState.parentNodeId, stepType);
      closeDialog();
      setStepType('');
    }
  };
  const handleEditSubmit = (values: StepFormValues) => {
    if (dialogState?.type === 'edit') {
      const updatedStep: FunnelStep = {
        ...dialogState.step,
        ...values,
      };
      updateStep(dialogState.nodeId, updatedStep);
      closeDialog();
    }
  };
  const handleDeleteConfirm = () => {
    if (dialogState?.type === 'delete') {
      deleteStep(dialogState.nodeId);
      closeDialog();
    }
  };
  if (!dialogState) return null;
  if (dialogState.type === 'add') {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Funnel Step</DialogTitle>
            <DialogDescription>Select the type of step you want to add to your funnel.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={(value: FunnelStep['type']) => setStepType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a step type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="upsell">Upsell</SelectItem>
                <SelectItem value="thank_you">Thank You Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button type="button" onClick={handleAddStep} disabled={!stepType}>Add Step</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  if (dialogState.type === 'edit') {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Funnel Step</DialogTitle>
            <DialogDescription>Update the details for this funnel step.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Step Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Path</FormLabel>
                    <FormControl><Input {...field} placeholder="/example-path" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
  if (dialogState.type === 'delete') {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete this funnel step. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  return null;
}