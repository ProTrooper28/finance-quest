import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { FraudPage } from "@/pages/fraud-page";

export const Route = createFileRoute("/fraud-lab")({
  component: () => (
    <AppLayout>
      <FraudPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
