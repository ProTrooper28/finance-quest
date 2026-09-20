import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

import { ProgressBarCompact } from "@/components/assessment/progress-bar";
import { Card } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-auth-flow";

function ScoreDial({ score }) {
  const animated = useCountUp(score, 1500);
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative grid size-36 shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="size-36 -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={R} fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - (C * score) / 100 }}
          transition={{ duration: 1.5, ease: [0.23, 0.86, 0.44, 1] }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="tnum text-3xl font-semibold">{animated}</p>
        <p className="text-[11px] text-muted-foreground">out of 100</p>
      </div>
    </div>
  );
}

export function ProfileCard({ profile, score, level, confidence }) {
  return (
    <Card className="p-6 md:p-7">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center">
          <ScoreDial score={score} />
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <TrendingUp className="size-3.5 text-success" /> Financial Score
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="eyebrow">Your financial level</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            <span aria-hidden="true">{profile.emoji} </span>
            {profile.title}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{profile.headline}</p>

          <div className="mt-5 rounded-xl border border-border bg-secondary/50 p-3.5">
            <p className="text-[11px] font-medium text-muted-foreground">Knowledge level</p>
            <p className="mt-0.5 text-sm font-semibold">{level}</p>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Confidence meter</span>
              <span className="tnum font-semibold">{confidence}%</span>
            </div>
            <ProgressBarCompact value={confidence} className="mt-2" />
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-success">Strengths</p>
          <ul className="mt-2.5 space-y-2">
            {profile.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-success" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-warning">Areas to improve</p>
          <ul className="mt-2.5 space-y-2">
            {profile.weakAreas.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-warning" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
