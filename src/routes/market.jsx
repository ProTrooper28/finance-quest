import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { MarketPage } from "@/pages/market-page";

export const Route = createFileRoute("/market")({
  component: () => (
    <AppLayout>
      <MarketPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
