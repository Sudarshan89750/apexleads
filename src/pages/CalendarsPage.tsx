import { Calendar } from 'lucide-react';
export function CalendarsPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight">
          Calendars & Appointments
        </h3>
        <p className="text-sm text-muted-foreground">
          This feature is coming soon. Manage your schedule and book appointments seamlessly.
        </p>
      </div>
    </div>
  );
}