import { motion } from "motion/react";

import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const toneChip = {
  blue: "bg-blue-500/12 text-blue-300",
  cyan: "bg-cyan-500/12 text-cyan-300",
  violet: "bg-violet-500/12 text-violet-300",
  amber: "bg-amber-500/12 text-amber-300",
  orange: "bg-orange-500/12 text-orange-300",
  emerald: "bg-emerald-500/12 text-emerald-300",
};

function FadeIn({ delay = 0, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** KPI tile: label, big value, small delta line, icon chip. */
export function StatCard({ label, value, delta, icon: Icon, tone = "blue", delay = 0, className }) {
  return (
    <FadeIn delay={delay} className={className}>
      <div className="card-surface card-interactive h-full p-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {Icon ? (
            <span className={cn("grid size-8 place-items-center rounded-lg", toneChip[tone] ?? toneChip.blue)}>
              <Icon className="size-4" />
            </span>
          ) : null}
        </div>
        <p className="tnum mt-2.5 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        {delta ? <p className="mt-1 text-xs text-muted-foreground">{delta}</p> : null}
      </div>
    </FadeIn>
  );
}

/** Card with a label/value header and a body slot — used for chart placeholders. */
export function ChartCard({ label, value, hint, children, delay = 0, className }) {
  return (
    <FadeIn delay={delay} className={className}>
      <div className="card-surface h-full p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
          {value ? <p className="tnum text-[13px] font-semibold text-foreground">{value}</p> : null}
        </div>
        <div className="mt-4">{children}</div>
        {hint ? <p className="mt-3 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </FadeIn>
  );
}

/** Module/category card for grids — icon tile, title, body, meta chips. */
export function ModuleCard({ icon: Icon, title, body, meta = [], metaIcon: MetaIcon, delay = 0, className, onClick }) {
  const Comp = onClick ? motion.button : motion.div;
  return (
    <FadeIn delay={delay} className={className}>
      <Comp
        {...(onClick ? { type: "button", onClick } : {})}
        whileHover={onClick ? { y: -3 } : undefined}
        transition={{ duration: 0.18, ease: EASE }}
        className={cn(
          "card-surface card-interactive h-full p-5 text-left",
          onClick && "focus-ring w-full cursor-pointer",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 flex-none place-items-center rounded-xl border border-border bg-secondary text-blue-300 [&_svg]:size-[18px]">
            <Icon />
          </span>
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        </div>
        {body ? <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{body}</p> : null}
        {meta.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {meta.map((m, i) => (
              <span key={`${m}-${i}`} className="flex items-center gap-1.5">
                {i === 0 && MetaIcon ? <MetaIcon className="size-3.5" /> : null}
                {m}
              </span>
            ))}
          </div>
        ) : null}
      </Comp>
    </FadeIn>
  );
}

/** Achievement/badge tile with earned vs locked states. */
export function AchievementCard({ icon: Icon, title, body, earned = false, progress, delay = 0, className }) {
  return (
    <FadeIn delay={delay} className={className}>
      <div className={cn("card-surface h-full p-5", earned && "card-interactive")}>
        <div className="flex items-start justify-between">
          <span
            className={cn(
              "grid size-10 place-items-center rounded-xl border",
              earned
                ? "border-blue-500/25 bg-blue-500/12 text-blue-300"
                : "border-border bg-secondary text-muted-foreground",
            )}
          >
            <Icon className="size-[18px]" />
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
              earned ? "border-blue-500/25 bg-blue-500/10 text-blue-300" : "border-border bg-secondary text-muted-foreground",
            )}
          >
            {earned ? "Earned" : "Locked"}
          </span>
        </div>
        <p className="mt-3.5 text-[15px] font-semibold tracking-tight text-foreground">{title}</p>
        {body ? <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{body}</p> : null}
        {typeof progress === "number" ? (
          <div className="mt-3.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-brand-duo" style={{ width: `${progress}%` }} />
            </div>
            <p className="tnum mt-1.5 text-xs text-muted-foreground">{progress}%</p>
          </div>
        ) : null}
      </div>
    </FadeIn>
  );
}

/** Horizontal progress row — label, bar, trailing value. */
export function ProgressRow({ label, value, display, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tnum text-muted-foreground">{display}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-brand-duo"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, delay: delay + 0.1, ease: EASE }}
        />
      </div>
    </FadeIn>
  );
}

/** Compact horizontal feature row (quick actions, links). */
export function FeatureRow({ icon: Icon, label, hint, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3.5 text-left",
        "transition-colors hover:border-border-strong hover:bg-accent focus-ring",
        className,
      )}
    >
      <span className="grid size-8 flex-none place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-foreground">{label}</span>
        {hint ? <span className="block truncate text-xs text-muted-foreground">{hint}</span> : null}
      </span>
    </button>
  );
}
