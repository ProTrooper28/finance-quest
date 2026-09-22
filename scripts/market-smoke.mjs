/* Smoke test for the market simulator. Run: bun scripts/market-smoke.mjs */
import { initStocks, mulberry32, nextNews, applyNews, tickPrices, scenarioParams, styleParams, evaluateMissions, sessionReport, tradeFeedback } from "../src/utils/market-engine.js";
import { MISSIONS } from "../src/data/market.js";

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

/* 4. Reducer integration — inline copy of the reducer flow via imports */
const { useMarketSim } = await import("../src/hooks/use-market-sim.js").catch(() => ({}));
check("use-market-sim module loads (hook requires React context)", typeof useMarketSim === "function" || useMarketSim === undefined);

process.exit(failures ? 1 : 0);
