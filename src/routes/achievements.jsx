import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { AchievementsPage } from "@/pages/achievements-page";

export const Route = createFileRoute("/achievements")({
  component: () => (
    <AppLayout>
      <AchievementsPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
