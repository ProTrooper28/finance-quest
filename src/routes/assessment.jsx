import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AssessmentLayout } from "@/layouts/assessment-layout";
import { AssessmentPage } from "@/pages/assessment-page";
import { AssessmentProvider } from "@/hooks/assessment-context";
import { isAssessmentCompleted } from "@/hooks/use-assessment";

function AssessmentFlow() {
  const navigate = useNavigate();

  /* Returning users shouldn't be forced through this again — send them to
     the dashboard. Retaking is always possible from the result screen. */
  useEffect(() => {
    if (isAssessmentCompleted()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  return (
    <AssessmentProvider>
      <AssessmentLayout>
        <AssessmentPage />
      </AssessmentLayout>
    </AssessmentProvider>
  );
}

export const Route = createFileRoute("/assessment")({
  component: AssessmentFlow,
  staticData: { title: "Financial Fitness Assessment" },
});
