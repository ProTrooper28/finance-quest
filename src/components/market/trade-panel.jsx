import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Brain, Lightbulb, ShieldAlert, TrendingUp, X } from "lucide-react";

import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];
const fmt = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtIN = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Side panel for the selected stock — trade controls + AI mentor debrief. */
export function TradePanel({ sim, actions, feedback }) {
  const [qty, setQty] = useState(1);

  const stock = useMemo(
    () => sim.stocks.find((s) => s.sym === sim.selected) ?? null,
    [sim.stocks, sim.selected],
  );

  useEffect(() => setQty(1), [sim.selected]);

  const cost = stock ? stock.price * qty : 0;
  const holding = stock ? sim.holdings.find((h) => h.sym === stock.sym) : null;

  return (
    <AnimatePresence>
      {stock ? (
        <>
          <motion.button
            type="button"
            aria-label="Close trade panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={actions.closePanel}
            className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          />
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-border bg-background shadow-2xl xl:sticky xl:top-0 xl:z-auto xl:h-dvh xl:shadow-none"
          >
            <div className="flex flex-none items-start justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-[16px] font-semibold tracking-tight text-foreground">{stock.name}</h2>
                <p className="tnum mt-0.5 text-[12.5px] text-muted-foreground">
                  {stock.sym} · {stock.sector} · ₹{fmt(stock.price)}
                </p>
              </div>
              <button type="button" onClick={actions.closePanel} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <Metric label="52W high" value={`₹${fmt(stock.price * 1.18)}`} />
                <Metric label="52W low" value={`₹${fmt(stock.price * 0.78)}`} />
                <Metric label="AI sentiment" value={`${stock.sentiment}%`} tone={stock.sentiment >= 62 ? "text-emerald-400" : stock.sentiment <= 40 ? "text-red-400" : "text-muted-foreground"} />
                <Metric label="Risk score" value={`${stock.risk}/100`} tone={stock.risk >= 60 ? "text-red-400" : stock.risk >= 40 ? "text-amber-300" : "text-emerald-400"} />
              </div>

              {/* Recent news for this stock */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Recent news</p>
                <div className="mt-2 space-y-2">
                  {(sim.news ?? []).filter((n) => n.tickers?.includes(stock.sym)).slice(0, 3).map((n) => (
                    <div key={n.uid} className="rounded-lg border border-border bg-secondary/40 p-2.5">
                      <p className="text-[12.5px] font-medium leading-snug text-foreground">{n.headline}</p>
                      <p className="mt-0.5 text-[10.5px] text-muted-foreground">{n.cat} · {n.time}</p>
                    </div>
                  ))}
                  {!(sim.news ?? []).some((n) => n.tickers?.includes(stock.sym)) ? (
                    <p className="text-[12.5px] text-muted-foreground">No recent stock-specific news. Trading on price action alone carries more risk.</p>
                  ) : null}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Quantity</p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-9 place-items-center rounded-lg border border-border bg-secondary text-foreground transition hover:bg-accent">−</button>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Math.min(9999, Math.floor(Number(e.target.value) || 1))))}
                    className="tnum h-9 w-full flex-1 rounded-lg border border-border bg-secondary/60 px-3 text-center text-[13.5px] text-foreground focus-ring"
                  />
                  <button type="button" onClick={() => setQty((q) => Math.min(9999, q + 1))} className="grid size-9 place-items-center rounded-lg border border-border bg-secondary text-foreground transition hover:bg-accent">+</button>
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2">
                  <span className="text-[12px] text-muted-foreground">Estimated cost</span>
                  <span className="tnum text-[13.5px] font-semibold text-foreground">{fmtIN(cost)}</span>
                </div>
                <p className="tnum mt-1.5 text-[11.5px] text-muted-foreground">
                  Cash after: {fmtIN(Math.max(0, sim.cash - (cost <= sim.cash ? cost : 0)))}
                  {holding ? ` · You hold ${holding.qty} @ ₹${fmt(holding.avgPrice)} avg` : ""}
                </p>
              </div>

              {/* Trade buttons */}
              <div className="grid grid-cols-3 gap-2">
                <TradeBtn side="buy" disabled={cost > sim.cash} onClick={() => actions.trade(stock.sym, "buy", qty)}>BUY</TradeBtn>
                <TradeBtn side="sell" disabled={!holding} onClick={() => actions.trade(stock.sym, "sell", Math.min(qty, holding?.qty ?? 1))}>SELL</TradeBtn>
                <TradeBtn side="hold" onClick={() => actions.trade(stock.sym, "hold", 0)}>HOLD</TradeBtn>
              </div>

              {/* AI mentor debrief */}
              {feedback ? <MentorDebrief feedback={feedback} onClose={actions.clearFeedback} /> : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
      <p className="text-[10.5px] text-muted-foreground">{label}</p>
      <p className={cn("tnum mt-0.5 text-[13.5px] font-semibold", tone ?? "text-foreground")}>{value}</p>
    </div>
  );
}

function TradeBtn({ side, disabled, onClick, children }) {
  const style = {
    buy: "bg-emerald-600 text-white hover:bg-emerald-500",
    sell: "bg-red-600 text-white hover:bg-red-500",
    hold: "border border-border bg-secondary text-foreground hover:bg-accent",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-10 rounded-lg text-[12.5px] font-semibold tracking-wide transition active:translate-y-px focus-ring disabled:pointer-events-none disabled:opacity-40",
        style[side],
      )}
    >
      {children}
    </button>
  );
}

/** AI mentor debrief after every trade — the learning moment. */
function MentorDebrief({ feedback, onClose }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-xl border border-indigo-500/25 bg-indigo-500/[0.06] p-4"
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-indigo-300">
          <Brain className="size-4" /> AI Mentor
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] normal-case tracking-normal">{feedback.verdict}</span>
        </p>
        <button type="button" onClick={onClose} aria-label="Dismiss" className="text-muted-foreground transition hover:text-foreground">
          <X className="size-3.5" />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <Section icon={TrendingUp} tone="text-emerald-400" title="Why this works">
          {feedback.good.map((g, i) => <p key={i} className="text-[12.5px] leading-relaxed text-foreground/90">· {g}</p>)}
        </Section>
        {feedback.risks.length ? (
          <Section icon={ShieldAlert} tone="text-amber-300" title="Potential risks">
            {feedback.risks.map((g, i) => <p key={i} className="text-[12.5px] leading-relaxed text-foreground/90">· {g}</p>)}
          </Section>
        ) : null}
        {feedback.alternatives.length ? (
          <Section icon={Lightbulb} tone="text-blue-300" title="Alternative strategy">
            {feedback.alternatives.map((g, i) => <p key={i} className="text-[12.5px] leading-relaxed text-foreground/90">· {g}</p>)}
          </Section>
        ) : null}
        {feedback.learningTips.length ? (
          <div className="flex flex-wrap gap-1.5">
            {feedback.learningTips.map((tip) => (
              <button key={tip} type="button" className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-blue-500/30 hover:text-blue-300">
                “{tip}”
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}

function Section({ icon: Icon, tone, title, children }) {
  return (
    <div>
      <p className={cn("flex items-center gap-1.5 text-[11.5px] font-semibold", tone)}>
        <Icon className="size-3.5" /> {title}
      </p>
      <div className="mt-1 space-y-1">{children}</div>
    </div>
  );
}
