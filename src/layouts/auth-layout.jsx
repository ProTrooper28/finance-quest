import { motion } from "motion/react";

import { GlobeBackground } from "@/components/marketing/globe-background";
import { Link } from "@/utils/router";

const EASE = [0.16, 1, 0.3, 1];

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="globe-ui relative min-h-dvh w-full overflow-x-hidden bg-black text-white">
      <GlobeBackground />

      <header className="relative z-10 flex h-16 items-center justify-between px-6 sm:px-10">
        <Link to="/" className="text-[22px] font-extrabold tracking-tight text-white">
          FinQuest
        </Link>
        <Link to="/" className="glass-pill">
          Back to home
        </Link>
      </header>

      <main className="relative z-10 flex min-h-[calc(100dvh-4rem)] items-center justify-center px-5 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="glass-panel w-full max-w-[420px] rounded-3xl p-7 sm:p-9"
        >
          <h1 className="text-3xl font-medium tracking-[-0.02em] text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-[15px] font-light leading-relaxed text-[#f6f6f6]/80">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
          {footer ? <div className="mt-6 text-[13px] text-white/55">{footer}</div> : null}
        </motion.div>
      </main>
    </div>
  );
}
