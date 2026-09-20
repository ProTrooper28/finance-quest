import { motion } from "motion/react";

import { cn } from "@/utils";

export function ProgressBar({ value, className, showLabel = true }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">Progress</span>
        <span className="tnum font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-brand-duo"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.23, 0.86, 0.44, 1] }}
        />
      </div>
    </div>
  );
}

export function ProgressBarCompact({ value, className }) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-white/10", className)}>
      <motion.div
        className="h-full rounded-full bg-white"
        initial={false}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}
