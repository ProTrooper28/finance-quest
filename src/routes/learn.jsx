import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { LearnPage } from "@/pages/learn-page";

export const Route = createFileRoute("/learn")({
  component: () => (
    <AppLayout>
      <LearnPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
