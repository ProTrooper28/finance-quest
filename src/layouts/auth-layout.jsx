import { motion } from "framer-motion";
import { ArrowRight, LineChart, ShieldCheck, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/utils/router";

const BENEFITS = [
  { icon: Target, text: "A roadmap shaped around your experience" },
  { icon: LineChart, text: "Practice with virtual money, zero risk" },
  { icon: ShieldCheck, text: "Scam drills that build real reflexes" },
];

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-dvh w-full bg-navy">
      {/* Brand panel */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden border-r border-white/5 p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_20%_10%,rgba(59,130,246,0.12),transparent_60%)]" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-duo text-sm font-semibold text-white">FQ</span>
          <span className="text-[15px] font-medium tracking-tight text-white">FinQuest</span>
        </Link>

        <div className="relative max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl font-medium leading-snug tracking-tight text-white"
          >
            Finance is a skill. <span className="text-gradient-duo">Practice it.</span>
          </motion.h2>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 space-y-4"
          >
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-white/60">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-blue-300">
                  <b.icon className="h-4 w-4" />
                </span>
                {b.text}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-white/35">
          <Sparkles className="h-3.5 w-3.5" />
          Free to start — no card required.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-duo text-sm font-semibold text-white">FQ</span>
            <span className="text-[15px] font-medium tracking-tight text-white">FinQuest</span>
          </Link>

          <h1 className="text-2xl font-medium tracking-tight text-white">{title}</h1>
          {subtitle ? <p className="mt-2 text-[14px] leading-relaxed text-white/55">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
          {footer ? <div className="mt-6 text-[13px] text-white/45">{footer}</div> : null}

          <div className="mt-10 hidden items-center gap-2 text-xs text-white/30 lg:flex">
            <ArrowRight className="h-3.5 w-3.5" />
            Guest login skips the forms — straight to the assessment.
          </div>
        </motion.div>
        </div>
      </div>
  );
}
