import { useState } from "react";
import { motion } from "motion/react";

import { GlobeBackground } from "@/components/marketing/globe-background";
import { LearnMoreModal } from "@/components/marketing/learn-more-modal";
import { Link } from "@/utils/router";

const PROOF_POINTS = [
  "AI Personalized Learning",
  "Stock Market Simulator",
  "Fraud Protection",
  "Gamified Learning",
];

const EASE = [0.16, 1, 0.3, 1];

function Arrow() {
  return (
    <svg className="h-[11px] w-[13px] flex-none" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path d="M0.8 5h10M7.1 1.4 10.9 5l-3.8 3.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Line({ children, delay }) {
  return (
    <span className="block overflow-hidden -mb-[0.2em] -mt-[0.26em] pb-[0.2em] pt-[0.26em]">
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function LandingPage() {
  const [learnOpen, setLearnOpen] = useState(false);

  return (
    <div className="globe-ui relative h-dvh w-full overflow-hidden bg-black text-white">
      <GlobeBackground />

      <div className="relative z-10 flex h-full flex-col">
        <motion.header
          initial={{ opacity: 0, y: 9 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.3, ease: EASE }}
          className="flex h-16 items-center justify-between px-6 sm:px-10"
        >
          <span className="text-[24px] font-extrabold tracking-tight text-white">FinQuest</span>
          <Link to="/login" className="glass-pill">
            Sign in
          </Link>
        </motion.header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-[clamp(44px,8.4vw,89px)] font-medium leading-[1.02] tracking-[-0.02em] text-white">
            <Line delay={0.12}>Learn Finance</Line>
            <Line delay={0.22}>by Living It.</Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.58, ease: EASE }}
            className="mt-5 max-w-xl text-balance text-[16px] font-light leading-relaxed text-[#f6f6f6] sm:text-[18px]"
          >
            Master banking, investing and digital safety through interactive simulations and personalized learning.
          </motion.p>

          <div className="mt-7 flex flex-col items-center gap-2.5 sm:flex-row">
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.972 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            >
              <Link to="/login" className="white-pill !h-[46px] !px-6">
                Start Learning <Arrow />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.972 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.97, ease: EASE }}
            >
              <button type="button" onClick={() => setLearnOpen(true)} className="glass-pill !h-[46px] !px-6">
                Learn More <Arrow />
              </button>
            </motion.div>
          </div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5"
          >
            {PROOF_POINTS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-white/70">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[#a78bfa]" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </motion.ul>
        </main>

        <footer className="flex items-center justify-between px-6 py-5 sm:px-10">
          <p className="text-xs text-white/45">© 2026 FinQuest. For learning only — not investment advice.</p>
          <div className="hidden gap-5 text-xs text-white/45 sm:flex">
            <a href="#" className="transition hover:text-white/80">Privacy</a>
            <a href="#" className="transition hover:text-white/80">Terms</a>
          </div>
        </footer>
      </div>

      <LearnMoreModal open={learnOpen} onOpenChange={setLearnOpen} />
    </div>
  );
}
