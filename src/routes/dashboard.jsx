import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { DashboardPage } from "@/pages/dashboard-page";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
