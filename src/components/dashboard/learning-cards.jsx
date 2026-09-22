import { motion } from "motion/react";
import { ArrowRight, Clock, Lock, Play, Zap } from "lucide-react";

import { continueLevels, quickPlay } from "@/data/dashboard";
import { dataIcon } from "@/data/app";
import { Link, useNavigate } from "@/utils/router";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

/** Premium "game level" module cards — in-progress and locked variants. */
export function ContinueLearningCards() {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Continue Learning</h2>
        <Link to="/learn" className="text-[13px] font-medium text-blue-300 transition hover:text-blue-200">
          View all
        </Link>
      </div>
      <div className="mt-4 grid gap-3.5 md:grid-cols-2">
        {continueLevels.map((m, i) => (
          <LevelCard key={m.id} {...m} delay={0.1 + i * 0.07} />
        ))}
      </div>
    </section>
  );
}

function LevelCard({ icon, title, level, progress, reward, minutes, locked, lockedLabel, preview, to, delay }) {
  const Icon = dataIcon(icon);
  const navigate = useNavigate();

  if (locked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: EASE }}
        className="card-surface relative overflow-hidden p-5 opacity-90"
      >
        <div className="flex items-start gap-4">
          <span className="grid size-11 flex-none place-items-center rounded-xl border border-border bg-secondary text-muted-foreground">
            <Lock className="size-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{lockedLabel}</p>
            <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">“{preview}”</p>
            <div className="mt-3.5 flex items-center gap-2">
              <span className="tnum inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <Zap className="size-3" /> {reward}
              </span>
              <span className="text-xs text-muted-foreground">on reaching Level 6</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      whileHover={{ y: -3 }}
      className="card-surface card-interactive relative overflow-hidden p-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(320px 130px at 100% 0%, rgba(37,99,235,0.12), transparent 70%)" }}
      />
      <div className="relative flex items-start gap-4">
        <span className="grid size-11 flex-none place-items-center rounded-xl border border-blue-500/25 bg-blue-500/12 text-blue-300">
          <Icon className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{level}</p>
          <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="tnum font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-brand-duo"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, delay: delay + 0.15, ease: EASE }}
          />
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <span className="tnum inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300">
          <Zap className="size-3" /> {reward}
        </span>
        <span className="tnum inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <Clock className="size-3" /> {minutes} min
        </span>
        <button
          type="button"
          onClick={() => navigate(to)}
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground transition hover:bg-[#3b82f6] active:translate-y-px focus-ring"
        >
          Continue <ArrowRight className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/** Quick Play — game-style entry cards. */
export function QuickPlayCards() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Quick Play</h2>
        <Link to="/simulations" className="text-[13px] font-medium text-blue-300 transition hover:text-blue-200">
          All simulations
        </Link>
      </div>
      <div className="mt-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {quickPlay.map((g, i) => {
          const Icon = dataIcon(g.icon);
          return (
            <motion.button
              key={g.id}
              type="button"
              onClick={() => navigate(g.to)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.06, ease: EASE }}
              whileHover={{ y: -3 }}
              className="card-surface card-interactive group flex h-full flex-col p-5 text-left focus-ring"
            >
              <span className="grid size-10 place-items-center rounded-xl border border-border bg-secondary text-blue-300 transition-colors group-hover:border-blue-500/30 group-hover:text-blue-200">
                <Icon className="size-[18px]" />
              </span>
              <h3 className="mt-3.5 text-[14.5px] font-semibold tracking-tight text-foreground">{g.title}</h3>
              <p className="mt-1 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">{g.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-300 transition-transform duration-150 group-hover:translate-x-0.5">
                <Play className="size-3.5" /> {g.cta}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

