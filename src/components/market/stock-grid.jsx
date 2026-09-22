import { motion } from "motion/react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const fmt = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

function Sparkline({ candles }) {
  const pts = candles.slice(-24);
  const min = Math.min(...pts.map((c) => c.l));
  const max = Math.max(...pts.map((c) => c.h));
  const range = max - min || 1;
  const w = 72;
  const h = 26;
  const path = pts
    .map((c, i) => `${i === 0 ? "M" : "L"}${((i / (pts.length - 1)) * w).toFixed(1)},${(h - ((c.c - min) / range) * h).toFixed(1)}`)
    .join(" ");
  const up = pts[pts.length - 1].c >= pts[0].c;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-none">
      <path d={path} fill="none" stroke={up ? "#34d399" : "#f87171"} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function SentimentMeter({ value }) {
  const tone = value >= 62 ? "text-emerald-400" : value <= 40 ? "text-red-400" : "text-muted-foreground";
  const label = value >= 62 ? "Bullish" : value <= 40 ? "Bearish" : "Neutral";
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative h-1 w-14 overflow-hidden rounded-full bg-secondary">
        <span className={cn("absolute inset-y-0 left-0 rounded-full", value >= 62 ? "bg-emerald-400" : value <= 40 ? "bg-red-400" : "bg-muted-foreground/60")} style={{ width: `${value}%` }} />
      </span>
      <span className={cn("tnum text-[10.5px] font-medium", tone)}>{label} {value}%</span>
    </div>
  );
}

/**
 * Live stock grid — every card is clickable and opens the trade panel.
 * Prices flash green/red on movement; a highlight ring marks news-affected
 * stocks.
 */
export function StockGrid({ stocks, highlightSyms, selected, onSelect }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
      {stocks.map((s) => {
        const pct = ((s.price - s.prevClose) / s.prevClose) * 100;
        const up = pct >= 0;
        const highlighted = highlightSyms?.includes(s.sym);
        const flashClass = s.flash === "up" ? "mq-flash-up" : s.flash === "down" ? "mq-flash-down" : "";
        return (
          <motion.button
            key={s.sym}
            type="button"
            onClick={() => onSelect(s.sym)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            whileHover={{ y: -2 }}
            className={cn(
              "card-surface card-interactive relative overflow-hidden p-4 text-left focus-ring",
              selected === s.sym && "border-blue-500/50 bg-blue-500/[0.05]",
              highlighted && !selected && "border-blue-500/40 bg-blue-500/[0.06] shadow-[0_0_24px_-6px_rgba(59,130,246,0.4)]",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold tracking-tight text-foreground">{s.sym}</span>
                  <span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wide text-muted-foreground">
                    {s.sector}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{s.name}</p>
              </div>
              <Sparkline candles={s.candles} />
            </div>

            <div className={cn("mt-2.5 -mx-1 rounded-md px-1", flashClass)}>
              <div className="flex items-baseline gap-2">
                <span className="tnum text-[17px] font-semibold text-foreground">₹{fmt(s.price)}</span>
                <span className={cn("tnum flex items-center gap-0.5 text-[11.5px] font-medium", up ? "text-emerald-400" : "text-red-400")}>
                  {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {fmtPct(pct)}
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2">
              <SentimentMeter value={s.sentiment} />
              <span
                className={cn(
                  "tnum rounded-full border px-1.5 py-0.5 text-[10px] font-medium",
                  s.risk >= 60 ? "border-red-500/30 bg-red-500/10 text-red-300" : s.risk >= 40 ? "border-amber-500/30 bg-amber-500/10 text-amber-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                )}
              >
                Risk {s.risk}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/** Large animated candlestick chart (SVG, no dependency). */
export function CandleChart({ stock }) {
  if (!stock) return null;
  const candles = stock.candles.slice(-40);
  const min = Math.min(...candles.map((c) => c.l));
  const max = Math.max(...candles.map((c) => c.h));
  const range = max - min || 1;
  const W = 640;
  const H = 220;
  const step = W / candles.length;
  const y = (v) => H - ((v - min) / range) * H;

  return (
    <div className="card-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{stock.sym}</h3>
          <p className="text-xs text-muted-foreground">{stock.name} · {stock.sector}</p>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="tnum text-xl font-semibold text-foreground">₹{fmt(stock.price)}</span>
          <span className={cn("tnum text-[13px] font-medium", stock.price >= stock.prevClose ? "text-emerald-400" : "text-red-400")}>
            {fmtPct(((stock.price - stock.prevClose) / stock.prevClose) * 100)}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-52 w-full" preserveAspectRatio="none" role="img" aria-label={`${stock.sym} candlestick chart`}>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
        ))}
        {candles.map((c, i) => {
          const up = c.c >= c.o;
          const color = up ? "#34d399" : "#f87171";
          const x = i * step + step / 2;
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyBottom = y(Math.min(c.o, c.c));
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1" opacity="0.7" />
              <rect
                x={x - step * 0.3}
                y={bodyTop}
                width={step * 0.6}
                height={Math.max(bodyBottom - bodyTop, 1)}
                fill={color}
                opacity="0.85"
                rx="1"
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Volatility", value: `${stock.volatility.toFixed(1)}x` },
          { label: "Risk meter", value: `${stock.risk}/100` },
          { label: "Sentiment", value: `${stock.sentiment}%` },
          { label: "Sector", value: stock.sector },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
            <p className="text-[10.5px] text-muted-foreground">{m.label}</p>
            <p className="tnum mt-0.5 text-[13px] font-medium text-foreground">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
