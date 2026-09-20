import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";

import { ProgressBar } from "@/components/assessment/progress-bar";
import { ANALYSIS_STAGES } from "@/hooks/use-auth-flow";
import { cn } from "@/utils";

export function AiLoader({ stepsDone, progress }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      {/* Pulsing AI orb */}
      <div className="relative grid size-28 place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            initial={{ scale: 0.7, opacity: 0.7 }}
            animate={{ scale: [0.7, 1.25], opacity: [0.55, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="grid size-16 place-items-center rounded-2xl bg-brand-duo shadow-raised"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="size-7 text-white" />
        </motion.div>
      </div>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight md:text-3xl">
        Analyzing your financial profile…
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This takes a few seconds. Your answers stay on this device.
      </p>

      <div className="mt-10 w-full text-left">
        <ul className="space-y-3.5">
          {ANALYSIS_STAGES.map((label, i) => {
            const done = i < stepsDone;
            const active = i === stepsDone;
            return (
              <li key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                    done && "border-success bg-success-soft text-success",
                    active && "border-primary/60 bg-primary/10",
                    !done && !active && "border-border text-muted-foreground/50",
                  )}
                >
                  {done ? (
                    <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                      <Check className="size-3.5" />
                    </motion.span>
                  ) : active ? (
                    <motion.span
                      className="size-2 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : null}
                </span>
                <span className={cn("transition-colors duration-300", done || active ? "text-foreground" : "text-muted-foreground/60")}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <ProgressBar value={progress} showLabel={false} />
          <p className="tnum mt-2 text-center text-xs text-muted-foreground">{progress}%</p>
        </div>
      </div>
    </div>
  );
}
