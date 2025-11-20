import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Opportunity } from "@shared/types";
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  value: z.coerce.number().min(0, { message: "Value must be a positive number." }),
});
export type OpportunityFormValues = z.infer<typeof formSchema>;
interface OpportunityFormProps {
  initialData?: Opportunity | null;
  onSubmit: (values: OpportunityFormValues) => void;
  isLoading?: boolean;
}
export function OpportunityForm({ initialData, onSubmit, isLoading }: OpportunityFormProps) {
  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      contactName: initialData?.contactName || "",
      value: initialData?.value || 0,
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opportunity Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Website Redesign Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Create Opportunity"}
        </Button>
      </form>
    </Form>
  );
}