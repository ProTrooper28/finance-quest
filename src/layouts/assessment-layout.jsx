import { ArrowLeft } from "lucide-react";

import { ProgressBarCompact } from "@/components/assessment/progress-bar";
import { useAssessmentContext } from "@/hooks/assessment-context";
import { Link } from "@/utils/router";

export function AssessmentLayout({ children }) {
  const { progress, back, step } = useAssessmentContext();

  return (
    <div className="flex min-h-dvh flex-col bg-navy">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-navy/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Previous question"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-duo text-sm font-semibold text-white">FQ</span>
                <span className="hidden text-[15px] font-medium tracking-tight text-white sm:block">FinQuest</span>
              </Link>
            )}
          </div>

          <ProgressBarCompact value={progress} className="h-1.5 w-28 sm:w-44" />

          <Link to="/login" className="text-[13px] font-medium text-white/50 transition hover:text-white">
            Exit
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 sm:px-8">
        {children}
      </main>
    </div>
  );
}
