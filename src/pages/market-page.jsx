import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, Briefcase, History, LineChart, Newspaper, Play, RotateCcw, Target, X } from "lucide-react";

import { TickerTape, StatsBar } from "@/components/market/tape";
import { ScenarioPicker } from "@/components/market/scenario-picker";
import { NewsPanel } from "@/components/market/news-panel";
import { StockGrid, CandleChart } from "@/components/market/stock-grid";
import { TradePanel } from "@/components/market/trade-panel";
import { PortfolioPanel } from "@/components/market/portfolio-panel";
import { MissionBoard, AchievementStrip, MarketLeaderboard, SessionReportModal } from "@/components/market/mission-board";
import { SimulationSetup, SimulationLoading } from "@/components/market/setup-wizard";
import { useMarketSim } from "@/hooks/use-market-sim";
import { PageHeader } from "@/components/app/page-header";
import { SCENARIOS, HISTORICAL_REPLAYS, TIME_MODES, INVESTMENT_STYLES } from "@/data/market";
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

  /* Page flow: pick (scenario list) → setup (mode+style) → loading → live */
  const [phase, setPhase] = useState("idle"); // idle | setup | loading | live
  const [pending, setPending] = useState(null); // { scenarioId, replayId }

  const activeScenario = SCENARIOS.find((s) => s.id === state.scenarios.activeId);
  const activeReplay = HISTORICAL_REPLAYS.find((r) => r.id === state.scenarios.replay);
  const selectedStock = state.stocks.find((s) => s.sym === state.selected);

  /* Loading phase: hold 2.4s while the checklist animates, then go live */
  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => {
      actions.startSession(pending.scenarioId, pending.replayId, pending.timeMode, pending.style);
      setPhase("live");
    }, 2400);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const beginSetup = (scenarioId, replayId) => {
    setPending({ scenarioId, replayId });
    setPickerOpen(false);
    setPhase("setup");
  };

  const launch = (timeMode, style) => {
    setPending((p) => ({ ...p, timeMode, style }));
    setPhase("loading");
  };

  const restart = () => {
    actions.clearReport();
    setPending(null);
    setPhase("idle");
    setPickerOpen(true);
  };

  const scenarioName = activeReplay ? activeReplay.name : activeScenario?.name ?? "Live Simulated Market";
  const modeName = TIME_MODES.find((m) => m.id === (pending?.timeMode ?? state.timeMode))?.name ?? "";
  const styleName = INVESTMENT_STYLES.find((s) => s.id === (pending?.style ?? state.style))?.name ?? "";

  /* ------------------------------ setup phases ----------------------------- */

  if (phase === "setup") {
    return (
      <div className="py-6">
        <SimulationSetup
          scenarioName={HISTORICAL_REPLAYS.find((r) => r.id === pending.replayId)?.name ?? SCENARIOS.find((s) => s.id === pending.scenarioId)?.name ?? "Market"}
          onLaunch={launch}
          onBack={() => { setPhase("idle"); setPickerOpen(true); }}
        />
      </div>
    );
  }

  if (phase === "loading") {
    return <SimulationLoading scenarioName={scenarioName} modeName={modeName} styleName={styleName} />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Market Simulator"
        subtitle={
          phase === "live"
            ? `${scenarioName} · ${modeName} · ${styleName}`
            : "₹10,00,000 in virtual capital. Choose an experience to begin."
        }
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
              {scenarioName}
            </button>
            {state.running ? (
              <button
                type="button"
                onClick={actions.endSession}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition hover:bg-[#3b82f6] focus-ring"
              >
                End session
              </button>
            ) : (
              <button
                type="button"
                onClick={restart}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-duo px-3.5 text-[13px] font-medium text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,0.5)] transition hover:shadow-[0_12px_32px_-8px_rgba(59,130,246,0.6)] focus-ring"
              >
                <Play className="size-3.5 fill-white" /> New session
              </button>
            )}
          </div>
        }
      />

      {/* Simulated clock strip */}
      {phase === "live" && state.clock ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-[12.5px]">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Activity className="size-3.5 text-blue-300" />
            {state.timeMode === "longterm" ? "Month" : state.timeMode === "weekly" || state.timeMode === "monthly" ? "Session" : "Market time"}
          </span>
          <span className="tnum rounded-md border border-border bg-background px-2 py-0.5 font-semibold text-foreground">{state.clock.label}</span>
          <span className="text-muted-foreground">
            {state.scenarios.replay ? "Historical replay running" : "Simulation running"} · every move updates prices, portfolio, XP and missions
          </span>
        </div>
      ) : null}

      {phase !== "live" ? (
        /* Pre-session idle: prompt to configure */
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="relative overflow-hidden rounded-[20px] border border-blue-500/25 bg-[#0d1526] p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.3),0_24px_64px_-24px_rgba(37,99,235,0.35)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(560px 240px at 50% -20%, rgba(37,99,235,0.22), transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-lg">
            <h2 className="text-xl font-semibold tracking-tight text-white">Start a simulation</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              Pick a market experience, choose your time mode and investment style — then trade with ₹10,00,000 in virtual capital while the AI mentor explains every move.
            </p>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-duo px-6 text-[14px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(59,130,246,0.55)] transition hover:shadow-[0_16px_40px_-8px_rgba(59,130,246,0.65)] focus-ring"
            >
              <Play className="size-4 fill-white" /> Choose Market Experience
            </button>
          </div>
        </motion.section>
      ) : (
        <>
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
        </>
      )}

      <ScenarioPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        activeId={state.scenarios.activeId}
        onStart={beginSetup}
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
