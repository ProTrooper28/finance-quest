import { createFileRoute } from "@tanstack/react-router";

import { ResultPage } from "@/pages/result-page";

export const Route = createFileRoute("/result")({
  component: ResultPage,
  staticData: { title: "Your financial profile" },
});
