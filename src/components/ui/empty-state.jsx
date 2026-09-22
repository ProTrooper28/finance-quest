import { motion } from "motion/react";

import { cn } from "@/utils";

/**
 * Professional empty state: icon tile, title, one-line body, optional action.
 * Never cartoonish — a bordered tile and quiet copy.
 */
export function EmptyState({ icon: Icon, title, body, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 0.86, 0.44, 1] }}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-11 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground">
          <Icon className="size-5" />
        </span>
      ) : null}
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      {body ? <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}
