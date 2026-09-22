import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { MentorPage } from "@/pages/mentor-page";

export const Route = createFileRoute("/mentor")({
  component: () => (
    <AppLayout>
      <MentorPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
