/* Market simulation runtime: owns clock-driven state (prices, news, events),
   trade execution and reward bookkeeping. Pure math lives in
   utils/market-engine.js. */

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

import { MISSIONS, ACHIEVEMENTS } from "@/data/market";
import {
  initStocks, mulberry32, nextNews, applyNews, tickPrices, decaySentiment,
  portfolioValue, riskScore, diversificationScore, countSectors, scenarioParams,
  evaluateMissions, tradeFeedback, sessionReport,
} from "@/utils/market-engine";

const START_CASH = 1_000_000;
const TICK_MS = 2500;
const BASE_SEED = 20260922;
const MAX_NEWS = 14;

const initialMissions = MISSIONS.map((m) => ({ ...m, progress: 0, done: false }));

function makeSnapshot(stocks, holdings, cash, nifty, startNifty, trades) {
  const { invested, total } = portfolioValue(stocks, holdings, cash);
  const startValue = START_CASH;
  const profitPct = ((total - startValue) / startValue) * 100;
  return {
    invested,
    total,
    profitPct,
    cash,
    bankingHoldings: holdings.filter((h) => h.sector === "Banking").length,
    sectors: countSectors(holdings),
    beatNifty: profitPct > niftyDeltaPct(startNifty, nifty),
    trades,
  };
}

function niftyDeltaPct(startNifty, nifty) {
  return ((nifty - startNifty) / startNifty) * 100;
}

/** The whole simulator state, driven from one reducer. */
export function useMarketSim() {
  const seedRef = useRef(BASE_SEED + Math.floor(Math.random() * 1e6));

  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    stocks: initStocks(mulberry32(seedRef.current)),
    cash: START_CASH,
    holdings: [],
    news: [],
    recentNewsIds: [],
    highlighted: null, // news uid → highlight affected stocks
    selected: null, // stock symbol for the trade panel
    scenarios: { activeId: "live", replay: null },
    missions: initialMissions,
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, earned: false })),
    xp: 0,
    coins: 0,
    trades: 0,
    newsTrades: 0,
    decisions: 0,
    mistakes: 0,
    feedback: null, // AI mentor debrief after each trade
    running: false,
    marketOpen: true,
    tickCount: 0,
    nifty: 24850,
    startNifty: 24850,
    startValue: START_CASH,
    sessionStartedAt: null,
    report: null,
    toasts: [],
  }));

  /* ------------------------------ market clock ---------------------------- */

  useEffect(() => {
    if (!state.running) return;
    const iv = setInterval(() => {
      dispatch({ type: "tick" });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, [state.running]);

  /* -------------------------------- actions ------------------------------- */

  const selectStock = useCallback((sym) => dispatch({ type: "select", sym }), []);
  const closePanel = useCallback(() => dispatch({ type: "closePanel" }), []);
  const highlightNews = useCallback((uid) => dispatch({ type: "highlight", uid }), []);
  const clearHighlight = useCallback(() => dispatch({ type: "clearHighlight" }), []);
  const startSession = useCallback((scenarioId, replayId) => dispatch({ type: "start", scenarioId, replayId }), []);
  const clearFeedback = useCallback(() => dispatch({ type: "clearFeedback" }), []);
  const clearReport = useCallback(() => dispatch({ type: "clearReport" }), []);
  const endSession = useCallback(() => dispatch({ type: "end" }), []);
  const dismissToast = useCallback((id) => dispatch({ type: "dismissToast", id }), []);

  const trade = useCallback((sym, side, qty) => dispatch({ type: "trade", sym, side, qty }), []);

  return {
    state,
    actions: { selectStock, closePanel, highlightNews, clearHighlight, startSession, trade, endSession, clearFeedback, clearReport, dismissToast },
  };
}

/* --------------------------------- reducer -------------------------------- */

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return startSession(state, action);

    case "tick": {
      const { driftAll, shockScale, newsEvery } = scenarioParams(state.scenarios.activeId);
      const rng = mulberry32(seedRef.current + state.tickCount * 7919);
      let stocks = tickPrices(state.stocks, rng, driftAll);
      const tickCount = state.tickCount + 1;

      let news = state.news;
      let recentNewsIds = state.recentNewsIds;
      let toasts = state.toasts;

      /* Event news on cadence */
      if (tickCount % newsEvery === 0) {
        const raw = nextNews(rng, recentNewsIds);
        const item = { ...raw, headline: scaleHeadline(raw, state.scenarios.activeId) };
        stocks = applyNewsWithScale(stocks, item, shockScale);
        news = [item, ...news].slice(0, MAX_NEWS);
        recentNewsIds = [item.id, ...recentNewsIds].slice(0, 4);
        toasts = [...toasts, { id: item.uid, kind: "news", text: item.headline, tick: tickCount }].slice(-3);
      }

      /* Random system events every ~35s (14 ticks) */
      if (tickCount % 14 === 0) {
        const ev = pickEvent(rng);
        stocks = applySystemEvent(stocks, ev, rng, shockScale);
        toasts = [...toasts, { id: `ev-${tickCount}`, kind: "event", text: `${ev.kind} — market reacting`, tick: tickCount }].slice(-3);
      }

      /* NIFTY index tracks the broad market */
      const avg = stocks.reduce((s, x) => s + x.price / x.base, 0) / stocks.length;
      const nifty = Math.round(24850 * avg);
      stocks = decaySentiment(stocks);

      /* Missions */
      const holdings = state.holdings;
      const { cash } = state;
      const snapshot = makeSnapshot(stocks, holdings, cash, nifty, state.startNifty, state.trades);
      const { missions, justCompleted } = evaluateMissions(state.missions, snapshot);
      let xp = state.xp;
      let coins = state.coins;
      if (justCompleted.length) {
        for (const id of justCompleted) {
          const m = missions.find((x) => x.id === id);
          xp += m.xp;
          coins += m.coins;
          toasts = [...toasts, { id: `mission-${id}-${tickCount}`, kind: "mission", text: `Mission complete: ${m.title} (+${m.xp} XP)`, tick: tickCount }].slice(-3);
        }
      }

      /* Toasts live for ~3 ticks */
      const liveToasts = toasts.filter((t) => tickCount - (t.tick ?? tickCount) < 3).slice(-3);

      return { ...state, stocks, news, recentNewsIds, toasts: liveToasts, tickCount, nifty, missions, xp, coins };
    }

    case "dismissToast":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case "highlight": {
      const item = state.news.find((n) => n.uid === action.uid);
      if (!item) return state;
      return { ...state, highlighted: action.uid, highlightSyms: item.tickers };
    }

    case "clearHighlight":
      return { ...state, highlighted: null, highlightSyms: null };

    case "select":
      return { ...state, selected: action.sym, feedback: null };

    case "closePanel":
      return { ...state, selected: null, feedback: null };

    case "trade": {
      const s = state.stocks.find((x) => x.sym === action.sym);
      if (!s) return state;
      const qty = Math.max(1, Math.floor(action.qty));
      const side = action.side;
      const cost = s.price * qty;

      if (side === "buy" && cost > state.cash) return state; // guarded in UI

      let cash = state.cash;
      let holdings = state.holdings;
      let mistakes = state.mistakes;
      let newsTrades = state.newsTrades;
      let decisions = state.decisions;

      if (side === "buy") {
        cash -= cost;
        const existing = holdings.find((h) => h.sym === s.sym);
        holdings = existing
          ? holdings.map((h) =>
              h.sym === s.sym
                ? { ...h, qty: h.qty + qty, avgPrice: (h.avgPrice * h.qty + cost) / (h.qty + qty) }
                : h,
            )
          : [...holdings, { sym: s.sym, name: s.name, sector: s.sector, qty, avgPrice: s.price }];
      } else if (side === "sell") {
        const existing = holdings.find((h) => h.sym === s.sym);
        if (!existing || existing.qty < qty) return state;
        const proceeds = s.price * qty;
        const gain = (s.price - existing.avgPrice) * qty;
        if (gain < 0) mistakes += 1;
        cash += proceeds;
        holdings = holdings
          .map((h) => (h.sym === s.sym ? { ...h, qty: h.qty - qty } : h))
          .filter((h) => h.qty > 0);
        decisions += 1;
      } else {
        decisions += 1;
      }

      const trades = state.trades + 1;
      if (side !== "hold") newsTrades = state.newsTrades + (s.sentiment >= 62 || s.sentiment <= 40 ? 1 : 0);
      if (side === "buy" && s.risk > 60) mistakes += 1;

      const { total } = portfolioValue(state.stocks, holdings, cash);
      const profitPct = ((total - state.startValue) / state.startValue) * 100;
      const risk = riskScore(state.stocks, holdings, total, cash);
      const sectorsHeld = new Set(holdings.map((h) => h.sector));

      /* Achievements */
      let achievements = state.achievements;
      let xp = state.xp;
      const unlock = (id) => {
        const a = achievements.find((x) => x.id === id);
        if (a && !a.earned) {
          achievements = achievements.map((x) => (x.id === id ? { ...x, earned: true } : x));
          xp += a.xp;
        }
      };
      unlock("first-trade");
      if (side === "sell") {
        const existing = state.holdings.find((h) => h.sym === s.sym);
        if (existing && s.price > existing.avgPrice) unlock("first-profit");
      }
      if (sectorsHeld.size >= 5) unlock("diversify-master");
      if (newsTrades >= 3) unlock("news-analyst");
      if (trades >= 5 && risk < 45) unlock("risk-manager");
      if (holdings.length === 0 && side === "sell") unlock("market-expert"); // fully exited a session

      const snapshot = makeSnapshot(state.stocks, holdings, cash, state.nifty, state.startNifty, trades);
      const { missions, justCompleted } = evaluateMissions(state.missions, snapshot);
      if (justCompleted.length) {
        for (const id of justCompleted) {
          const m = missions.find((x) => x.id === id);
          xp += m.xp;
        }
      }

      const feedback = tradeFeedback(s, side, qty, cost, {
        sentiment: s.sentiment,
        newsFor: state.news.filter((n) => n.tickers.includes(s.sym)).slice(0, 2),
        risk,
        sectorsHeld,
        profitPct,
      });

      return {
        ...state,
        cash,
        holdings,
        trades,
        newsTrades,
        decisions,
        mistakes,
        achievements,
        xp,
        missions,
        feedback: { side, sym: s.sym, name: s.name, qty, cost, at: Date.now(), ...feedback },
      };
    }

    case "end": {
      const report = sessionReport({
        startValue: state.startValue,
        stocks: state.stocks,
        holdings: state.holdings,
        cash: state.cash,
        missions: state.missions,
        decisions: state.decisions,
        mistakes: state.mistakes,
        startNifty: state.startNifty,
        nifty: state.nifty,
      });
      return { ...state, running: false, marketOpen: false, report };
    }

    case "clearFeedback":
      return { ...state, feedback: null };

    case "clearReport":
      return { ...state, report: null };

    default:
      return state;
  }
}

/* ------------------------------- reducer helpers -------------------------- */

function startSession(state, action) {
  const scenarioId = action.scenarioId ?? "live";
  const replay = action.replayId ?? null;
  const rng = mulberry32((seedRef.current + Date.now()) >>> 0);
  const stocks = initStocks(rng);
  const first = nextNews(rng, []);
  return {
    ...state,
    stocks,
    scenarios: { activeId: scenarioId, replay },
    cash: START_CASH,
    holdings: [],
    news: [first],
    recentNewsIds: [first.id],
    missions: initialMissions.map((m) => ({ ...m })),
    achievements: ACHIEVEMENTS.map((a) => ({ ...a, earned: false })),
    xp: 0,
    coins: 0,
    trades: 0,
    newsTrades: 0,
    decisions: 0,
    mistakes: 0,
    feedback: null,
    report: null,
    highlighted: null,
    highlightSyms: null,
    selected: null,
    running: true,
    marketOpen: true,
    tickCount: 0,
    nifty: 24850,
    startNifty: 24850,
    startValue: START_CASH,
    sessionStartedAt: Date.now(),
    toasts: [{ id: `start-${Date.now()}`, kind: "session", text: replay ? `Historical replay started — ${replay}` : `${scenarioId} market started` }],
  };
}

function scaleHeadline(raw, scenarioId) {
  if (scenarioId === "bear") return raw.impact === "bullish" ? raw.headline : `Selling deepens — ${raw.headline.charAt(0).toLowerCase()}${raw.headline.slice(1)}`;
  if (scenarioId === "bull") return raw.impact === "bearish" ? `Dip bought aggressively — ${raw.headline.charAt(0).toLowerCase()}${raw.headline.slice(1)}` : raw.headline;
  return raw.headline;
}

function applyNewsWithScale(stocks, news, scale) {
  return applyNews(stocks, { ...news, sectors: scaleSectors(news.sectors, scale) });
}

function scaleSectors(sectors, scale) {
  if (scale === 1) return sectors;
  const out = {};
  for (const [k, v] of Object.entries(sectors)) out[k] = v * scale;
  return out;
}

function pickEvent(rng) {
  const total = EVENT_KINDS.reduce((s, e) => s + e.weight, 0);
  let roll = rng() * total;
  for (const e of EVENT_KINDS) {
    roll -= e.weight;
    if (roll <= 0) return e;
  }
  return EVENT_KINDS[0];
}

function applySystemEvent(stocks, ev, rng, shockScale) {
  const sectorKeys = ["Banking", "IT", "Energy", "Auto", "FMCG", "Infra", "Pharma", "ConsumerTech"];
  const sector = sectorKeys[Math.floor(rng() * sectorKeys.length)];
  const dir = ev.kind === "Global Crisis" ? -1 : ev.kind === "Sector Boom" ? 1 : rng() > 0.5 ? 1 : -1;
  const magnitude = (1.2 + rng() * 1.6) * (dir < 0 ? -1 : 1) * shockScale;
  return stocks.map((s) => {
    const key = s.sector.replace(/\s+/g, "");
    if (key !== sector) return s;
    const moved = magnitude / 100;
    return {
      ...s,
      price: s.price * (1 + moved),
      momentum: s.momentum + dir * 0.8,
      sentiment: Math.round(Math.min(95, Math.max(5, s.sentiment + dir * 12))),
      flash: moved > 0 ? "up" : "down",
    };
  });
}
