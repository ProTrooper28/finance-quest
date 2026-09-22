import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, Briefcase, History, LineChart, Newspaper, Target, X } from "lucide-react";

import { TickerTape, StatsBar } from "@/components/market/tape";
import { ScenarioPicker } from "@/components/market/scenario-picker";
import { NewsPanel } from "@/components/market/news-panel";
import { StockGrid, CandleChart } from "@/components/market/stock-grid";
import { TradePanel } from "@/components/market/trade-panel";
import { PortfolioPanel } from "@/components/market/portfolio-panel";
import { MissionBoard, AchievementStrip, MarketLeaderboard, SessionReportModal } from "@/components/market/mission-board";
import { useMarketSim } from "@/hooks/use-market-sim";
import { PageHeader } from "@/components/app/page-header";
import { SCENARIOS, HISTORICAL_REPLAYS } from "@/data/market";
import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

const TABS = [
  { id: "market", label: "Market", icon: LineChart },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "missions", label: "Missions", icon: Target },
];

export function MarketPage() {
  const { state, actions } = useMarketSim();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState("market");

  const activeScenario = SCENARIOS.find((s) => s.id === state.scenarios.activeId);
  const activeReplay = HISTORICAL_REPLAYS.find((r) => r.id === state.scenarios.replay);
  const selectedStock = state.stocks.find((s) => s.sym === state.selected);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Market Simulator"
        subtitle={activeReplay ? `Historical Replay — ${activeReplay.name} (${activeReplay.year})` : "₹10,00,000 in virtual capital. Every action moves the market."}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Stock Market" }]}
        action={
          <div className="flex items-center gap-2">
            <span className={cn(
              "hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium sm:inline-flex",
              state.marketOpen ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-border bg-secondary text-muted-foreground",
            )}>
              <span className={cn("size-1.5 rounded-full", state.marketOpen ? "bg-emerald-400 mq-live-dot" : "bg-muted-foreground")} />
              {state.marketOpen ? "Market Open" : "Closed"}
            </span>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 text-[13px] font-medium text-foreground transition hover:bg-accent focus-ring"
            >
              <History className="size-4" />
              {activeReplay ? activeReplay.name : activeScenario?.name ?? "Live Simulated Market"}
            </button>
            {state.running ? (
              <button
                type="button"
                onClick={actions.endSession}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition hover:bg-[#3b82f6] focus-ring"
              >
                End session
              </button>
            ) : null}
          </div>
        }
      />

      <TickerTape stocks={state.stocks} />

      <StatsBar sim={state} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-3.5 pb-2.5 pt-1 text-[13px] font-medium transition-colors",
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="size-4" />
            {t.label}
            {tab === t.id ? <motion.span layoutId="market-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-duo" /> : null}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "market" ? (
          <motion.div
            key="market"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]"
          >
            <div className="min-w-0 space-y-4">
              <CandleChart stock={selectedStock ?? state.stocks[0]} />
              <StockGrid
                stocks={state.stocks}
                highlightSyms={state.highlightSyms}
                selected={state.selected}
                onSelect={actions.selectStock}
              />
            </div>
            <div className="min-h-0 xl:h-[calc(100dvh-14rem)]">
              <NewsPanel
                news={state.news}
                highlighted={state.highlighted}
                onHighlight={actions.highlightNews}
                onClear={actions.clearHighlight}
              />
            </div>
          </motion.div>
        ) : null}

        {tab === "portfolio" ? (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <PortfolioPanel sim={state} />
          </motion.div>
        ) : null}

        {tab === "missions" ? (
          <motion.div
            key="missions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid gap-4 lg:grid-cols-3"
          >
            <MissionBoard missions={state.missions} />
            <AchievementStrip achievements={state.achievements} />
            <MarketLeaderboard xp={state.xp} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <TradePanel
        sim={state}
        actions={actions}
        feedback={state.feedback && state.selected === state.feedback.sym ? state.feedback : null}
      />

      <ScenarioPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        activeId={state.scenarios.activeId}
        onStart={(scenarioId, replayId) => {
          actions.startSession(scenarioId, replayId);
          setPickerOpen(false);
          setTab("market");
        }}
      />

      <SessionReportModal report={state.report} onClose={actions.clearReport} />

      {/* Toast rail (news / events / mission completions) */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex w-80 flex-col gap-2">
        <AnimatePresence>
          {state.toasts.slice(-3).map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                "pointer-events-auto flex items-start gap-2.5 rounded-xl border p-3 shadow-lg backdrop-blur",
                t.kind === "mission" ? "border-emerald-500/30 bg-emerald-950/80" : "border-border bg-background/90",
              )}
            >
              <span className={cn("mt-0.5", t.kind === "mission" ? "text-emerald-400" : "text-blue-300")}>
                {t.kind === "mission" ? <Target className="size-4" /> : <Newspaper className="size-4" />}
              </span>
              <p className="text-[12.5px] leading-snug text-foreground">{t.text}</p>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => actions.dismissToast(t.id)}
                className="ml-auto text-muted-foreground transition hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
