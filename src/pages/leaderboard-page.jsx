import { Crown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

import { PageHeader } from "@/components/app/page-header";
import { leaderboard } from "@/data/dashboard";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const rankTone = {
  amber: "border-amber-500/30 bg-amber-500/12 text-amber-300",
  silver: "border-slate-400/25 bg-slate-400/10 text-slate-300",
  bronze: "border-orange-700/40 bg-orange-700/15 text-orange-300",
};

const fullLeaderboard = [
  ...leaderboard.rows,
  { rank: 8, name: "Ananya V.", xp: "1,420" },
  { rank: 10, name: "Dev J.", xp: "1,340" },
  { rank: 12, name: "Meera T.", xp: "1,288" },
  { rank: leaderboard.rank, name: "You", xp: leaderboard.you.xp, you: true },
  { rank: 15, name: "Karan S.", xp: "1,210" },
  { rank: 16, name: "Priya N.", xp: "1,180" },
];

export function LeaderboardPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Leaderboard"
        subtitle="Weekly XP race. Resets every Monday at midnight."
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Leaderboard" }]}
      />

      {/* Your standing */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="card-surface relative overflow-hidden p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(420px 160px at 0% 0%, rgba(37,99,235,0.14), transparent 70%)" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="tnum grid size-14 place-items-center rounded-2xl border border-blue-500/30 bg-blue-500/12 text-xl font-bold text-blue-200">
              #{leaderboard.rank}
            </span>
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-foreground">Your rank this week</p>
              <p className="tnum mt-0.5 text-[13px] text-muted-foreground">
                <span className="font-medium text-blue-300">{leaderboard.xpToTop10} XP</span> to enter the Top 10
              </p>
            </div>
          </div>
          <div className="min-w-48 flex-1 sm:max-w-xs">
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-brand-duo"
                initial={{ width: 0 }}
                animate={{ width: "62%" }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              />
            </div>
            <p className="tnum mt-1.5 text-xs text-muted-foreground">{leaderboard.you.xp} XP earned</p>
          </div>
        </div>
      </motion.section>

      {/* Table */}
      <section className="card-surface overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <TrendingUp className="size-4 text-muted-foreground" />
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Top learners this week</h2>
        </div>
        <ol className="divide-y divide-border">
          {fullLeaderboard.map((row, i) => (
            <motion.li
              key={`${row.rank}-${row.name}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.03, ease: EASE }}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5",
                row.you && "bg-blue-500/[0.07]",
              )}
            >
              <span
                className={cn(
                  "grid size-8 flex-none place-items-center rounded-full border text-xs font-semibold",
                  row.tone ? rankTone[row.tone] : "border-border bg-secondary text-muted-foreground",
                  row.you && "border-blue-400/40 bg-blue-500/20 text-blue-200",
                )}
              >
                {row.rank === 1 ? <Crown className="size-4" /> : row.rank}
              </span>
              <span className={cn("min-w-0 flex-1 truncate text-[13.5px]", row.you ? "font-semibold text-blue-200" : "font-medium text-foreground")}>
                {row.name}
              </span>
              <span className="tnum text-[13px] text-muted-foreground">{row.xp} XP</span>
            </motion.li>
          ))}
        </ol>
      </section>
    </div>
  );
}
