/* Pure market-simulation engine. The hook (use-market-sim.js) owns state and
   timing; everything here is deterministic given its inputs so the simulation
   is auditable and testable. */

import { UNIVERSE, NEWS_POOL, EVENT_KINDS } from "@/data/market";

/* -------------------------------- random --------------------------------- */

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------ initialization --------------------------- */

const CANDLES = 48;

/** Initialize stocks with a plausible price history and fresh per-stock state. */
export function initStocks(rng) {
  return UNIVERSE.map((def) => {
    const price = def.base * (0.96 + rng() * 0.08);
    const candles = [];
    let p = price;
    for (let i = 0; i < CANDLES; i++) {
      const open = p;
      const drift = (rng() - 0.48) * def.volatility * 0.004;
      const close = open * (1 + drift);
      candles.push({
        o: open,
        c: close,
        h: Math.max(open, close) * (1 + rng() * 0.002),
        l: Math.min(open, close) * (1 - rng() * 0.002),
      });
      p = close;
    }
    const last = candles[candles.length - 1].c;
    const dayOpen = candles[CANDLES - 6]?.o ?? price;
    return {
      ...def,
      price: last,
      prevClose: dayOpen,
      candles,
      momentum: 0,
      sentiment: 50,
      flash: null, // "up" | "down" | null — cleared by the UI after rendering
    };
  });
}

/* --------------------------------- news ---------------------------------- */

let newsSeq = 100;

/** Pick the next news item (not repeating the last 4) and stamp it. */
export function nextNews(rng, recentIds = []) {
  const recent = new Set(recentIds.slice(0, 4));
  const pool = NEWS_POOL.filter((n) => !recent.has(n.id));
  const item = pool[Math.floor(rng() * pool.length)] ?? NEWS_POOL[0];
  newsSeq += 1;
  const stamp = new Date();
  return {
    uid: `${item.id}-${newsSeq}`,
    ...item,
    time: stamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    atTick: Date.now(),
  };
}

/**
 * Apply a news item: sector drift, per-stock momentum, sentiment and flash
 * markers. Returns a new stocks array (pure).
 */
export function applyNews(stocks, news) {
  return stocks.map((s) => {
    const sectorKey = s.sector.replace(/\s+/g, "");
    let drift = news.sectors[sectorKey] ?? 0;
    const mentioned = news.tickers.includes(s.sym);
    if (mentioned) drift *= 1.4;
    const dir = news.impact === "bullish" ? 1 : news.impact === "bearish" ? -1 : 0;
    const moved = (drift / 100) * (0.8 + Math.random() * 0.4);
    const sentimentTarget = 50 + dir * (news.confidence / 4);
    return {
      ...s,
      price: s.price * (1 + moved),
      momentum: s.momentum * 0.7 + dir * (news.confidence / 100) * 1.2,
      sentiment: Math.round(Math.min(95, Math.max(5, s.sentiment * 0.6 + sentimentTarget * 0.4))),
      flash: moved > 0.001 ? "up" : moved < -0.001 ? "down" : s.flash,
    };
  });
}

/** One 2.5s market tick: mean-reverting random walk + momentum decay. */
export function tickPrices(stocks, rng, driftAll = 0) {
  return stocks.map((s) => {
    const shock = (rng() - 0.5) * 0.003 * s.volatility;
    const mom = s.momentum * 0.0045;
    const moved = shock + mom + driftAll / 100;
    const candles = s.candles.slice(1);
    const last = candles[candles.length - 1];
    const open = last.c;
    const close = open * (1 + moved);
    candles.push({
      o: open,
      c: close,
      h: Math.max(open, close) * (1 + rng() * 0.0015),
      l: Math.min(open, close) * (1 - rng() * 0.0015),
    });
    return {
      ...s,
      price: close,
      momentum: s.momentum * 0.96,
      candles,
      flash: moved > 0.0006 ? "up" : moved < -0.0006 ? "down" : null,
    };
  });
}

/** Sentiment decay between news events. */
export function decaySentiment(stocks) {
  return stocks.map((s) => ({ ...s, sentiment: Math.round(s.sentiment + (50 - s.sentiment) * 0.08) }));
}

/* ------------------------------ portfolio math --------------------------- */

export function portfolioValue(stocks, holdings, cash) {
  let invested = 0;
  for (const h of holdings) {
    const s = stocks.find((x) => x.sym === h.sym);
    invested += (s?.price ?? h.avgPrice) * h.qty;
  }
  return { invested, total: invested + cash };
}

export function countSectors(holdings) {
  return new Set(holdings.map((h) => h.sector)).size;
}

/** Portfolio risk 0–100: position concentration + stock risk + turnover. */
export function riskScore(stocks, holdings, totalValue, cash) {
  if (!holdings.length || totalValue <= 0) return 20;
  let exposure = 0;
  for (const h of holdings) {
    const s = stocks.find((x) => x.sym === h.sym);
    const w = ((s?.price ?? h.avgPrice) * h.qty) / totalValue;
    exposure += w * (s?.risk ?? 40) * (1 + Math.abs(h.qty * h.avgPrice) / 5e6);
  }
  const concentration = 1 - (cash / totalValue || 0);
  const herfindahl = holdings.reduce((acc, h) => {
    const s = stocks.find((x) => x.sym === h.sym);
    const w = ((s?.price ?? h.qty * h.avgPrice) * h.qty) / totalValue;
    return acc + w * w;
  }, 0);
  return Math.round(Math.min(100, exposure * concentration * 0.9 + herfindahl * 40 + 8));
}

export function diversificationScore(holdings, totalValue, stocks) {
  if (!holdings.length || totalValue <= 0) return 0;
  const herfindahl = holdings.reduce((acc, h) => {
    const s = stocks.find((x) => x.sym === h.sym);
    const w = ((s?.price ?? h.avgPrice) * h.qty) / totalValue;
    return acc + w * w;
  }, 0);
  return Math.round(Math.min(100, (1 - herfindahl) * 70 + countSectors(holdings) * 7));
}

/* ------------------------------- scenarios ------------------------------- */

const SCENARIO_DRIFT = { live: 0, beginner: -0.1, bull: 0.35, bear: -0.35, volatility: 0, ipo: 0.15, budget: 0, rbi: 0, earnings: 0.05 };
const SCENARIO_SHOCKS = { live: 1, beginner: 0.55, bull: 0.8, bear: 1.1, volatility: 2.1, ipo: 1.2, budget: 1.6, rbi: 1.4, earnings: 1.1 };
const SCENARIO_NEWS_EVERY = { live: 5, beginner: 7, bull: 6, bear: 6, volatility: 4, ipo: 5, budget: 3, rbi: 3, earnings: 4 };

export function scenarioParams(id) {
  return {
    driftAll: SCENARIO_DRIFT[id] ?? 0,
    shockScale: SCENARIO_SHOCKS[id] ?? 1,
    newsEvery: SCENARIO_NEWS_EVERY[id] ?? 5,
  };
}

/* ------------------------------- missions -------------------------------- */

/**
 * Evaluate missions against the current snapshot. `done` missions lock.
 * Returns { missions, justCompleted } — new array + ids completed this call.
 */
export function evaluateMissions(missions, snapshot) {
  const justCompleted = [];
  const next = missions.map((m) => {
    if (m.done) return m;
    let progress = 0;
    switch (m.metric) {
      case "sector:Banking": progress = snapshot.bankingHoldings; break;
      case "sectors": progress = snapshot.sectors; break;
      case "profitPct": progress = Math.max(0, snapshot.profitPct); break;
      case "beatNifty": progress = snapshot.beatNifty ? 1 : 0; break;
      case "trades": progress = Math.min(snapshot.trades, 1); break;
      default: progress = 0;
    }
    const value = Math.min(progress, m.target);
    const done = value >= m.target;
    if (done) justCompleted.push(m.id);
    return { ...m, progress: value, done };
  });
  return { missions: next, justCompleted };
}

/* ----------------------------- AI trade coach ---------------------------- */

/** Post-trade AI mentor feedback — rule-based analysis of the decision. */
export function tradeFeedback(stock, side, qty, cost, ctx) {
  const { sentiment, newsFor, risk, sectorsHeld } = ctx;
  const good = [];
  const risks = [];
  const alternatives = [];
  const learningTips = [];

  if (side === "buy") {
    if (sentiment >= 62) good.push(`You bought ${stock.name} while news sentiment is positive (${sentiment}%). Trading with the flow is a sound default for new investors.`);
    else if (sentiment <= 40) good.push(`You bought ${stock.name} while sentiment is weak (${sentiment}%) — that's a contrarian position. It can pay off, but you're catching a falling knife unless the story changes.`);
    else good.push(`You bought ${stock.name} in neutral conditions (${sentiment}%) — a reasonable, low-conviction entry.`);
    if (newsFor?.length) good.push(`It follows recent news: “${newsFor[0].headline}” — anchoring a trade to a concrete catalyst is strong reasoning.`);
    else risks.push(`No fresh news supports this entry. You're trading on price action alone, which is closer to speculation than analysis.`);
    if (risk > 65) risks.push(`${stock.name} carries a risk score of ${stock.risk}/100 and your portfolio risk is ${risk}. A single bad event here will hurt.`);
    if (sectorsHeld.has(stock.sector) && !risks.length) risks.push(`You're adding to your ${stock.sector} exposure — watch concentration risk if it grows further.`);
    alternatives.push(sectorsHeld.size < 3 ? `An alternative: spread the same amount across 2–3 sectors to dampen single-stock shocks.` : `Consider splitting the entry into two tranches — averaging in reduces timing risk.`);
    learningTips.push("What are quarterly earnings?", "How does news actually move prices?");
  } else if (side === "sell") {
    good.push(`You sold ${stock.name} — locking in the position's outcome turns paper P/L into real (simulated) P/L.`);
    if (newsFor?.length && newsFor[0].impact === "bearish") good.push(`Selling into negative news (“${newsFor[0].headline}”) is disciplined risk management.`);
    if (ctx.profitPct >= 2) good.push(`Your portfolio is up ${ctx.profitPct.toFixed(1)}% — booking gains periodically keeps returns from round-tripping.`);
    risks.push(`If the thesis hasn't changed, selling early can cap long-term compounding. Watch the trend before your next exit.`);
    alternatives.push(`A common alternative is a partial exit — sell half, let the rest run.`);
    learningTips.push("What is profit booking?", "When should you actually sell?");
  } else {
    good.push(`Holding is a decision too — you're avoiding an impulsive trade, which is exactly how professionals behave most days.`);
    if (Math.abs(ctx.profitPct) > 3) risks.push(`The market is moving fast (${ctx.profitPct > 0 ? "+" : ""}${ctx.profitPct.toFixed(1)}%). Inaction has a cost when volatility spikes.`);
    alternatives.push(`Set a mental stop: decide now the price at which you'd act, instead of watching passively.`);
    learningTips.push("What is a stop-loss?", "Why do professionals trade less than beginners?");
  }

  return { good, risks, alternatives, learningTips, verdict: good.length && !risks.length ? "Strong decision" : "Decent decision" };
}

/* ------------------------------ session report --------------------------- */

/** Build the end-of-session report card. */
export function sessionReport({ startValue, stocks, holdings, cash, missions, decisions, mistakes, startNifty, nifty }) {
  const { total } = portfolioValue(stocks, holdings, cash);
  const retPct = ((total - startValue) / startValue) * 100;
  const niftyRet = ((nifty - startNifty) / startNifty) * 100;
  const risk = riskScore(stocks, holdings, total, cash);
  const div = diversificationScore(holdings, total, stocks);
  const totalXp = missions.filter((m) => m.done).reduce((s, m) => s + m.xp, 0);
  const totalCoins = missions.filter((m) => m.done).reduce((s, m) => s + m.coins, 0);

  const feedback = [];
  if (retPct > niftyRet) feedback.push(`You beat the NIFTY (${retPct.toFixed(1)}% vs ${niftyRet.toFixed(1)}%). Overconfidence is the risk now — size positions carefully.`);
  else feedback.push(`You finished behind the NIFTY (${retPct.toFixed(1)}% vs ${niftyRet.toFixed(1)}%). Index returns are the bar every active investor must clear.`);
  if (div < 40) feedback.push("Your allocation was concentrated — a few names dominated the outcome. Diversification smooths the ride.");
  if (risk > 65) feedback.push("Risk ran high through the session. Holding some cash is a position, not a failure.");
  if (decisions && mistakes !== undefined) feedback.push(`You made ${decisions} decisive calls and ${mistakes} clear mistakes — reviewing the debriefs is where the learning compounds.`);

  return {
    totalReturn: retPct,
    niftyReturn: niftyRet,
    xp: totalXp,
    coins: totalCoins,
    decisions: decisions ?? 0,
    mistakes: mistakes ?? 0,
    risk,
    diversification: div,
    feedback,
    next: retPct > 0 ? "Bear Market — can you stay green when everything falls?" : "Bull Market — start with a win, then stress-test it.",
  };
}
