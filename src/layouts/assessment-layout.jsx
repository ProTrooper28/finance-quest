import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { GlobeBackground } from "@/components/marketing/globe-background";
import { ProgressBarCompact } from "@/components/assessment/progress-bar";
import { useAssessmentContext } from "@/hooks/assessment-context";
import { Link } from "@/utils/router";

export function AssessmentLayout({ children }) {
  const { progress, back, step } = useAssessmentContext();

  return (
    <div className="globe-ui relative flex min-h-dvh flex-col bg-black text-white">
      <GlobeBackground />

      <header className="relative z-20">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5 sm:px-8">
          {step > 0 ? (
            <button type="button" onClick={back} className="glass-pill !h-10 !w-10 !p-0" aria-label="Previous question">
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <Link to="/login" className="text-[22px] font-extrabold tracking-tight text-white">
              FinQuest
            </Link>
          )}

          <ProgressBarCompact value={progress} className="w-28 sm:w-48" />

          <Link to="/login" className="glass-pill">
            Exit
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel rounded-3xl p-6 sm:p-9"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
