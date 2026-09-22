import { useState } from "react";
import { motion } from "motion/react";
import { History, Lock, Star, X } from "lucide-react";

import { SCENARIOS, HISTORICAL_REPLAYS, STAR } from "@/data/market";
import { useNavigate } from "@/utils/router";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

function Stars({ n }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Difficulty ${n} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("size-3", i < n ? STAR.filled : STAR.empty)} />
      ))}
    </span>
  );
}

/** "Choose Market Experience" — scenario picker with historical replays. */
export function ScenarioPicker({ open, onClose, activeId, onStart }) {
  const [tab, setTab] = useState("scenarios");

  if (!open) return null;
  const list = tab === "scenarios" ? SCENARIOS : HISTORICAL_REPLAYS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-[3px]" />
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[20px] border border-border bg-background shadow-2xl"
      >
        <div className="flex flex-none items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Choose Market Experience</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Each scenario changes volatility, event cadence and rewards.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-none gap-1 border-b border-border px-6 pt-3">
          {[
            { id: "scenarios", label: "Market scenarios" },
            { id: "replays", label: "Historical Replay" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "relative rounded-t-lg px-3.5 pb-3 pt-2 text-[13px] font-medium transition-colors",
                tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="flex items-center gap-1.5">
                {t.id === "replays" ? <History className="size-3.5" /> : null}
                {t.label}
              </span>
              {tab === t.id ? (
                <motion.span layoutId="scenario-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-duo" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((s, i) => {
              const active = tab === "scenarios" && s.id === activeId;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => onStart(s.id, tab === "replays" ? s.id : null)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03, ease: EASE }}
                  className={cn(
                    "card-surface card-interactive p-4 text-left focus-ring",
                    active && "border-blue-500/40 bg-blue-500/[0.06]",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14.5px] font-semibold tracking-tight text-foreground">{s.name}</h3>
                    {s.tag ? (
                      <span className="flex-none rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {s.tag}
                      </span>
                    ) : (
                      <span className="tnum flex-none text-[10.5px] text-muted-foreground">{s.year}</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">Difficulty <Stars n={s.difficulty} /></span>
                    <span className="tnum">{s.duration}</span>
                    {s.xp ? <span className="tnum font-medium text-blue-300">+{s.xp.toLocaleString("en-IN")} XP</span> : null}
                  </div>
                  {active ? (
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-blue-300">
                      <Lock className="size-3" /> Currently active — restart to reset
                    </p>
                  ) : null}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
