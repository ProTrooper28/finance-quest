import { Award, ScrollText, Trophy } from "lucide-react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { AchievementCard } from "@/components/app/cards";
import { EmptyState } from "@/components/ui/empty-state";
import { achievementsMeta, badgeGroups, certificates, dataIcon, leaderboardPreview, xpTimeline } from "@/data/app";
import { cn } from "@/utils";

const stateChip = {
  done: "border-blue-500/25 bg-blue-500/10 text-blue-300",
  current: "border-blue-500/40 bg-blue-500/15 text-blue-200",
  next: "border-border bg-secondary text-muted-foreground",
};

export function AchievementsPage() {
  const badges = badgeGroups[0].items;
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-7">
      <PageHeader
        title={achievementsMeta.title}
        subtitle={achievementsMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Achievements" }]}
        action={
          <span className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            <Trophy className="size-3.5 text-amber-300" />
            {earnedCount} of {badges.length} badges earned
          </span>
        }
      />

      <SectionHeader title="Badges" hint="Earn them by finishing lessons, streaks and simulations" />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((b, i) => (
          <AchievementCard
            key={b.id}
            icon={dataIcon(b.icon, Award)}
            title={b.title}
            body={b.body}
            earned={b.earned}
            progress={b.progress}
            delay={i * 0.04}
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Certificates */}
        <div>
          <SectionHeader title="Certificates" hint="Issued when a track is completed" />
          <div className="card-surface divide-y divide-border">
            {certificates.map((c) => (
              <div key={c.id} className="flex items-center gap-3.5 p-4">
                <span className="grid size-10 flex-none place-items-center rounded-xl border border-border bg-secondary text-blue-300">
                  <ScrollText className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-foreground">{c.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.meta}</p>
                </div>
                <span className="hidden text-xs font-medium text-muted-foreground sm:block">View</span>
              </div>
            ))}
          </div>
        </div>

        {/* XP / level timeline */}
        <div>
          <SectionHeader title="Level ladder" hint="XP thresholds for each level" />
          <div className="card-surface p-5">
            <ol className="relative space-y-5 border-l border-border pl-5">
              {xpTimeline.map((l) => (
                <li key={l.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[27px] top-0.5 size-3.5 rounded-full border-2",
                      l.state === "done" && "border-blue-400 bg-blue-500",
                      l.state === "current" && "border-blue-300 bg-blue-500/40",
                      l.state === "next" && "border-border bg-background",
                    )}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className={cn("text-[13.5px]", l.state === "next" ? "text-muted-foreground" : "font-medium text-foreground")}>
                      {l.label}
                    </p>
                    <span className={cn("tnum rounded-full border px-2 py-0.5 text-[11px]", stateChip[l.state])}>
                      {l.xp}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <SectionHeader title="Leaderboard" hint="Weekly XP across all learners" />

      <div className="card-surface divide-y divide-border">
        {leaderboardPreview.map((row) => (
          <div
            key={`${row.rank}-${row.name}`}
            className={cn("flex items-center gap-4 p-4", row.you && "bg-blue-500/[0.06]")}
          >
            <span className={cn("tnum w-8 text-center text-sm font-semibold", row.you ? "text-blue-300" : "text-muted-foreground")}>
              {row.rank}
            </span>
            <span className="grid size-8 place-items-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground">
              {row.name[0]}
            </span>
            <p className={cn("flex-1 text-[13.5px]", row.you ? "font-semibold text-foreground" : "text-foreground/85")}>
              {row.name}
            </p>
            <span className="tnum text-[13px] font-medium text-muted-foreground">{row.xp} XP</span>
          </div>
        ))}
      </div>

      <EmptyState
        icon={Award}
        title="Rewards shop is coming"
        body="Coins will unlock themes, avatar frames and bonus simulations."
      />
    </div>
  );
}
