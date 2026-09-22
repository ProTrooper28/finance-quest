import { useEffect, useRef } from "react";
import { useNavigate } from "@/utils/router";

import { AiLoader } from "@/components/result/ai-loader";
import { useAnalysisAnimation } from "@/hooks/use-auth-flow";
import { useAssessment } from "@/hooks/use-assessment";

const NAVIGATE_DELAY_MS = 700;

export function AnalysisPage() {
  const navigate = useNavigate();
  const { progress, stepsDone, done } = useAnalysisAnimation(4500);
  const { finish } = useAssessment();

  /* Compute the result exactly once when the animation completes (or on
     direct visits). The navigation timer lives on a ref with unmount-only
     cleanup so dependency churn can never cancel the handoff. */
  const finishedRef = useRef(false);
  const timerRef = useRef(null);
  useEffect(() => {
    if (!done || finishedRef.current) return;
    finishedRef.current = true;
    finish();
    timerRef.current = setTimeout(() => navigate("/result", { replace: true }), NAVIGATE_DELAY_MS);
  }, [done, finish, navigate]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="grid min-h-dvh place-items-center bg-navy px-4">
      <AiLoader stepsDone={stepsDone} progress={progress} />
    </div>
  );
}
