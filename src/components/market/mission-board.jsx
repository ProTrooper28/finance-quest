import { motion } from "motion/react";
import { BadgeCheck, Coins, Crown, Target, Trophy, Zap } from "lucide-react";

import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];
const fmtIN = (n) => Math.round(n).toLocaleString("en-IN");

/** Mission system — structured goals with XP/coin rewards. */
export function MissionBoard({ missions }) {
  return (
    <section className="card-surface p-5">
      <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-foreground">
        <Target className="size-4 text-blue-300" /> Missions
      </h2>
      <div className="mt-3.5 space-y-3">
        {missions.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
            className={cn(
              "rounded-xl border p-3.5 transition-colors",
              m.done ? "border-emerald-500/30 bg-emerald-500/[0.07]" : "border-border bg-secondary/40",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className={cn("text-[13px] font-medium", m.done ? "text-emerald-300" : "text-foreground")}>{m.title}</p>
              {m.done ? <BadgeCheck className="size-4 flex-none text-emerald-400" /> : null}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.span
                  className={cn("absolute inset-y-0 left-0 rounded-full", m.done ? "bg-emerald-400" : "bg-brand-duo")}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((m.progress ?? 0) / m.target) * 100)}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </span>
              <span className="tnum text-[10.5px] text-muted-foreground">
                {m.done ? "Done" : `${Math.floor(m.progress ?? 0)}/${m.target}`}
              </span>
            </div>
            <p className="tnum mt-1.5 text-[11px] text-muted-foreground">
              <span className="font-medium text-blue-300">+{m.xp} XP</span> · <span className="font-medium text-amber-300">+{m.coins} coins</span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/** Achievement unlock strip for the market simulator. */
export function AchievementStrip({ achievements }) {
  return (
    <section className="card-surface p-5">
      <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-foreground">
        <Trophy className="size-4 text-amber-300" /> Market achievements
      </h2>
      <div className="mt-3.5 grid grid-cols-2 gap-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={cn(
              "flex items-start gap-2.5 rounded-xl border p-2.5",
              a.earned ? "border-amber-500/30 bg-amber-500/[0.07]" : "border-border bg-secondary/40 opacity-70",
            )}
            title={a.desc}
          >
            <span className={cn("grid size-8 flex-none place-items-center rounded-lg border", a.earned ? "border-amber-500/30 bg-amber-500/10 text-amber-300" : "border-border bg-secondary text-muted-foreground")}>
              <Trophy className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className={cn("truncate text-[12px] font-medium", a.earned ? "text-foreground" : "text-muted-foreground")}>{a.name}</p>
              <p className="tnum text-[10px] text-muted-foreground">{a.earned ? `Earned · +${a.xp} XP` : a.xp ? `+${a.xp} XP` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Weekly XP mini-leaderboard. */
export function MarketLeaderboard({ xp }) {
  const rows = [
    { rank: 1, name: "Aarav M.", xp: 2140 },
    { rank: 2, name: "Diya S.", xp: 1985 },
    { rank: 3, name: "Kabir R.", xp: 1760 },
    { rank: 8, name: "You", xp, you: true },
  ];
  return (
    <section className="card-surface p-5">
      <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-foreground">
        <Crown className="size-4 text-amber-300" /> Weekly XP
      </h2>
      <ol className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <li key={r.rank} className={cn("flex items-center gap-3 rounded-lg px-2 py-1.5", r.you && "border border-blue-500/30 bg-blue-500/10")}>
            <span className={cn("tnum grid size-6 flex-none place-items-center rounded-full border text-[10.5px] font-semibold", r.rank === 1 ? "border-amber-500/30 bg-amber-500/10 text-amber-300" : "border-border bg-secondary text-muted-foreground")}>
              {r.rank === 1 ? <Crown className="size-3" /> : r.rank}
            </span>
            <span className={cn("flex-1 truncate text-[12.5px]", r.you ? "font-semibold text-blue-200" : "text-foreground")}>{r.name}</span>
            <span className="tnum text-[11.5px] text-muted-foreground">{fmtIN(r.xp)} XP</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** End-of-session report modal. */
export function SessionReportModal({ report, onClose }) {
  if (!report) return null;
  const up = report.totalReturn >= 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative w-full max-w-lg overflow-hidden rounded-[20px] border border-border bg-background shadow-2xl"
      >
        <div className="border-b border-border px-6 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-300">Session report</p>
          <h2 className={cn("tnum mt-1 text-3xl font-bold tracking-tight", up ? "text-emerald-400" : "text-red-400")}>
            {up ? "+" : "−"}{Math.abs(report.totalReturn).toFixed(2)}%
          </h2>
          <p className="tnum mt-0.5 text-[12.5px] text-muted-foreground">
            NIFTY returned {report.niftyReturn >= 0 ? "+" : ""}{report.niftyReturn.toFixed(2)}% — you {report.totalReturn >= report.niftyReturn ? "beat" : "trailed"} the index.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 p-5 sm:grid-cols-3">
          <Stat label="XP earned" value={fmtIN(report.xp)} tone="text-blue-300" />
          <Stat label="Coins earned" value={fmtIN(report.coins)} tone="text-amber-300" />
          <Stat label="Correct decisions" value={String(report.decisions)} tone="text-emerald-400" />
          <Stat label="Mistakes" value={String(report.mistakes)} tone="text-red-400" />
          <Stat label="Risk management" value={`${report.risk}`} tone={report.risk <= 50 ? "text-emerald-400" : "text-amber-300"} />
          <Stat label="Diversification" value={`${report.diversification}`} />
        </div>

        <div className="border-t border-border px-5 pb-5">
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">AI feedback</p>
          <ul className="mt-2 space-y-1.5">
            {report.feedback.map((f, i) => (
              <li key={i} className="text-[12.5px] leading-relaxed text-foreground/90">· {f}</li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-500/25 bg-blue-500/[0.07] px-4 py-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-blue-300">Suggested next challenge</p>
              <p className="mt-0.5 text-[13px] font-medium text-foreground">{report.next}</p>
            </div>
            <Zap className="size-4 flex-none text-blue-300" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Coins className="hidden" />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground transition hover:bg-[#3b82f6] active:translate-y-px focus-ring"
            >
              Claim rewards <Coins className="size-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 px-3 py-2.5">
      <p className="truncate text-[10.5px] text-muted-foreground">{label}</p>
      <p className={cn("tnum mt-0.5 text-[15px] font-semibold", tone ?? "text-foreground")}>{value}</p>
    </div>
  );
}

