import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { ProfilePage } from "@/pages/profile-page";

export const Route = createFileRoute("/profile")({
  component: () => (
    <AppLayout>
      <ProfilePage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
