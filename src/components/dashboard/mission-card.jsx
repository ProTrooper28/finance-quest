import { motion } from "motion/react";
import { ArrowRight, Clock, Coins, Play, Star, Zap } from "lucide-react";

import { mission } from "@/data/dashboard";
import { useNavigate } from "@/utils/router";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

/** Today's Mission — the dashboard's centerpiece action. */
export function MissionCard() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
      className="relative overflow-hidden rounded-[20px] border border-blue-500/25 bg-[#0d1526] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_24px_64px_-24px_rgba(37,99,235,0.35)] sm:p-8"
    >
      {/* animated aura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(640px 300px at 85% -20%, rgba(37,99,235,0.22), transparent 70%)" }}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-blue-400" />
            </span>
            {mission.tag}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{mission.title}</h2>
          <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-muted-foreground">{mission.body}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <RewardChip icon={Zap} label={`+${mission.xp} XP`} tone="text-blue-300 border-blue-500/25 bg-blue-500/10" />
            <RewardChip icon={Coins} label={`+${mission.coins} coins`} tone="text-amber-300 border-amber-500/25 bg-amber-500/10" />
            <RewardChip
              icon={null}
              label={
                <span className="flex items-center gap-1">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Star key={i} className={i < mission.difficultyStars ? "size-3 fill-amber-300 text-amber-300" : "size-3 text-white/20"} />
                  ))}
                  {mission.difficulty}
                </span>
              }
              tone="text-violet-300 border-violet-500/25 bg-violet-500/10"
            />
            <RewardChip icon={Clock} label={`${mission.minutes} min`} tone="text-emerald-300 border-emerald-500/25 bg-emerald-500/10" />
          </div>
        </div>

        <div className="flex-none">
          <motion.button
            type="button"
            onClick={() => navigate(mission.to)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.16, ease: EASE }}
            className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-brand-duo px-7 text-[15px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(59,130,246,0.55)] transition hover:shadow-[0_16px_40px_-8px_rgba(59,130,246,0.65)] focus-ring"
          >
            <Play className="size-4 fill-white transition-transform group-hover:scale-110" />
            {mission.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

function RewardChip({ icon: Icon, label, tone }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium", tone)}>
      {Icon ? <Icon className="size-3.5" /> : null}
      {label}
    </span>
  );
}
