import { motion } from "motion/react";
import { ArrowUpRight, BookOpen, CandlestickChart, Gamepad2 } from "lucide-react";

import { ProgressBarCompact } from "@/components/assessment/progress-bar";
import { cn, storage } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const CARDS = [
  {
    id: "learn",
    icon: BookOpen,
    title: "Learn",
    tag: "Short interactive lessons",
    body: "Banking, UPI, investing, budgeting, taxes and credit score — 5-minute lessons with checks along the way.",
    cta: "Coming soon",
    accent: "bg-blue-500/12 text-blue-300",
  },
  {
    id: "play",
    icon: Gamepad2,
    title: "Play",
    tag: "Simulations & challenges",
    body: "Budget Simulator, Fraud Detection, Banking Challenges and Investment Missions — decisions with debriefs.",
    cta: "Coming soon",
    accent: "bg-indigo-500/12 text-indigo-300",
  },
  {
    id: "market",
    icon: CandlestickChart,
    title: "Market Simulator",
    tag: "Virtual stock market",
    body: "Demo money, simulated price action and market news. Buy, Sell and Hold — then see the why behind every move.",
    cta: "Coming soon",
    accent: "bg-cyan-500/12 text-cyan-300",
  },
];

export function HomePage() {
  const user = storage.get("finquest-user", null);
  const result = storage.get("finquest-result-v1", null);
  const name = user?.name || result?.name || "there";

  return (
    <div className="min-h-dvh bg-navy">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-duo text-sm font-semibold text-white">FQ</span>
            <span className="text-[15px] font-medium tracking-tight text-white">FinQuest</span>
          </div>
          <div className="flex items-center gap-3">
            {result ? (
              <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/60 sm:inline-flex">
                {result.profile.emoji} {result.profile.title}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                storage.clear("finquest-user");
                location.reload();
              }}
              className="text-[13px] font-medium text-white/50 transition hover:text-white"
            >
              Log out
              </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-white md:text-4xl">Hey {name}.</h1>
            <p className="mt-2 text-sm text-white/55">
              {result
                ? `Week 1 is ${result.roadmap[0]?.title ?? "ready"} — pick a lane below.`
                : "Pick a lane below to get started."}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CARDS.map((card, i) => (
              <motion.button
                key={card.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
                className={cn(
                  "group relative flex min-h-[240px] flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left",
                  "transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.05] focus-ring",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl", card.accent)}>
                    <card.icon className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-white/25 transition group-hover:text-white/70" />
                </div>
                <h2 className="mt-5 text-xl font-medium tracking-tight text-white">{card.title}</h2>
                <p className="mt-1 text-xs font-medium text-white/40">{card.tag}</p>
                <p className="mt-3 max-w-[34ch] text-[13px] leading-relaxed text-white/55">{card.body}</p>
                <span className="mt-auto pt-5 text-xs font-medium text-white/35 group-hover:text-white/60">{card.cta}</span>
              </motion.button>
            ))}
          </div>
        </main>

        {result ? (
          <footer className="border-t border-white/5 pt-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-white/45">
                <span>Weekly goal — {result.weeklyGoal.minutes} min</span>
                <span className="h-3 w-px bg-white/10" />
                <span>XP target — {result.xpTarget.amount}</span>
              </div>
              <ProgressBarCompact value={0} className="h-1 w-28" />
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
