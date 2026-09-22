import { Link, useNavigate } from "@/utils/router";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Clock, Sparkles, Target, Zap } from "lucide-react";

import { ProgressBarCompact } from "@/components/assessment/progress-bar";
import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { FeatureRow, ProgressRow, StatCard } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import {
  activity, continueLearning, dailyChallenge, dataIcon, greeting, quickActions,
  recommended, roadmapPreview, stats, upcomingAchievement, weeklyProgress,
} from "@/data/app";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

export function DashboardPage() {
  const navigate = useNavigate();
  const weekTotal = weeklyProgress.days.reduce((s, d) => s + d.value, 0);
  const maxDay = Math.max(...weeklyProgress.days.map((d) => d.value), 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title={greeting.title}
        subtitle={greeting.message}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Dashboard" }]}
        action={
          <Button asChild variant="secondary" size="sm">
            <Link to="/learn">
              Browse modules <ArrowRight />
            </Link>
          </Button>
        }
      />

      {/* KPI stats */}
      <section className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            delta={s.delta}
            icon={dataIcon(s.icon)}
            tone={s.tone}
            delay={i * 0.05}
          />
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Continue learning */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="card-surface card-interactive p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="eyebrow">{continueLearning.eyebrow}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{continueLearning.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{continueLearning.body}</p>
              </div>
              <Button asChild size="sm" className="bg-brand-duo font-medium hover:opacity-90">
                <Link to="/learn">
                  Resume <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <ProgressBarCompact value={continueLearning.progress} className="h-1.5 flex-1 bg-secondary" />
              <span className="tnum flex-none text-xs text-muted-foreground">
                {continueLearning.lesson} · {continueLearning.minutes}
              </span>
            </div>
          </motion.section>

          {/* Weekly progress */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="card-surface p-6"
          >
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{weeklyProgress.title}</h2>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{weeklyProgress.subtitle}</p>
              </div>
              <p className="tnum text-[13px] text-muted-foreground">
                <span className="font-semibold text-foreground">{weekTotal}</span> / {weeklyProgress.goal} {weeklyProgress.unit}
              </p>
            </div>
            <div className="mt-5 flex h-28 items-end gap-2.5 sm:gap-4">
              {weeklyProgress.days.map((d, i) => (
                <div key={`${d.day}-${i}`} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    className={cn("w-full max-w-8 rounded-md", d.value > 0 ? "bg-brand-duo" : "bg-secondary")}
                    initial={{ height: 4 }}
                    animate={{ height: `${Math.max((d.value / maxDay) * 100, 5)}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: EASE }}
                  />
                  <span className="text-[11px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Roadmap preview */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          >
            <SectionHeader title="Learning roadmap" hint="Your personalized path from the assessment" />
            <div className="card-surface divide-y divide-border">
              {roadmapPreview.map((w) => (
                <div key={w.week} className="flex items-center gap-3.5 p-4">
                  <span
                    className={cn(
                      "grid size-8 flex-none place-items-center rounded-full border text-xs font-semibold",
                      w.done && "border-blue-500/25 bg-blue-500/12 text-blue-300",
                      w.current && "border-blue-500/40 bg-blue-500/15 text-blue-200",
                      !w.done && !w.current && "border-border bg-secondary text-muted-foreground",
                    )}
                  >
                    {w.done ? "✓" : w.week.replace("Week ", "")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-[13.5px] font-medium", w.done || w.current ? "text-foreground" : "text-muted-foreground")}>
                      {w.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{w.week}</p>
                  </div>
                  {w.current ? (
                    <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300">
                      Up next
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          {/* Today's challenge */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
            className="card-surface p-6"
          >
            <div className="flex items-center gap-2">
              <Target className="size-4 text-blue-300" />
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">{dailyChallenge.tag}</p>
            </div>
            <h2 className="mt-3 text-[15px] font-semibold tracking-tight text-foreground">{dailyChallenge.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{dailyChallenge.body}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Zap className="size-3.5 text-blue-300" />{dailyChallenge.reward}</span>
              <span className="flex items-center gap-1.5"><Clock className="size-3.5" />{dailyChallenge.minutes} min</span>
            </div>
            <Button asChild size="sm" className="mt-5 w-full">
              <Link to="/simulations">{dailyChallenge.cta}</Link>
            </Button>
          </motion.section>

          {/* Quick actions */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          >
            <SectionHeader title="Quick actions" />
            <div className="space-y-2">
              {quickActions.map((a) => (
                <FeatureRow
                  key={a.id}
                  icon={dataIcon(a.icon)}
                  label={a.label}
                  onClick={() => navigate(a.to)}
                />
              ))}
            </div>
          </motion.section>

          {/* Upcoming achievement */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26, ease: EASE }}
            className="card-surface p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-300">
                <Sparkles className="size-[18px]" />
              </span>
              <div>
                <p className="text-[15px] font-semibold tracking-tight text-foreground">{upcomingAchievement.title}</p>
                <p className="text-xs text-muted-foreground">{upcomingAchievement.label}</p>
              </div>
            </div>
            <p className="mt-3.5 text-[13px] leading-relaxed text-muted-foreground">{upcomingAchievement.body}</p>
            <div className="mt-4">
              <ProgressRow label="Progress" value={upcomingAchievement.progress} display={`${upcomingAchievement.progress}%`} />
            </div>
          </motion.section>

          {/* Recent activity */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          >
            <SectionHeader title="Recent activity" />
            <div className="card-surface divide-y divide-border">
              {activity.map((item) => {
                const Icon = dataIcon(item.icon);
                return (
                  <div key={item.id} className="flex items-start gap-3 p-3.5">
                    <span className="mt-0.5 grid size-8 flex-none place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.meta}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Recommended module */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
            className="card-surface p-6"
          >
            <p className="eyebrow">{recommended.eyebrow}</p>
            <h2 className="mt-2 text-[15px] font-semibold tracking-tight text-foreground">{recommended.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{recommended.body}</p>
            <div className="mt-3.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {recommended.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <Button asChild variant="secondary" size="sm" className="mt-5 w-full">
              <Link to="/learn">Open module</Link>
            </Button>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
