import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Coins, Crown, Gift, MessageSquare, Sparkles, Timer, TrendingUp } from "lucide-react";

import { dailyReward, leaderboard, mentorCard } from "@/data/dashboard";
import { dataIcon } from "@/data/app";
import { Link, useNavigate } from "@/utils/router";
import { toast } from "@/components/ui/toast";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

/** Daily login reward — animated chest, claim interaction, next timer. */
export function DailyRewardCard() {
  const [claimed, setClaimed] = useState(false);
  const coins = useCountUp(claimed ? dailyReward.coins : 0, { duration: 700 });
  const BadgeIcon = dataIcon(dailyReward.badge.icon, Sparkles);

  const claim = () => {
    if (claimed) return;
    setClaimed(true);
    toast.success(`+${dailyReward.coins} coins claimed`, { description: "Come back tomorrow to keep the streak growing." });
  };

  return (
    <section className="card-surface relative overflow-hidden p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(260px 120px at 100% 0%, rgba(59,130,246,0.14), transparent 70%)" }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{dailyReward.label}</p>
            <p className="tnum mt-1.5 text-sm font-medium text-foreground">
              Day {dailyReward.day} <span className="text-muted-foreground">of {dailyReward.dayTotal}</span>
            </p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: dailyReward.dayTotal }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full",
                  i < dailyReward.day ? "bg-blue-400" : "bg-secondary-foreground/20",
                )}
              />
            ))}
          </div>
        </div>

        {/* Chest */}
        <div className="mt-4 flex items-center gap-4">
          <motion.button
            type="button"
            onClick={claim}
            aria-label="Claim daily reward"
            animate={claimed ? { scale: 1 } : { y: [0, -4, 0] }}
            transition={claimed ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={claimed ? undefined : { scale: 1.06 }}
            whileTap={claimed ? undefined : { scale: 0.96 }}
            className={cn(
              "relative grid size-16 flex-none place-items-center rounded-2xl border transition-colors focus-ring",
              claimed
                ? "border-blue-500/40 bg-blue-500/15 text-blue-200"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_20px_-4px_rgba(245,158,11,0.35)] hover:shadow-[0_0_26px_-4px_rgba(245,158,11,0.5)]",
            )}
          >
            <Gift className="size-7" />
            {claimed ? <Coins className="absolute -right-1.5 -top-1.5 size-5 rounded-full bg-background p-0.5 text-amber-300" /> : null}
          </motion.button>

          <div className="min-w-0 flex-1">
            {claimed ? (
              <>
                <p className="text-[13.5px] font-medium text-foreground">Claimed</p>
                <p className="tnum mt-0.5 text-xs text-amber-300">+{coins} coins added</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="size-3.5" /> Next chest in {dailyReward.nextIn}
                </p>
              </>
            ) : (
              <>
                <p className="tnum text-[13.5px] font-medium text-foreground">+{dailyReward.coins} coins inside</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{dailyReward.body}</p>
                <button
                  type="button"
                  onClick={claim}
                  className="mt-2 inline-flex h-7 items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 text-[11.5px] font-medium text-amber-300 transition hover:bg-amber-500/15 focus-ring"
                >
                  Claim now <ArrowUpRight className="size-3" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Achievement unlock */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
          <span className="grid size-9 flex-none place-items-center rounded-lg border border-blue-500/25 bg-blue-500/12 text-blue-300">
            <BadgeIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-foreground">
              <Sparkles className="size-3.5 text-blue-300" /> {dailyReward.badge.title}
            </p>
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">{dailyReward.badge.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const rankTone = {
  amber: "border-amber-500/30 bg-amber-500/12 text-amber-300",
  silver: "border-slate-400/25 bg-slate-400/10 text-slate-300",
  bronze: "border-orange-700/40 bg-orange-700/15 text-orange-300",
};

/** Weekly leaderboard with the user's rank and the gap to Top 10. */
export function LeaderboardCard() {
  return (
    <section className="card-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{leaderboard.title}</h2>
        <TrendingUp className="size-4 text-muted-foreground" />
      </div>

      <ol className="mt-4 space-y-1">
        {leaderboard.rows.map((row, i) => (
          <motion.li
            key={row.rank}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.05, ease: EASE }}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5"
          >
            <span
              className={cn(
                "grid size-7 flex-none place-items-center rounded-full border text-[11px] font-semibold",
                row.tone ? rankTone[row.tone] : "border-border bg-secondary text-muted-foreground",
              )}
            >
              {row.rank === 1 ? <Crown className="size-3.5" /> : row.rank}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">{row.name}</span>
            <span className="tnum text-[12.5px] text-muted-foreground">{row.xp} XP</span>
          </motion.li>
        ))}
      </ol>

      {/* You */}
      <div className="mt-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3">
        <div className="flex items-center gap-3">
          <span className="tnum grid size-7 flex-none place-items-center rounded-full border border-blue-400/40 bg-blue-500/20 text-[11px] font-semibold text-blue-200">
            {leaderboard.rank}
          </span>
          <span className="flex-1 text-[13px] font-medium text-foreground">You</span>
          <span className="tnum text-[12.5px] text-blue-200">{leaderboard.you.xp} XP</span>
        </div>
        <p className="tnum mt-2 text-[11.5px] text-muted-foreground">
          <span className="font-medium text-blue-300">{leaderboard.xpToTop10} XP</span> to reach the Top 10
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-brand-duo"
            initial={{ width: 0 }}
            animate={{ width: "62%" }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          />
        </div>
      </div>

      <Link
        to="/leaderboard"
        className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-blue-300 transition hover:text-blue-200"
      >
        Full leaderboard <ArrowUpRight className="size-3.5" />
      </Link>
    </section>
  );
}

/** Floating AI mentor prompt card. */
export function MentorCard() {
  const navigate = useNavigate();

  return (
    <section className="card-surface relative overflow-hidden p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: "radial-gradient(280px 130px at 0% 100%, rgba(99,102,241,0.16), transparent 70%)" }}
      />
      <div className="relative">
        <motion.span
          className="grid size-10 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/12 text-indigo-300"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageSquare className="size-[18px]" />
        </motion.span>
        <h3 className="mt-3.5 text-[15px] font-semibold leading-snug tracking-tight text-foreground">{mentorCard.title}</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{mentorCard.body}</p>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/mentor")}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground transition hover:bg-[#3b82f6] active:translate-y-px focus-ring"
          >
            {mentorCard.askCta}
          </button>
          <button
            type="button"
            onClick={() => navigate("/learn")}
            className="inline-flex h-8 items-center rounded-lg border border-border bg-secondary px-3.5 text-xs font-medium text-foreground transition hover:bg-accent active:translate-y-px focus-ring"
          >
            {mentorCard.roadmapCta}
          </button>
        </div>
      </div>
    </section>
  );
}
