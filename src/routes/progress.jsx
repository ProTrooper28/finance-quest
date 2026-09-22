import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { ProgressPage } from "@/pages/progress-page";

export const Route = createFileRoute("/progress")({
  component: () => (
    <AppLayout>
      <ProgressPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
