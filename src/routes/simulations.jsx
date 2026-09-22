import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { SimulationsPage } from "@/pages/simulations-page";

export const Route = createFileRoute("/simulations")({
  component: () => (
    <AppLayout>
      <SimulationsPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
