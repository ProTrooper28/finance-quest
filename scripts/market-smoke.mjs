/* Headless smoke + fuzz test for the market simulator.
   Run: bun scripts/market-smoke.mjs
   Drives the REAL reducer (src/hooks/market-sim-core.js) — the same code the
   browser executes — so any mid-session crash (the "Something went wrong"
   error boundary) shows up here as a hard failure. */

import { initStocks, mulberry32, nextNews, applyNews, tickPrices, scenarioParams, styleParams, evaluateMissions, sessionReport, tradeFeedback, portfolioValue, riskScore } from "../src/utils/market-engine.js";
import { MISSIONS, EVENT_KINDS } from "../src/data/market.js";
import { reducer, createInitialState, START_CASH, advanceClock, initialClock } from "../src/hooks/market-sim-core.js";

let failures = 0;
const check = (name, cond) => {
  if (!cond) { failures += 1; console.log(`FAIL ${name}`); }
  else console.log(`ok   ${name}`);
};

/* 1. Engine basics */
const rng = mulberry32(42);
const stocks = initStocks(rng);
check("initStocks: 12 stocks with candles", stocks.length === 12 && stocks.every((s) => s.candles.length === 48 && s.price > 0));

const news = nextNews(rng, []);
check("nextNews: has uid/headline/impact/confidence", Boolean(news.uid && news.headline && news.impact && typeof news.confidence === "number"));

const shocked = applyNews(stocks, news);
check("applyNews: prices change", shocked.some((s, i) => Math.abs(s.price - stocks[i].price) > 0));

const t1 = tickPrices(stocks, rng, 0);
check("tickPrices: candles roll", t1.every((s) => s.candles.length === 48));

check("scenarioParams covers all scenarios", ["live","beginner","bull","bear","volatility","ipo","budget","rbi","earnings"].every((id) => typeof scenarioParams(id).driftAll === "number"));
check("styleParams covers all styles", ["day","swing","investor","learning"].every((id) => typeof styleParams(id).volatility === "number"));
check("EVENT_KINDS present in data layer", Array.isArray(EVENT_KINDS) && EVENT_KINDS.length >= 8);

/* 2. Missions + feedback */
const snap = { bankingHoldings: 3, sectors: 5, profitPct: 6, beatNifty: true, trades: 2, crashSurvived: true, earningsBuys: 1, lowRisk: true };
const { missions, justCompleted } = evaluateMissions(MISSIONS.map((m) => ({ ...m, progress: 0, done: false })), snap);
check("missions complete from snapshot", missions.every((m) => m.done) && justCompleted.length === MISSIONS.length);

const fb = tradeFeedback(stocks[0], "buy", 10, stocks[0].price * 10, { sentiment: 70, newsFor: [news], risk: 40, sectorsHeld: new Set(["IT"]), profitPct: 1 });
check("tradeFeedback: has all sections", fb.good.length > 0 && fb.risks.length >= 0 && fb.alternatives.length > 0 && fb.learningTips.length > 0);

/* 3. Session report with closed positions */
const closed = [
  { sym: "INFY", name: "Infosys", sector: "IT", qty: 5, avgPrice: 1500, exitPrice: 1600, gain: 500 },
  { sym: "ZOMATO", name: "Zomato", sector: "Consumer Tech", qty: 10, avgPrice: 300, exitPrice: 280, gain: -200 },
];
const rep = sessionReport({
  startValue: 1_000_000, stocks, holdings: [{ sym: "INFY", name: "Infosys", sector: "IT", qty: 5, avgPrice: 1500 }],
  cash: 900_000, missions, decisions: 3, mistakes: 1, startNifty: 24850, nifty: 25300,
  closedPositions: closed, realized: 300, achievements: [{ id: "first-trade", name: "First Trade", earned: true }],
  startCash: 400_000,
});
check("report: return computed", typeof rep.totalReturn === "number");
check("report: win rate 50%", rep.winRate === 50);
check("report: best/worst trades", rep.bestTrade?.sym === "INFY" && rep.worstTrade?.sym === "ZOMATO");
check("report: mission counts + achievements", rep.missionsTotal === MISSIONS.length && rep.achievementsUnlocked.includes("First Trade"));
check("report: feedback lines", rep.feedback.length > 0);

/* 4. Clock — every mode advances monotonically and never throws */
for (const mode of ["intraday", "weekly", "monthly", "longterm"]) {
  let clock = initialClock(mode);
  let lastSeen = clock.label;
  let ok = true;
  for (let t = 1; t <= 120; t++) {
    clock = advanceClock(clock, mode, t);
    if (!clock || typeof clock.label !== "string") { ok = false; break; }
    lastSeen = clock.label;
  }
  check(`clock ${mode}: advances 120 ticks`, ok);
}

/* 5. FUZZ — the real reducer: every scenario × style, 400 ticks with trades.
   This is the regression test for the mid-session "Something went wrong"
   crash (previously: EVENT_KINDS referenced without import). */
const SCENARIOS = ["live", "beginner", "bull", "bear", "volatility", "ipo", "budget", "rbi", "earnings"];
const STYLES = ["day", "swing", "investor", "learning"];
let fuzzFail = null;

outer:
for (const scenarioId of SCENARIOS) {
  for (const style of STYLES) {
    let state = reducer(createInitialState(), { type: "start", scenarioId, replayId: null, timeMode: "intraday", style });
    if (!state.running || state.cash !== START_CASH) { fuzzFail = `${scenarioId}/${style}: bad start state`; break outer; }
    try {
      for (let t = 1; t <= 400; t++) {
        state = reducer(state, { type: "tick" });
        /* Interleave trades, including invalid ones — the reducer must
           reject them harmlessly, never throw. */
        if (t % 7 === 0) {
          const s = state.stocks[(t / 7) % state.stocks.length | 0];
          state = reducer(state, { type: "trade", sym: s.sym, side: t % 14 === 0 ? "sell" : "buy", qty: 5 });
        }
        if (t % 11 === 0) state = reducer(state, { type: "trade", sym: "NOPE", side: "buy", qty: 1 });
        if (t % 13 === 0) state = reducer(state, { type: "trade", sym: state.stocks[0].sym, side: "sell", qty: 9999 });
        if (t % 17 === 0) state = reducer(state, { type: "highlight", uid: "missing" });
        if (Number.isNaN(state.nifty) || state.nifty <= 0) { fuzzFail = `${scenarioId}/${style}: nifty ${state.nifty} @tick ${t}`; break outer; }
        if (state.cash < -1) { fuzzFail = `${scenarioId}/${style}: negative cash @tick ${t}`; break outer; }
        if (!state.stocks.every((s) => Number.isFinite(s.price) && s.price > 0)) { fuzzFail = `${scenarioId}/${style}: bad price @tick ${t}`; break outer; }
        if (state.xp < 0 || Number.isNaN(state.xp)) { fuzzFail = `${scenarioId}/${style}: xp ${state.xp}`; break outer; }
      }
      /* Cash + holdings must always equal portfolio value */
      const { total } = portfolioValue(state.stocks, state.holdings, state.cash);
      if (Math.abs(total - (state.cash + state.holdings.reduce((a, h) => a + h.qty * (state.stocks.find((x) => x.sym === h.sym)?.price ?? h.avgPrice), 0))) > 1) {
        fuzzFail = `${scenarioId}/${style}: portfolio mismatch`; break outer;
      }
      /* End session must produce a full report */
      state = reducer(state, { type: "end" });
      if (!state.report || typeof state.report.totalReturn !== "number") { fuzzFail = `${scenarioId}/${style}: report missing`; break outer; }
      if (typeof state.report.winRate !== "number" || Number.isNaN(state.report.winRate)) { fuzzFail = `${scenarioId}/${style}: winRate ${state.report.winRate}`; break outer; }
    } catch (err) {
      fuzzFail = `${scenarioId}/${style}: THREW "${err.message}"`;
      break outer;
    }
  }
}
check(`fuzz: 9 scenarios × 4 styles × 400 ticks${fuzzFail ? ` — ${fuzzFail}` : " — no throws, no bad state"}`, !fuzzFail);

/* 6. Money conservation across a buy→sell round trip */
{
  let s0 = reducer(createInitialState(), { type: "start", scenarioId: "live", replayId: null, timeMode: "intraday", style: "day" });
  const sym = s0.stocks[0].sym;
  s0 = reducer(s0, { type: "trade", sym, side: "buy", qty: 10 });
  const afterBuy = s0.cash + s0.holdings.reduce((a, h) => a + h.qty * s0.stocks.find((x) => x.sym === h.sym).price, 0);
  check("buy: cash + holdings ≈ start capital", Math.abs(afterBuy - START_CASH) < 1);
  s0 = reducer(s0, { type: "trade", sym, side: "sell", qty: 10 });
  const afterSell = s0.cash + s0.holdings.reduce((a, h) => a + h.qty * s0.stocks.find((x) => x.sym === h.sym).price, 0);
  check("sell: round trip conserves money (±drift)", Math.abs(afterSell - START_CASH) < START_CASH * 0.02);
  check("sell: closed position recorded", (s0.closedPositions ?? []).length === 1 && typeof s0.realized === "number");
}

process.exit(failures ? 1 : 0);
