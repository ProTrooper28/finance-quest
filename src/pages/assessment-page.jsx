import { useNavigate } from "@/utils/router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

import { QuestionCard } from "@/components/assessment/question-card";
import { useAssessmentContext } from "@/hooks/assessment-context";

const ease = [0.23, 0.86, 0.44, 1];

export function AssessmentPage() {
  const navigate = useNavigate();
  const assessment = useAssessmentContext();
  const { step, total, question, answers, progress, answeredCurrent, setAnswer, next, back, skip, finish } = assessment;

  const isLast = step === total - 1;

  const handleNext = () => {
    if (isLast) {
      finish();
      navigate("/analysis");
    } else {
      next();
    }
  };

  const value = answers[question.id];

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="tnum font-medium text-white/60">
          Question <span className="text-white">{step + 1}</span> of {total}
        </span>
        <span className="tnum text-white/60">{progress}%</span>
      </div>

      <div className="relative mt-8 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.28, ease }}
          >
            <QuestionCard question={question} value={value} onChange={(v) => setAnswer(question.id, v)} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <button type="button" className="glass-pill" onClick={back} disabled={step === 0}>
          <ArrowLeft className="size-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          {!answeredCurrent ? (
            <button type="button" className="glass-pill" onClick={skip}>
              Skip <SkipForward className="size-4" />
            </button>
          ) : null}
          <button type="button" className="white-pill" onClick={handleNext} disabled={!answeredCurrent}>
            {isLast ? "Finish" : "Next"} <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
