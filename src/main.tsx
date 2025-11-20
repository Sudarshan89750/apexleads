import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { ContactsPage } from '@/pages/ContactsPage';
import { OpportunitiesPage } from '@/pages/OpportunitiesPage';
import { CalendarsPage } from '@/pages/CalendarsPage';
import { MarketingPage } from '@/pages/MarketingPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AutomationListPage } from '@/pages/marketing/AutomationListPage';
import { AutomationBuilderPage } from '@/pages/marketing/AutomationBuilderPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "contacts", element: <ContactsPage /> },
      { path: "opportunities", element: <OpportunitiesPage /> },
      { path: "calendars", element: <CalendarsPage /> },
      {
        path: "marketing",
        element: <Outlet />,
        children: [
          { index: true, element: <MarketingPage /> },
          { path: "automations", element: <AutomationListPage /> },
          { path: "automations/:id", element: <AutomationBuilderPage /> },
        ]
      },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)