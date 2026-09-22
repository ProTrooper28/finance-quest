import { motion } from "motion/react";
import { Check, Flame, Lock } from "lucide-react";

import { journey } from "@/data/dashboard";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const stateStyle = {
  done: {
    node: "border-blue-500/30 bg-blue-500/15 text-blue-200",
    glow: "shadow-[0_0_18px_-2px_rgba(59,130,246,0.45)]",
    label: "text-foreground",
    connector: "from-blue-500/40 to-blue-500/15",
  },
  current: {
    node: "border-blue-400/60 bg-blue-500/20 text-white",
    glow: "shadow-[0_0_24px_-2px_rgba(59,130,246,0.65)]",
    label: "text-foreground",
    connector: "from-blue-500/25 to-transparent",
  },
  locked: {
    node: "border-border bg-secondary text-muted-foreground",
    glow: "",
    label: "text-muted-foreground",
    connector: "from-border to-transparent",
  },
};

/**
 * Financial Journey — horizontal roadmap of tracks. Completed steps glow
 * subtly, the current step pulses, locked ones show a lock.
 */
export function JourneyTrail() {
  return (
    <section aria-label="Financial journey" className="card-surface overflow-hidden p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Financial Journey</h2>
        <span className="tnum text-xs text-muted-foreground">3 of 7 complete</span>
      </div>

      <ol className="mt-6 flex items-start gap-0 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {journey.map((step, i) => {
          const s = stateStyle[step.state];
          const last = i === journey.length - 1;
          return (
            <li key={step.id} className={cn("flex min-w-fit items-start", !last && "flex-1")}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: EASE }}
                className="flex w-20 flex-none flex-col items-center text-center"
              >
                <motion.span
                  className={cn("relative grid size-11 place-items-center rounded-full border", s.node, s.glow)}
                  animate={step.state === "current" ? { scale: [1, 1.07, 1] } : undefined}
                  transition={step.state === "current" ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
                >
                  {step.state === "done" ? <Check className="size-4" strokeWidth={2.5} /> : null}
                  {step.state === "current" ? <Flame className="size-[18px]" /> : null}
                  {step.state === "locked" ? <Lock className="size-4" /> : null}
                  {step.state === "current" ? (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full border border-blue-400/50 motion-reduce:hidden"
                      animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                    />
                  ) : null}
                </motion.span>
                <p className={cn("mt-2.5 text-[12.5px] font-medium leading-snug", s.label)}>{step.label}</p>
                <p className="tnum mt-0.5 text-[10.5px] text-muted-foreground">
                  {step.state === "locked" ? `+${step.xp} XP to unlock` : `+${step.xp} XP`}
                </p>
              </motion.div>

              {!last ? (
                <div className="mt-[22px] h-[3px] flex-1 min-w-4 rounded-full bg-gradient-to-r">
                  <motion.span
                    className={cn("block h-full rounded-full bg-gradient-to-r", s.connector)}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.06, ease: EASE }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
