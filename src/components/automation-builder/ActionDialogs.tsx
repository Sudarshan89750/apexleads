import React from 'react';
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
import { useAutomationBuilderStore } from './store';
import type { WorkflowAction } from '@shared/types';
const actionSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  details: z.string().min(2, 'Details are required'),
});
type ActionFormValues = z.infer<typeof actionSchema>;
export function ActionDialogs() {
  const dialogState = useAutomationBuilderStore((s) => s.dialogState);
  const closeDialog = useAutomationBuilderStore((s) => s.closeDialog);
  const updateAction = useAutomationBuilderStore((s) => s.updateAction);
  const isOpen = dialogState?.type === 'edit';
  const editingAction = isOpen ? dialogState.action : null;
  const nodeId = isOpen ? dialogState.nodeId : null;
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    values: {
      name: editingAction?.name || '',
      details: editingAction?.details || '',
    },
  });
  const onSubmit = (values: ActionFormValues) => {
    if (!editingAction || !nodeId) return;
    const updated: WorkflowAction = {
      ...editingAction,
      ...values,
    };
    updateAction(nodeId, updated);
    closeDialog();
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Action</DialogTitle>
          <DialogDescription>Update the details for this workflow action.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}