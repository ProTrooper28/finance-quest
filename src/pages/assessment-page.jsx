import { useNavigate } from "@/utils/router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

import { QuestionCard } from "@/components/assessment/question-card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useAssessmentContext } from "@/hooks/assessment-context";

const ease = [0.23, 0.86, 0.44, 1];

export function AssessmentPage() {
  const navigate = useNavigate();
  const assessment = useAssessmentContext();
  const { step, total, question, answers, progress, answeredCurrent, setAnswer, next, back, skip, finish, skipAll } = assessment;

  const isLast = step === total - 1;

  const handleNext = () => {
    if (isLast) {
      finish();
      navigate("/analysis");
    } else {
      next();
    }
  };

  /* Skip the entire assessment — defaults everywhere, straight to the app. */
  const handleSkipAll = () => {
    skipAll();
    toast("Assessment skipped", {
      description: "We set sensible defaults. You can retake it anytime from your profile.",
    });
    navigate("/dashboard");
  };

  const value = answers[question.id];

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="tnum font-medium text-muted-foreground">
          Question <span className="text-foreground">{step + 1}</span> of {total}
        </span>
        <span className="tnum text-muted-foreground">{progress}%</span>
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
        <Button variant="ghost" size="sm" onClick={back} disabled={step === 0}>
          <ArrowLeft /> Back
        </Button>
        <div className="flex items-center gap-2">
          {!answeredCurrent ? (
            <Button variant="ghost" size="sm" onClick={skip}>
              Skip <SkipForward />
            </Button>
          ) : null}
          <Button onClick={handleNext} disabled={!answeredCurrent}>
            {isLast ? "Finish" : "Next"} <ArrowRight />
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSkipAll}
        className="mx-auto mt-6 block text-xs font-medium text-white/35 transition hover:text-white/80"
      >
        Skip the full assessment
      </button>
    </div>
  );
}
