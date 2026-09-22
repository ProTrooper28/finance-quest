import { motion } from "motion/react";
import { Newspaper, Zap } from "lucide-react";

import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const impactStyle = {
  bullish: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  bearish: "border-red-500/30 bg-red-500/10 text-red-300",
  neutral: "border-border bg-secondary text-muted-foreground",
};

const impactBar = {
  bullish: "bg-emerald-400",
  bearish: "bg-red-400",
  neutral: "bg-muted-foreground/50",
};

const catTone = {
  Policy: "text-violet-300",
  Earnings: "text-blue-300",
  Macro: "text-amber-300",
  Corporate: "text-cyan-300",
  Global: "text-orange-300",
};

/** Live news feed — the heart of the simulator. Click to highlight affected stocks. */
export function NewsPanel({ news, highlighted, onHighlight, onClear }) {
  return (
    <section className="card-surface flex h-full flex-col overflow-hidden">
      <div className="flex flex-none items-center justify-between border-b border-border px-4 py-3">
        <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-foreground">
          <Newspaper className="size-4 text-blue-300" /> Live News
          <span className="mq-live-dot ml-1 size-1.5 rounded-full bg-emerald-400" />
        </h2>
        {highlighted ? (
          <button type="button" onClick={onClear} className="text-[11.5px] font-medium text-blue-300 transition hover:text-blue-200">
            Clear highlight
          </button>
        ) : (
          <p className="text-[11px] text-muted-foreground">Tap a story to see affected stocks</p>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3.5">
        {news.length === 0 ? (
          <p className="px-1 py-8 text-center text-[13px] text-muted-foreground">News lands shortly after the session starts.</p>
        ) : null}
        {news.map((n, i) => (
          <motion.button
            key={n.uid}
            type="button"
            onClick={() => (highlighted === n.uid ? onClear() : onHighlight(n.uid))}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i, 4) * 0.04, ease: EASE }}
            whileHover={{ x: 2 }}
            className={cn(
              "w-full rounded-xl border p-3.5 text-left transition-colors focus-ring",
              highlighted === n.uid
                ? "border-blue-500/50 bg-blue-500/[0.08]"
                : "border-border bg-secondary/40 hover:border-border-strong hover:bg-accent",
            )}
          >
            <div className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.08em]">
              <span className={cn("font-semibold", catTone[n.cat] ?? "text-muted-foreground")}>{n.cat}</span>
              <span className="text-muted-foreground/60">·</span>
              <span className="tnum text-muted-foreground">{n.time}</span>
              <span className={cn("ml-auto rounded-full border px-2 py-0.5 text-[10px] normal-case", impactStyle[n.impact])}>
                {n.impact}
              </span>
            </div>
            <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-foreground">{n.headline}</p>
            {n.tickers?.length ? (
              <p className="tnum mt-1.5 text-[11px] text-muted-foreground">
                Affects: {n.tickers.join(" · ")}
              </p>
            ) : null}
            {/* Confidence meter */}
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[10.5px] text-muted-foreground">Confidence</span>
              <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.span
                  className={cn("absolute inset-y-0 left-0 rounded-full", impactBar[n.impact])}
                  initial={{ width: 0 }}
                  animate={{ width: `${n.confidence}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </span>
              <span className="tnum text-[10.5px] font-medium text-foreground">{n.confidence}%</span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export function NewsBulb() {
  return <Zap className="size-3.5" />;
}
