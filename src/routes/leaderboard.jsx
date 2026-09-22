import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { LeaderboardPage } from "@/pages/leaderboard-page";

export const Route = createFileRoute("/leaderboard")({
  component: () => (
    <AppLayout>
      <LeaderboardPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
