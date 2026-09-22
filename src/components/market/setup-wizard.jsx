import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, CalendarRange, Check, GraduationCap, History, Loader2, TrendingUp, Zap } from "lucide-react";

import { INVESTMENT_STYLES, TIME_MODES } from "@/data/market";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const modeIcons = { Zap, CalendarRange, CalendarDays, TrendingUp, History };
const styleIcons = { Zap, CalendarRange, TrendingUp, GraduationCap };

function Icon({ name, className }) {
  const Cmp = modeIcons[name] ?? styleIcons[name] ?? Zap;
  return <Cmp className={className} />;
}

/**
 * Post-scenario setup: Step 1 — time mode, Step 2 — investment style.
 * Both steps influence volatility, news rate, XP and pacing.
 */
export function SimulationSetup({ scenarioName, replayName, onLaunch, onBack }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null);
  const [style, setStyle] = useState(null);

  const canLaunch = step === 2 && mode && style;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-[13px] font-medium text-muted-foreground transition hover:text-foreground">
          ← Change scenario
        </button>
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <span key={s} className={cn("h-1.5 rounded-full transition-all", step === s ? "w-8 bg-brand-duo" : "w-4 bg-secondary")} />
          ))}
        </div>
      </div>

      <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
        {step === 1 ? (
          <section>
            <p className="eyebrow">Step 1 of 2 · {scenarioName}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Choose your time mode</h2>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">How long do you want to trade? This sets the pace of the simulation clock.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {TIME_MODES.map((m, i) => (
                <motion.button
                  key={m.id}
                  type="button"
                  onClick={() => { setMode(m.id); setStep(2); }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                  className={cn(
                    "card-surface card-interactive p-4 text-left focus-ring",
                    mode === m.id && "border-blue-500/40 bg-blue-500/[0.06]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-lg border border-border bg-secondary text-blue-300">
                      <Icon name={m.icon} className="size-4" />
                    </span>
                    <span className="tnum rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[10.5px] font-medium text-blue-300">
                      +{m.xp.toLocaleString("en-IN")} XP
                    </span>
                  </div>
                  <h3 className="mt-3 text-[14.5px] font-semibold tracking-tight text-foreground">{m.name}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{m.desc}</p>
                  <p className="tnum mt-2 text-[11.5px] text-muted-foreground">Duration: {m.duration}</p>
                </motion.button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <p className="eyebrow">Step 2 of 2 · {TIME_MODES.find((m) => m.id === mode)?.name}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Choose your investment style</h2>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">Your style changes news frequency, volatility, AI guidance and rewards.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {INVESTMENT_STYLES.map((s, i) => (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                  className={cn(
                    "card-surface card-interactive p-4 text-left focus-ring",
                    style === s.id && "border-blue-500/40 bg-blue-500/[0.06]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-9 place-items-center rounded-lg border border-border bg-secondary text-indigo-300">
                      <Icon name={s.icon} className="size-4" />
                    </span>
                    {style === s.id ? <Check className="size-4 text-blue-300" /> : null}
                  </div>
                  <h3 className="mt-3 text-[14.5px] font-semibold tracking-tight text-foreground">{s.name}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{s.tagline}</p>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-[13px] font-medium text-muted-foreground transition hover:text-foreground">
                ← Back to time modes
              </button>
              <button
                type="button"
                disabled={!canLaunch}
                onClick={() => onLaunch(mode, style)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-duo px-6 text-[14px] font-semibold text-white shadow-[0_10px_28px_-8px_rgba(59,130,246,0.55)] transition hover:shadow-[0_14px_36px_-8px_rgba(59,130,246,0.65)] focus-ring disabled:pointer-events-none disabled:opacity-40"
              >
                Launch simulation
              </button>
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}

/** Premium loading screen between setup and the live sim. */
export function SimulationLoading({ scenarioName, modeName, styleName }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Loading Market Data",
    "Initializing Economy",
    "Loading Companies",
    "Connecting AI Mentor",
    "Preparing Challenges",
  ];

  useEffect(() => {
    if (stepIndex >= steps.length) return;
    const t = setTimeout(() => setStepIndex((i) => i + 1), 480);
    return () => clearTimeout(t);
  }, [stepIndex, steps.length]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative mx-auto grid size-24 place-items-center"
      >
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-blue-500/25 border-t-blue-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-2 border-indigo-500/20 border-b-indigo-400/70"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
        <Loader2 className="size-7 text-blue-300" />
      </motion.div>

      <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Preparing Market Simulation…</h2>
      <p className="tnum mt-1.5 text-[13px] text-muted-foreground">
        {scenarioName} · {modeName} · {styleName}
      </p>

      <ul className="mx-auto mt-7 max-w-xs space-y-2.5 text-left">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2.5">
            <span
              className={cn(
                "grid size-5 flex-none place-items-center rounded-full border transition-colors",
                i < stepIndex ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : "border-border bg-secondary text-muted-foreground",
              )}
            >
              {i < stepIndex ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-current opacity-50" />}
            </span>
            <span className={cn("text-[13px]", i < stepIndex ? "text-foreground" : "text-muted-foreground")}>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
