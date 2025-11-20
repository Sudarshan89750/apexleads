import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import type { EmailCampaign } from '@shared/types';
import { toast } from "sonner";
export function EmailCampaignBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<EmailCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (!id) return;
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const data = await api<EmailCampaign>(`/api/email-campaigns/${id}`);
        setCampaign(data);
      } catch (error) {
        toast.error("Failed to fetch campaign details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);
  const handleSave = async () => {
    if (!campaign) return;
    setIsSaving(true);
    try {
      await api(`/api/email-campaigns/${campaign.id}`, {
        method: 'PUT',
        body: JSON.stringify(campaign),
      });
      toast.success("Campaign saved successfully.");
    } catch (error) {
      toast.error("Failed to save campaign.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!campaign) return;
    const { name, value } = e.target;
    setCampaign({ ...campaign, [name]: value });
  };
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  if (!campaign) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Campaign not found</h2>
        <p className="text-muted-foreground mt-2">The requested campaign could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link to="/marketing/email-campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b flex items-center justify-between bg-background sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/marketing/email-campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">Email Campaign</p>
            <h1 className="text-xl font-semibold tracking-tight">{campaign.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
          <Button variant="default">
            <Send className="mr-2 h-4 w-4" />
            Send Campaign
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div>
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={campaign.subject}
              onChange={handleInputChange}
              placeholder="Your email subject line"
              className="text-lg"
            />
          </div>
          <div>
            <Label>Email Body</Label>
            <Card>
              <CardContent className="p-2">
                <Textarea
                  name="body"
                  value={campaign.body}
                  onChange={handleInputChange}
                  placeholder="Compose your email..."
                  className="min-h-[500px] border-0 focus-visible:ring-0 resize-none"
                />
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-2">
              This is a plain text editor for demonstration. A real app would have a rich text or HTML editor.
            </p>
          </div>
        </div>
        <aside className="col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={campaign.name}
                    onChange={handleInputChange}
                    placeholder="Internal campaign name"
                  />
                </div>
                {/* Placeholder for more settings */}
                <div>
                  <Label>Recipients</Label>
                  <Button variant="outline" className="w-full justify-start text-muted-foreground">
                    Select recipients...
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}