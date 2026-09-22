import { motion } from "motion/react";
import { Coins, Flame, Play, TrendingDown, TrendingUp, Zap } from "lucide-react";

import { useNavigate } from "@/utils/router";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const fmt = (n) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

/** Seamless running ticker tape across the top of the simulator. */
export function TickerTape({ stocks }) {
  const items = stocks.map((s) => ({
    sym: s.sym,
    price: fmt(s.price),
    pct: ((s.price - s.prevClose) / s.prevClose) * 100,
  }));
  return (
    <div className="overflow-hidden border-y border-border bg-secondary/40 py-2" aria-hidden>
      <div className="mq-tape">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {items.map((it) => (
              <span key={`${dup}-${it.sym}`} className="mx-4 flex items-center gap-2 text-[12.5px] whitespace-nowrap">
                <span className="font-semibold text-foreground">{it.sym}</span>
                <span className="tnum text-muted-foreground">₹{it.price}</span>
                <span className={cn("tnum font-medium", it.pct >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {it.pct >= 0 ? "▲" : "▼"} {fmtPct(it.pct).replace("+", "").replace("-", "")}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatTile({ label, value, sub, tone }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-secondary/40 px-3.5 py-3">
      <p className="truncate text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className={cn("tnum mt-1 truncate text-[17px] font-semibold", tone ?? "text-foreground")}>{value}</p>
      {sub ? <p className="tnum mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

/** Top stats: cash, invested, portfolio, today's P/L, return %, risk, XP, coins, market status. */
export function StatsBar({ sim }) {
  const { stocks, holdings, cash, xp, coins, marketOpen, nifty, startNifty } = sim;
  const invested = holdings.reduce((acc, h) => {
    const s = stocks.find((x) => x.sym === h.sym);
    return acc + (s?.price ?? h.avgPrice) * h.qty;
  }, 0);
  const total = invested + cash;
  const retPct = ((total - 1_000_000) / 1_000_000) * 100;
  const dayPnl = holdings.reduce((acc, h) => {
    const s = stocks.find((x) => x.sym === h.sym);
    if (!s) return acc;
    const dayMove = (s.price - s.prevClose) / s.prevClose;
    return acc + s.price * h.qty * dayMove / (1 + dayMove);
  }, 0);

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Virtual cash" value={`₹${fmt(cash)}`} />
        <StatTile label="Invested" value={`₹${fmt(invested)}`} />
        <StatTile label="Portfolio value" value={`₹${fmt(total)}`} sub={`${fmtPct(retPct)} overall`} tone={retPct >= 0 ? "text-emerald-400" : "text-red-400"} />
        <StatTile
          label="Today's P/L"
          value={`${dayPnl >= 0 ? "+" : "−"}₹${fmt(Math.abs(dayPnl))}`}
          tone={dayPnl >= 0 ? "text-emerald-400" : "text-red-400"}
        />
        <StatTile label="Risk score" value="—" sub="in portfolio tab" />
        <StatTile
          label="Market status"
          value={marketOpen ? "Open" : "Closed"}
          sub={`NIFTY ${nifty.toLocaleString("en-IN")}`}
          tone={marketOpen ? "text-emerald-400" : "text-muted-foreground"}
        />
        <StatTile label="XP earned today" value={xp.toLocaleString("en-IN")} tone="text-blue-300" />
        <StatTile label="Coins" value={coins.toLocaleString("en-IN")} tone="text-amber-300" />
      </div>

      <ChallengeBanner retPct={retPct} niftyPct={((nifty - startNifty) / startNifty) * 100} />
    </div>
  );
}

function ChallengeBanner({ retPct, niftyPct }) {
  const navigate = useNavigate();
  const winning = retPct > niftyPct;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="relative overflow-hidden rounded-[20px] border border-blue-500/25 bg-[#0d1526] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_20px_48px_-24px_rgba(37,99,235,0.35)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(480px 200px at 85% -20%, rgba(37,99,235,0.2), transparent 70%)" }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid size-11 flex-none place-items-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-300">
            <Flame className="size-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-orange-300">Today's challenge</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Beat the NIFTY today.</h2>
            <p className="tnum mt-1 text-[12.5px] text-muted-foreground">
              You {winning ? "are" : "are not"} ahead of the index ({fmtPct(retPct)} vs NIFTY {fmtPct(niftyPct)}) · Reward: <span className="font-medium text-blue-300">+500 XP</span> · <span className="font-medium text-amber-300">+100 coins</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/market")}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-duo px-5 text-[13.5px] font-semibold text-white shadow-[0_10px_28px_-8px_rgba(59,130,246,0.55)] transition hover:shadow-[0_14px_36px_-8px_rgba(59,130,246,0.65)] focus-ring"
        >
          <Play className="size-4 fill-white" /> Start Trading
        </button>
      </div>
    </motion.div>
  );
}
