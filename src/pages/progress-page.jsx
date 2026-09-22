import { Activity } from "lucide-react";
import { motion } from "motion/react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { ChartCard, ProgressRow, StatCard } from "@/components/app/cards";
import { completedModules, dataIcon, progressMeta, progressStats, skillGraph, streakCalendar } from "@/data/app";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

/* Placeholder weekly accuracy trend so the chart card reads as a chart. */
const ACCURACY = [64, 70, 68, 76, 74, 81, 79, 87];

function AccuracyTrend() {
  const W = 320;
  const H = 110;
  const max = 100;
  const min = 50;
  const pts = ACCURACY.map((v, i) => {
    const x = (i / (ACCURACY.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * (H - 16) - 8;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke="rgb(96 165 250)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => {
        const [x, y] = p.split(",");
        return <circle key={i} cx={x} cy={y} r="2.5" fill="rgb(96 165 250)" />;
      })}
    </svg>
  );
}

function FinanceScoreRing() {
  const score = 72;
  return (
    <div className="flex items-center gap-5">
      <div className="relative grid size-28 flex-none place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke="url(#ring-grad)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 264} 264`}
          />
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-center">
          <p className="tnum text-2xl font-semibold text-foreground">{score}</p>
          <p className="text-[10px] text-muted-foreground">/ 100</p>
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        A composite of quiz accuracy, simulations cleared and lesson streaks. Crossing 80 unlocks the
        <span className="font-medium text-foreground"> Investor</span> tier.
      </p>
    </div>
  );
}

export function ProgressPage() {
  const weeks = [3, 5, 4, 7, 6, 8, 7, 10];
  const maxWeek = Math.max(...weeks);

  return (
    <div className="space-y-7">
      <PageHeader
        title={progressMeta.title}
        subtitle={progressMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Progress" }]}
      />

      <section className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {progressStats.map((s, i) => (
          <StatCard key={s.id} label={s.label} value={s.value} icon={i === 0 ? Activity : undefined} delay={i * 0.05} />
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Learning timeline */}
          <ChartCard label="Learning timeline" value="Last 8 weeks" hint="Modules completed per week">
            <div className="flex h-32 items-end gap-2.5">
              {weeks.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    className="w-full max-w-8 rounded-md bg-brand-duo"
                    initial={{ height: 4 }}
                    animate={{ height: `${(v / maxWeek) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                  />
                  <span className="text-[10px] text-muted-foreground">W{i + 1}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Quiz accuracy trend */}
          <ChartCard label="Quiz accuracy" value="87% avg" hint="Trend across recent quizzes">
            <AccuracyTrend />
          </ChartCard>

          {/* Completed modules */}
          <section>
            <SectionHeader title="Completed modules" hint="Everything finished so far, with scores" />
            <div className="card-surface divide-y divide-border">
              {completedModules.map((m) => {
                const Icon = dataIcon("BookOpen");
                return (
                  <div key={m.id} className="flex items-center gap-3.5 p-4">
                    <span className="grid size-9 flex-none place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-foreground">{m.title}</p>
                      <p className="text-xs text-muted-foreground">{m.track}</p>
                    </div>
                    <span className="tnum text-[13px] font-semibold text-foreground">{m.score}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <ChartCard label="Finance score" hint="Updated after every activity">
            <FinanceScoreRing />
          </ChartCard>

          <ChartCard label="Skill graph" hint="Strongest to weakest tracks">
            <div className="space-y-4">
              {skillGraph.map((s, i) => (
                <ProgressRow key={s.skill} label={s.skill} value={s.level} display={`${s.level}%`} delay={i * 0.05} />
              ))}
            </div>
          </ChartCard>

          <section>
            <SectionHeader title="Streak calendar" hint="Last four weeks" />
            <div className="card-surface p-5">
              <div className="grid grid-cols-7 gap-1.5">
                {streakCalendar.map((v, i) => (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square rounded-[4px] border",
                      v === 0 && "border-border bg-secondary/50",
                      v === 1 && "border-blue-500/25 bg-blue-500/25",
                      v === 2 && "border-blue-500/35 bg-blue-500/45",
                      v >= 3 && "border-blue-400/45 bg-blue-500/70",
                    )}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>4 weeks ago</span>
                <div className="flex items-center gap-1">
                  <span className="size-2.5 rounded-[3px] bg-secondary/50" />
                  <span className="size-2.5 rounded-[3px] bg-blue-500/25" />
                  <span className="size-2.5 rounded-[3px] bg-blue-500/45" />
                  <span className="size-2.5 rounded-[3px] bg-blue-500/70" />
                </div>
                <span>Today</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
