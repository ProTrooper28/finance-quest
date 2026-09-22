/* React-free core of the market simulator: initial state + reducer.
   Kept separate from use-market-sim.js so the exact code that runs in the
   browser can be fuzz-tested headlessly (scripts/market-smoke.mjs).

   The reducer must stay fully self-contained: every value it needs is either
   in `state` or imported at module scope. Nothing may close over hook-local
   variables — that was the source of the mid-session crashes. */

import { MISSIONS, ACHIEVEMENTS, EVENT_KINDS } from "@/data/market";
import {
  initStocks, mulberry32, nextNews, applyNews, tickPrices, decaySentiment,
  portfolioValue, riskScore, countSectors, scenarioParams,
  evaluateMissions, tradeFeedback, sessionReport, styleParams,
} from "@/utils/market-engine";

export const START_CASH = 1_000_000;
export const TICK_MS = 2500;
const MAX_NEWS = 14;

const initialMissions = MISSIONS.map((m) => ({ ...m, progress: 0, done: false }));

/* --------------------------- simulated clock ------------------------------ */

const INTRADAY_STEPS = ["09:15", "09:45", "10:00", "10:45", "11:30", "12:15", "01:00", "01:45", "02:30", "03:15", "03:30"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function initialClock(mode) {
  if (mode === "longterm") return { kind: "month", label: MONTHS[0], index: 0 };
  if (mode === "monthly") return { kind: "week", label: "Week 1", index: 0 };
  if (mode === "weekly") return { kind: "day", label: "Mon", index: 0 };
  return { kind: "time", label: INTRADAY_STEPS[0], index: 0 };
}

/** Advance the simulated clock by one tick. Returns the same object when the
    clock has not moved this tick (e.g. months advance every 10 ticks). */
export function advanceClock(clock, mode, tickCount) {
  if (mode === "longterm") {
    if (tickCount % 10 !== 0) return clock;
    const idx = Math.min(clock.index + 1, 11);
    return { ...clock, index: idx, label: MONTHS[idx] };
  }
  if (mode === "monthly") {
    if (tickCount % 8 !== 0) return clock;
    const idx = Math.min(clock.index + 1, 3);
    return { ...clock, index: idx, label: `Week ${idx + 1}` };
  }
  if (mode === "weekly") {
    if (tickCount % 6 !== 0) return clock;
    const idx = Math.min(clock.index + 1, 4);
    return { ...clock, index: idx, label: DAYS[idx] };
  }
  /* intraday: one step every 2 ticks */
  const idx = Math.min(Math.floor(tickCount / 2), INTRADAY_STEPS.length - 1);
  return { ...clock, index: idx, label: INTRADAY_STEPS[idx] };
}

/* --------------------------------- state ---------------------------------- */

export function createInitialState() {
  const seed = (BASE_SEED ^ Date.now() ^ Math.floor(Math.random() * 0xffffff)) >>> 0;
  return {
    seed,
    stocks: initStocks(mulberry32(seed)),
    cash: START_CASH,
    holdings: [],
    news: [],
    recentNewsIds: [],
    highlighted: null, // news uid → highlight affected stocks
    highlightSyms: null,
    selected: null, // stock symbol for the trade panel
    scenarios: { activeId: "live", replay: null },
    timeMode: "intraday",
    style: "swing",
    clock: initialClock("intraday"),
    closedPositions: [],
    tradeLog: [],
    crashTicks: 0,
    earningsBuys: 0,
    realized: 0,
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
  };
}

const BASE_SEED = 20260922;

/* --------------------------------- reducer -------------------------------- */

export function reducer(state, action) {
  switch (action.type) {
    case "start":
      return startSession(state, action);

    case "tick":
      return tick(state);

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

    case "trade":
      return trade(state, action);

    case "end":
      return endSession(state);

    case "clearFeedback":
      return { ...state, feedback: null };

    case "clearReport":
      return { ...state, report: null };

    default:
      return state;
  }
}

/* ------------------------------- case handlers ---------------------------- */

function startSession(state, action) {
  const scenarioId = action.scenarioId ?? "live";
  const replay = action.replayId ?? null;
  const seed = freshSeed();
  const rng = mulberry32(seed);
  const stocks = initStocks(rng);
  const first = nextNews(rng, []);
  const timeMode = action.timeMode ?? "intraday";
  return {
    ...state,
    seed,
    stocks,
    scenarios: { activeId: scenarioId, replay },
    timeMode,
    style: action.style ?? "swing",
    clock: initialClock(timeMode),
    closedPositions: [],
    tradeLog: [],
    crashTicks: 0,
    earningsBuys: 0,
    realized: 0,
    cash: START_CASH,
    holdings: [],
    news: [first],
    recentNewsIds: [first.id],
    missions: initialMissions,
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
    toasts: [{ id: `start-${seed}`, kind: "session", text: replay ? `Historical replay started — ${replay}` : `${scenarioId} market started`, tick: 0 }],
  };
}

function tick(state) {
  if (!state.running) return state;

  const { driftAll, shockScale, newsEvery } = scenarioParams(state.scenarios.activeId);
  const style = styleParams(state.style);
  const rng = mulberry32((state.seed + state.tickCount * 7919) >>> 0);
  let stocks = tickPrices(state.stocks, rng, driftAll * style.volatility);
  const tickCount = state.tickCount + 1;

  let news = state.news;
  let recentNewsIds = state.recentNewsIds;
  let toasts = state.toasts;
  let crashTicks = state.crashTicks ?? 0;
  let xp = state.xp;
  let coins = state.coins;

  /* News lands on a cadence scaled by the investment style */
  const newsCadence = Math.max(2, Math.round(newsEvery / style.newsRate));
  if (tickCount % newsCadence === 0) {
    const raw = nextNews(rng, recentNewsIds);
    const item = { ...raw, headline: scaleHeadline(raw, state.scenarios.activeId) };
    stocks = applyNews(stocks, { ...item, sectors: scaleSectors(item.sectors, shockScale) });
    news = [item, ...news].slice(0, MAX_NEWS);
    recentNewsIds = [item.id, ...recentNewsIds].slice(0, 4);
    toasts = [...toasts, { id: item.uid, kind: "news", text: item.headline, tick: tickCount }].slice(-3);
  }

  /* System events on a slower cadence — this is where the old code crashed
     (EVENT_KINDS was never imported into the hook module). */
  if (tickCount % 14 === 0) {
    const ev = pickEvent(rng);
    stocks = applySystemEvent(stocks, ev, rng, shockScale);
    if (ev.kind === "Global Crisis") crashTicks += 1;
    toasts = [...toasts, { id: `ev-${tickCount}`, kind: "event", text: `${ev.kind} — market reacting`, tick: tickCount }].slice(-3);
  }

  /* NIFTY tracks the broad market */
  const avg = stocks.reduce((s, x) => s + x.price / x.base, 0) / stocks.length;
  const nifty = Math.round(24850 * avg);
  stocks = decaySentiment(stocks);

  /* Simulated clock advances */
  const clock = advanceClock(state.clock, state.timeMode, tickCount);

  /* Missions evaluate against the fresh snapshot every tick */
  const snapshot = makeSnapshot(stocks, state.holdings, state.cash, nifty, state.startNifty, state.trades, state);
  const { missions, justCompleted } = evaluateMissions(state.missions, snapshot);
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

  return { ...state, stocks, news, recentNewsIds, toasts: liveToasts, tickCount, nifty, missions, xp, coins, clock, crashTicks };
}

function trade(state, action) {
  const s = state.stocks.find((x) => x.sym === action.sym);
  if (!s) return state;
  const qty = Math.max(1, Math.floor(action.qty));
  const side = action.side;
  const cost = s.price * qty;

  if (side === "buy" && cost > state.cash) return state; // guarded in UI too

  let cash = state.cash;
  let holdings = state.holdings;
  let mistakes = state.mistakes;
  let newsTrades = state.newsTrades;
  let decisions = state.decisions;
  let earningsBuys = state.earningsBuys ?? 0;
  let tradeLog = state.tradeLog ?? [];
  let closedPositions = state.closedPositions ?? [];
  let realized = state.realized ?? 0;

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
    if ((state.news ?? []).some((n) => n.cat === "Earnings" && n.impact === "bullish" && n.tickers.includes(s.sym))) {
      earningsBuys += 1;
    }
  } else if (side === "sell") {
    const existing = holdings.find((h) => h.sym === s.sym);
    if (!existing || existing.qty < qty) return state; // cannot sell what you don't hold
    const proceeds = s.price * qty;
    const gain = (s.price - existing.avgPrice) * qty;
    if (gain < 0) mistakes += 1;
    cash += proceeds;
    realized += gain;
    closedPositions = [
      { sym: s.sym, name: s.name, sector: s.sector, qty, avgPrice: existing.avgPrice, exitPrice: s.price, gain, at: state.clock?.label ?? "—" },
      ...closedPositions,
    ];
    holdings = holdings
      .map((h) => (h.sym === s.sym ? { ...h, qty: h.qty - qty } : h))
      .filter((h) => h.qty > 0);
    decisions += 1;
  } else {
    /* HOLD — still a decision the AI mentor evaluates */
    decisions += 1;
  }

  tradeLog = [{ sym: s.sym, side, qty, price: s.price, cost, at: state.clock?.label ?? "now", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }, ...tradeLog].slice(0, 30);

  const trades = state.trades + 1;
  if (side !== "hold") newsTrades = state.newsTrades + (s.sentiment >= 62 || s.sentiment <= 40 ? 1 : 0);
  if (side === "buy" && s.risk > 60) mistakes += 1;

  const { total } = portfolioValue(state.stocks, holdings, cash);
  const profitPct = ((total - state.startValue) / state.startValue) * 100;
  const risk = riskScore(state.stocks, holdings, total, cash);
  const sectorsHeld = new Set(holdings.map((h) => h.sector));

  /* Achievements unlock from real behaviour */
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
  if (holdings.length === 0 && side === "sell") unlock("market-expert");

  /* Missions can also complete on a trade */
  const earningsState = { ...state, earningsBuys };
  const snapshot = makeSnapshot(state.stocks, holdings, cash, state.nifty, state.startNifty, trades, earningsState);
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
    earningsBuys: earningsState.earningsBuys,
    tradeLog,
    closedPositions,
    realized,
    feedback: { side, sym: s.sym, name: s.name, qty, cost, at: Date.now(), ...feedback },
  };
}

function endSession(state) {
  const startCash = state.startValue;
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
    closedPositions: state.closedPositions ?? [],
    realized: state.realized ?? 0,
    achievements: state.achievements,
    startCash,
  });
  return { ...state, running: false, marketOpen: false, report };
}

/* -------------------------------- helpers --------------------------------- */

function freshSeed() {
  return (BASE_SEED + Date.now() + Math.floor(Math.random() * 1e6)) >>> 0;
}

function makeSnapshot(stocks, holdings, cash, nifty, startNifty, trades, state) {
  const { invested, total } = portfolioValue(stocks, holdings, cash);
  const startValue = state.startValue ?? START_CASH;
  const profitPct = ((total - startValue) / startValue) * 100;
  const risk = riskScore(stocks, holdings, total, cash);
  return {
    invested,
    total,
    profitPct,
    cash,
    bankingHoldings: holdings.filter((h) => h.sector === "Banking").length,
    sectors: countSectors(holdings),
    beatNifty: profitPct > niftyDeltaPct(startNifty, nifty),
    trades,
    crashSurvived: (state?.crashTicks ?? 0) > 0 && profitPct > -12,
    earningsBuys: state?.earningsBuys ?? 0,
    lowRisk: holdings.length >= 2 && risk < 45,
  };
}

function niftyDeltaPct(startNifty, nifty) {
  return ((nifty - startNifty) / startNifty) * 100;
}

function scaleHeadline(raw, scenarioId) {
  if (scenarioId === "bear") return raw.impact === "bullish" ? raw.headline : `Selling deepens — ${raw.headline.charAt(0).toLowerCase()}${raw.headline.slice(1)}`;
  if (scenarioId === "bull") return raw.impact === "bearish" ? `Dip bought aggressively — ${raw.headline.charAt(0).toLowerCase()}${raw.headline.slice(1)}` : raw.headline;
  return raw.headline;
}

function scaleSectors(sectors, scale) {
  if (scale === 1 || !sectors) return sectors;
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
  const sectorKeys = ["Banking", "IT", "Energy", "Auto", "FMCG", "Infra", "Pharma", "Consumer Tech"];
  const sector = sectorKeys[Math.floor(rng() * sectorKeys.length)];
  const dir = ev.kind === "Global Crisis" ? -1 : ev.kind === "Sector Boom" ? 1 : rng() > 0.5 ? 1 : -1;
  const magnitude = (1.2 + rng() * 1.6) * (dir < 0 ? -1 : 1) * shockScale;
  return stocks.map((s) => {
    if (s.sector !== sector) return s;
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
