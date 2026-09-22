import { ArrowDownRight, ArrowUpRight, Newspaper, Plus, TrendingUp } from "lucide-react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  marketMeta, marketNews, marketStats, tradePanel, trending, watchlist,
} from "@/data/app";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

/* Deterministic placeholder sparkline so the layout reads as a chart. */
const CHART_POINTS = [
  38, 42, 40, 46, 44, 52, 49, 55, 61, 57, 63, 59, 66, 72, 68, 74, 70, 78, 73, 81, 76, 84, 79, 86,
];

function ChartPlaceholder() {
  const W = 600;
  const H = 180;
  const max = Math.max(...CHART_POINTS);
  const min = Math.min(...CHART_POINTS);
  const pts = CHART_POINTS.map((v, i) => {
    const x = (i / (CHART_POINTS.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * (H - 24) - 12;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-44 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(59 130 246 / 0.18)" />
          <stop offset="100%" stopColor="rgb(59 130 246 / 0)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgb(255 255 255 / 0.05)" strokeDasharray="3 5" />
      ))}
      <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill="url(#chart-fill)" />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="rgb(96 165 250)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarketPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title={marketMeta.title}
        subtitle={marketMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Market Simulator" }]}
        action={
          <Button variant="secondary" size="sm">
            <Plus /> Add to watchlist
          </Button>
        }
      />

      {/* Market overview stats */}
      <section className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {marketStats.map((s, i) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            icon={s.id === "pnl" ? (s.value.startsWith("-") ? ArrowDownRight : ArrowUpRight) : TrendingUp}
            tone={s.tone === "neutral" ? "violet" : "blue"}
            delay={i * 0.05}
          />
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left: chart + portfolio */}
        <div className="space-y-5 lg:col-span-2">
          <section className="card-surface p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{tradePanel.stock}</h2>
                  <span className="tnum rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    NSE · demo
                  </span>
                </div>
                <p className="mt-1 flex items-baseline gap-2">
                  <span className="tnum text-2xl font-semibold tracking-tight text-foreground">{tradePanel.price}</span>
                  <span className="tnum text-[13px] font-medium text-emerald-400">{tradePanel.change}</span>
                </p>
              </div>
              <div className="flex gap-1.5">
                {["1D", "1W", "1M", "1Y"].map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition",
                      i === 2 ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <ChartPlaceholder />
            </div>
          </section>

          <section>
            <SectionHeader title="Portfolio" hint="Your simulated holdings" />
            <div className="card-surface overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Qty</th>
                    <th className="px-5 py-3 font-medium">Avg. cost</th>
                    <th className="px-5 py-3 font-medium">LTP</th>
                    <th className="px-5 py-3 text-right font-medium">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {watchlist.map((w) => (
                    <tr key={w.symbol} className="transition hover:bg-accent/50">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">{w.symbol}</p>
                        <p className="text-xs text-muted-foreground">{w.name}</p>
                      </td>
                      <td className="tnum px-5 py-3.5 text-muted-foreground">10</td>
                      <td className="tnum px-5 py-3.5 text-muted-foreground">{w.price}</td>
                      <td className="tnum px-5 py-3.5 text-foreground">{w.price}</td>
                      <td className={cn("tnum px-5 py-3.5 text-right font-medium", w.up ? "text-emerald-400" : "text-destructive")}>
                        {w.up ? "+" : "−"}₹{w.up ? "1,240" : "860"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right: watchlist, trending, news, trade panel */}
        <div className="space-y-5">
          <section>
            <SectionHeader title="Watchlist" />
            <div className="card-surface divide-y divide-border">
              {watchlist.map((w) => (
                <div key={w.symbol} className="flex items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{w.symbol}</p>
                    <p className="truncate text-xs text-muted-foreground">{w.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="tnum text-[13px] font-medium text-foreground">{w.price}</p>
                    <p className={cn("tnum text-xs font-medium", w.up ? "text-emerald-400" : "text-destructive")}>{w.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Trending" />
            <div className="card-surface divide-y divide-border">
              {trending.map((t) => (
                <div key={t.symbol} className="flex items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{t.symbol}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.name}</p>
                  </div>
                  <span className={cn("tnum text-xs font-medium", t.up ? "text-emerald-400" : "text-destructive")}>{t.change}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Market news" />
            <div className="card-surface divide-y divide-border">
              {marketNews.map((n) => (
                <div key={n.id} className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {n.tag}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-foreground">{n.title}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card-surface p-5">
            <p className="eyebrow">Trade panel</p>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[15px] font-semibold tracking-tight text-foreground">{tradePanel.stock}</span>
              <span className="tnum text-[13px] text-muted-foreground">{tradePanel.price}</span>
            </div>
            <div className="mt-4 space-y-2.5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Quantity</span>
                <input
                  type="number"
                  min="1"
                  defaultValue="10"
                  className="h-10 w-full rounded-lg border border-border bg-secondary/60 px-3 text-[13px] text-foreground focus-ring"
                />
              </label>
              <p className="tnum text-xs text-muted-foreground">Cash available — {tradePanel.cash}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">Buy</Button>
              <Button size="sm" variant="secondary" className="bg-destructive/90 text-white hover:bg-destructive">Sell</Button>
              <Button size="sm" variant="secondary">Hold</Button>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Simulated market. No real money, no real orders.
            </p>
          </section>
        </div>
      </div>

      <EmptyState
        icon={Newspaper}
        title="Deeper market data is on the way"
        body="Order history, holdings analytics and the AI trade debrief will plug into this layout."
      />
    </div>
  );
}
