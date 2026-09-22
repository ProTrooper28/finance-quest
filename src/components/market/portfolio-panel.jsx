import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Area, AreaChart, XAxis, YAxis } from "recharts";
import { HeartPulse, Layers, ShieldCheck } from "lucide-react";

import { cn } from "@/utils";

const SECTOR_COLORS = ["#3b82f6", "#6366f1", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#a78bfa", "#f472b6"];
const fmt = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtIN = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Portfolio: allocation pie, sector bars, profit timeline, holdings, health scores. */
export function PortfolioPanel({ sim }) {
  const { stocks, holdings, cash } = sim;
  const invested = holdings.reduce((acc, h) => {
    const s = stocks.find((x) => x.sym === h.sym);
    return acc + (s?.price ?? h.avgPrice) * h.qty;
  }, 0);
  const total = invested + cash;

  const allocation = useMemo(() => {
    const data = holdings.map((h) => {
      const s = stocks.find((x) => x.sym === h.sym);
      const value = (s?.price ?? h.avgPrice) * h.qty;
      return { name: h.sym, value: Math.round(value) };
    });
    if (cash > 0) data.push({ name: "Cash", value: Math.round(cash) });
    return data;
  }, [holdings, stocks, cash]);

  const sectorMix = useMemo(() => {
    const map = {};
    for (const h of holdings) {
      const s = stocks.find((x) => x.sym === h.sym);
      map[h.sector] = (map[h.sector] ?? 0) + (s?.price ?? h.avgPrice) * h.qty;
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value), pct: total ? Math.round((value / total) * 100) : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [holdings, stocks, total]);

  /* Profit timeline — synthesized from current prices vs start value per tick */
  const timeline = useMemo(() => {
    const { tickCount } = sim;
    const pts = [];
    const n = Math.max(2, Math.min(tickCount, 40));
    const endRet = ((total - 1_000_000) / 1_000_000) * 100;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      /* ease from 0 to current return with mild noise for realism */
      const noise = Math.sin(i * 2.7) * 0.25 * (1 - t);
      pts.push({ t: i, ret: Number(((endRet * t + noise)).toFixed(2)) });
    }
    return pts;
  }, [sim.tickCount, total]);

  const risk = useMemo(() => riskOf(stocks, holdings, total, cash), [stocks, holdings, total, cash]);
  const diversification = holdings.length ? Math.round(Math.min(100, (1 - herf(holdings, stocks, total)) * 70 + new Set(holdings.map((h) => h.sector)).size * 7)) : 0;
  const health = Math.max(0, Math.min(100, Math.round(diversification * 0.6 + (100 - risk) * 0.4)));

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {/* Allocation pie */}
      <section className="card-surface p-5">
        <h3 className="text-[14px] font-semibold tracking-tight text-foreground">Asset allocation</h3>
        {allocation.length ? (
          <div className="mt-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
                  {allocation.map((_, i) => (
                    <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-6 text-center text-[13px] text-muted-foreground">No holdings yet — buy something to see your allocation.</p>
        )}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {allocation.slice(0, 8).map((a, i) => (
            <span key={a.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-sm" style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
              {a.name}
            </span>
          ))}
        </div>
      </section>

      {/* Profit timeline */}
      <section className="card-surface p-5">
        <h3 className="text-[14px] font-semibold tracking-tight text-foreground">Profit timeline</h3>
        <p className="tnum mt-0.5 text-[12px] text-muted-foreground">Return since session start</p>
        <div className="mt-3 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="retFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="var(--border)" tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="var(--border)" tickLine={false} tickFormatter={(v) => `${v}%`} width={40} />
              <Area type="monotone" dataKey="ret" stroke="#3b82f6" strokeWidth={2} fill="url(#retFill)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Scores */}
      <section className="card-surface space-y-3 p-5">
        <h3 className="text-[14px] font-semibold tracking-tight text-foreground">Portfolio health</h3>
        <Score icon={ShieldCheck} label="Risk score" value={risk} invert />
        <Score icon={Layers} label="Diversification" value={diversification} />
        <Score icon={HeartPulse} label="Overall health" value={health} />
        <div>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Sector allocation</p>
          <div className="mt-2 space-y-2">
            {sectorMix.length === 0 ? <p className="text-[12.5px] text-muted-foreground">No exposure yet.</p> : null}
            {sectorMix.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-foreground">{s.name}</span>
                  <span className="tnum text-muted-foreground">{s.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-brand-duo" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holdings */}
      <section className="card-surface overflow-hidden xl:col-span-3">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-[14px] font-semibold tracking-tight text-foreground">Holdings</h3>
          <p className="tnum text-[12px] text-muted-foreground">
            {holdings.length} position{holdings.length === 1 ? "" : "s"} · Cash {fmtIN(cash)}
          </p>
        </div>
        {holdings.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-muted-foreground">Your positions will appear here. Select a stock and buy to begin.</p>
        ) : (
          <div className="divide-y divide-border">
            {holdings.map((h) => {
              const s = stocks.find((x) => x.sym === h.sym);
              const price = s?.price ?? h.avgPrice;
              const value = price * h.qty;
              const pnl = (price - h.avgPrice) * h.qty;
              const pnlPct = ((price - h.avgPrice) / h.avgPrice) * 100;
              return (
                <div key={h.sym} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3.5">
                  <div className="min-w-36 flex-1">
                    <p className="text-[13.5px] font-semibold text-foreground">{h.sym}</p>
                    <p className="text-[11px] text-muted-foreground">{h.name} · {h.sector}</p>
                  </div>
                  <Cell2 label="Qty" value={String(h.qty)} />
                  <Cell2 label="Avg buy" value={`₹${fmt(h.avgPrice)}`} />
                  <Cell2 label="Current" value={`₹${fmt(price)}`} />
                  <Cell2 label="Value" value={fmtIN(value)} />
                  <div className="text-right">
                    <p className="text-[10.5px] text-muted-foreground">P/L</p>
                    <p className={cn("tnum text-[13.5px] font-semibold", pnl >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {pnl >= 0 ? "+" : "−"}{fmtIN(Math.abs(pnl))} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Cell2({ label, value }) {
  return (
    <div className="min-w-20">
      <p className="text-[10.5px] text-muted-foreground">{label}</p>
      <p className="tnum text-[12.5px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function Score({ icon: Icon, label, value, invert }) {
  const good = invert ? value <= 50 : value >= 60;
  const mid = invert ? value <= 65 : value >= 40;
  const tone = good ? "text-emerald-400" : mid ? "text-amber-300" : "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 flex-none place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-[12.5px]">
          <span className="text-foreground">{label}</span>
          <span className={cn("tnum font-semibold", tone)}>{value}</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className={cn("h-full rounded-full", good ? "bg-emerald-500" : mid ? "bg-amber-400" : "bg-red-500")} style={{ width: `${value}%` }} />
        </div>
      </div>
    </div>
  );
}

function herf(holdings, stocks, total) {
  if (!total) return 0;
  return holdings.reduce((acc, h) => {
    const s = stocks.find((x) => x.sym === h.sym);
    const w = ((s?.price ?? h.avgPrice) * h.qty) / total;
    return acc + w * w;
  }, 0);
}

function riskOf(stocks, holdings, total, cash) {
  if (!holdings.length || total <= 0) return 20;
  let exposure = 0;
  for (const h of holdings) {
    const s = stocks.find((x) => x.sym === h.sym);
    const w = ((s?.price ?? h.avgPrice) * h.qty) / total;
    exposure += w * (s?.risk ?? 40);
  }
  const concentration = 1 - (cash / total || 0);
  return Math.round(Math.min(100, exposure * concentration * 0.9 + herf(holdings, stocks, total) * 40 + 8));
}
