import { CheckCircle2, GraduationCap, LineChart, ShieldCheck, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Link } from "@/utils/router";

const PILLARS = [
  {
    icon: Target,
    title: "AI Personalized Learning",
    body: "A 2-minute assessment shapes a weekly roadmap, daily session length and the simulations you see first.",
  },
  {
    icon: LineChart,
    title: "Stock Market Simulator",
    body: "Trade with demo money on simulated price action and news events. Every decision comes with a debrief.",
  },
  {
    icon: ShieldCheck,
    title: "Fraud Protection",
    body: "Practice on real scam formats — fake UPI requests, QR traps, phishing — and build the reflex to verify.",
  },
  {
    icon: GraduationCap,
    title: "Gamified Learning",
    body: "XP, streaks and weekly targets keep the momentum going without turning finance into a game show.",
  },
];

export function LearnMoreModal({ open, onOpenChange }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="What's inside FinQuest" description="A learning platform for personal finance — built around doing, not watching.">
      <div className="space-y-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="flex gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
              <p.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-white">{p.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/55">{p.body}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4 text-[13px] text-emerald-200/90">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
          Free to start. No card, no advice — just practice.
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white">
          Maybe later
        </Button>
        <Button asChild className="bg-brand-duo font-medium hover:opacity-90">
          <Link to="/login" onClick={() => onOpenChange(false)}>
            Start Learning
          </Link>
        </Button>
      </div>
    </Modal>
  );
}
