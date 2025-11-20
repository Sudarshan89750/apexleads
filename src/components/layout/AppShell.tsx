import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalSearch } from "@/components/GlobalSearch";
export function AppShell() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <main className="flex flex-1 flex-col sm:py-4 sm:pl-14">
        <GlobalSearch />
        <Outlet />
      </main>
      <Toaster richColors closeButton />
    </div>
  );
}