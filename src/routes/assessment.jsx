import { createFileRoute } from "@tanstack/react-router";

import { AssessmentLayout } from "@/layouts/assessment-layout";
import { AssessmentPage } from "@/pages/assessment-page";
import { AssessmentProvider } from "@/hooks/assessment-context";

export const Route = createFileRoute("/assessment")({
  component: () => (
    <AssessmentProvider>
      <AssessmentLayout>
        <AssessmentPage />
      </AssessmentLayout>
    </AssessmentProvider>
  ),
  staticData: { title: "Financial Fitness Assessment" },
});
