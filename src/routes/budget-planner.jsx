import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout";
import { BudgetPage } from "@/pages/budget-page";

export const Route = createFileRoute("/budget-planner")({
  component: () => (
    <AppLayout>
      <BudgetPage />
    </AppLayout>
  ),
  staticData: { title: "FinQuest" },
});
