import { useState } from "react";
import { motion } from "motion/react";

import { HeroCanvas } from "@/components/marketing/hero-canvas";
import { LearnMoreModal } from "@/components/marketing/learn-more-modal";
import { Button } from "@/components/ui/button";
import { Link } from "@/utils/router";

const PROOF_POINTS = [
  "AI Personalized Learning",
  "Stock Market Simulator",
  "Fraud Protection",
  "Gamified Learning",
];

const EASE = [0.22, 1, 0.36, 1];

export function LandingPage() {
  const [learnOpen, setLearnOpen] = useState(false);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-navy">
      {/* Reactive background: grid + rising chart lines + drifting particles */}
      <HeroCanvas className="absolute inset-0 h-full w-full" />
      {/* Vignette + top sheen, kept minimal */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(59,130,246,0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Brand row */}
        <header className="flex items-center justify-between px-6 py-6 sm:px-10">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-duo text-sm font-semibold text-white shadow-sm">FQ</span>
            <span className="text-[15px] font-medium tracking-tight text-white">FinQuest</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-white/70 hover:bg-white/5 hover:text-white">
            <Link to="/login">Sign in</Link>
          </Button>
        </header>

        {/* Center content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Personal finance, taught by doing
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="max-w-3xl text-balance text-4xl font-medium tracking-tight text-white sm:text-6xl"
          >
            Learn Finance by <span className="text-gradient-duo">Living It.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
            className="mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-white/60 sm:text-base"
          >
            Master banking, investing and digital safety through interactive simulations and personalized learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="h-11 min-w-44 bg-brand-duo px-7 font-medium shadow-lg shadow-blue-950/40 transition hover:opacity-90">
              <Link to="/login">Start Learning</Link>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => setLearnOpen(true)}
              className="h-11 border-white/15 bg-white/[0.03] px-7 font-medium text-white/85 hover:bg-white/[0.07] hover:text-white"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5"
          >
            {PROOF_POINTS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-white/55">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-blue-400" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </motion.ul>
        </main>

        {/* Minimal footer strip */}
        <footer className="flex items-center justify-between px-6 py-5 sm:px-10">
          <p className="text-xs text-white/35">© 2026 FinQuest. For learning only — not investment advice.</p>
          <div className="hidden gap-5 text-xs text-white/35 sm:flex">
            <a href="#" className="transition hover:text-white/70">Privacy</a>
            <a href="#" className="transition hover:text-white/70">Terms</a>
          </div>
        </footer>
      </div>

      <LearnMoreModal open={learnOpen} onOpenChange={setLearnOpen} />
    </div>
  );
}
