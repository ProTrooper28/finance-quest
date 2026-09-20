import { createFileRoute } from "@tanstack/react-router";

import { AnalysisPage } from "@/pages/analysis-page";

export const Route = createFileRoute("/analysis")({
  component: AnalysisPage,
  staticData: { title: "Analyzing your profile" },
});
