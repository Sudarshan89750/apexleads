import { Megaphone } from 'lucide-react';
export function MarketingPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Megaphone className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight">
          Marketing Automation
        </h3>
        <p className="text-sm text-muted-foreground">
          This feature is coming soon. Build campaigns, funnels, and workflows.
        </p>
      </div>
    </div>
  );
}