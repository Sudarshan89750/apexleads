import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Mail, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Workflow } from '@shared/types';
import { toast } from "sonner";
const iconMap = {
  contact_created: <PlayCircle className="h-6 w-6 text-green-500" />,
  form_submitted: <PlayCircle className="h-6 w-6 text-green-500" />,
  send_email: <Mail className="h-6 w-6 text-blue-500" />,
  add_tag: <Tag className="h-6 w-6 text-purple-500" />,
};
export function AutomationBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchWorkflow = async () => {
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
    };
    fetchWorkflow();
  }, [id]);
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
        <Button>Save Workflow</Button>
      </div>
      <div className="flex flex-col items-center space-y-4">
        {/* Trigger */}
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
        {/* Actions */}
        {workflow.actions.map((action, index) => (
          <>
            <Card key={index} className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {iconMap[action.type]}
                  <span>{action.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{action.details}</p>
              </CardContent>
            </Card>
            <div className="h-8 w-px bg-border" />
          </>
        ))}
        {/* Add Action */}
        <Button variant="outline" className="w-full max-w-md">
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
        <p className="text-sm text-muted-foreground">Workflow builder UI is coming soon.</p>
      </div>
    </div>
  );
}