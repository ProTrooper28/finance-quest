import { useEffect } from "react";
import { useNavigate } from "@/utils/router";

import { AiLoader } from "@/components/result/ai-loader";
import { useAnalysisAnimation } from "@/hooks/use-auth-flow";
import { useAssessment } from "@/hooks/use-assessment";

const NAVIGATE_DELAY_MS = 700;

export function AnalysisPage() {
  const navigate = useNavigate();
  const { progress, stepsDone, done } = useAnalysisAnimation(4500);
  const { finish } = useAssessment();

  /* Compute the result once the animation completes (or on direct visits). */
  useEffect(() => {
    if (!done) return undefined;
    finish();
    const t = setTimeout(() => navigate("/result", { replace: true }), NAVIGATE_DELAY_MS);
    return () => clearTimeout(t);
  }, [done, finish, navigate]);

  return (
    <div className="grid min-h-dvh place-items-center bg-navy px-4">
      <AiLoader stepsDone={stepsDone} progress={progress} />
    </div>
  );
}
