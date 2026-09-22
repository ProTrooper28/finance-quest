import { motion } from "motion/react";
import { Flame, Coins, Gauge } from "lucide-react";

import { useCountUp } from "@/hooks/use-count-up";
import { hero, mission } from "@/data/dashboard";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

function Stat({ icon: Icon, label, value, tone, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
    >
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-white/45">
        <Icon className={cn("size-3.5", tone)} />
        {label}
      </span>
      <p className="tnum mt-1.5 text-xl font-semibold text-white">
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  );
}

function AnimatedNumber({ value }) {
  /* Numeric values animate; strings ("8 days", "62%") render as-is. */
  if (typeof value !== "number") return <span className="tnum">{value}</span>;
  const n = useCountUp(value);
  return <span className="tnum">{n.toLocaleString("en-IN")}</span>;
}

/** Identity + progression hero at the top of the dashboard. */
export function MissionHero() {
  const pct = Math.min(Math.round((hero.xp / hero.xpForLevel) * 100), 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="card-surface relative overflow-hidden p-6 sm:p-7"
    >
      {/* faint radial wash, same-hue blue only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(560px 240px at 12% -10%, rgba(37,99,235,0.14), transparent 70%)" }}
      />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
              {hero.greeting}, {hero.firstName} 👋
            </h1>
            <p className="mt-2 flex items-center gap-2 text-[13.5px] text-muted-foreground">
              <span className="font-medium text-blue-300">{hero.levelName}</span>
              <span className="h-3 w-px bg-border" />
              <span className="tnum">Level {hero.level}</span>
            </p>
          </div>

          {/* Level ring */}
          <div className="relative grid size-20 flex-none place-items-center sm:size-24">
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--secondary)" strokeWidth="7" />
              <motion.circle
                cx="50" cy="50" r="44" fill="none" stroke="url(#heroRing)" strokeWidth="7" strokeLinecap="round"
                strokeDasharray="276.5"
                initial={{ strokeDashoffset: 276.5 }}
                animate={{ strokeDashoffset: 276.5 * (1 - pct / 100) }}
                transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
              />
              <defs>
                <linearGradient id="heroRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <span className="relative text-center">
              <span className="tnum block text-2xl font-bold leading-none text-white">{hero.level}</span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/40">Level</span>
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between text-xs">
            <span className="tnum font-medium text-white/70">{hero.xp.toLocaleString("en-IN")} / {hero.xpForLevel.toLocaleString("en-IN")} XP</span>
            <span className="tnum text-muted-foreground">{hero.xpToNext} XP until Level {hero.level + 1}</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-brand-duo"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.35, ease: EASE }}
            />
          </div>
        </div>

        {/* Stat trio */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat icon={Flame} label="Current streak" value={`${hero.streak} days`} tone="text-orange-300" delay={0.45} />
          <Stat icon={Coins} label="Coins" value={hero.coins} tone="text-amber-300" delay={0.5} />
          <Stat icon={Gauge} label="Completion" value={`${hero.completion}%`} tone="text-emerald-300" delay={0.55} />
        </div>
      </div>
    </motion.section>
  );
}
