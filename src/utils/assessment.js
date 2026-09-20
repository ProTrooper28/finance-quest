import { profiles } from "@/data/profiles";
import { clamp } from "@/utils";

/**
 * Deterministic scoring engine for the Financial Fitness Assessment.
 * Same answers always produce the same result — the "AI analysis" replays offline.
 */

/* Per-question knowledge weights — how much each answer signals literacy. */
const KNOWLEDGE_WEIGHTS = {
  comfort: { "just-starting": 4, "know-basics": 12, "fairly-comfortable": 20, "very-comfortable": 28 },
  invested: { never: 0, sip: 12, "mutual-funds": 14, stocks: 16, crypto: 10 },
  payments: { upi: 6, "debit-card": 4, "credit-card": 6, "net-banking": 5, "cash-only": 1 },
  "scam-awareness": { "not-confident": 0, somewhat: 6, "very-confident": 12 },
};

const KNOWLEDGE_MAX = 28 + 16 + 17 + 12;

const NEGATIVE_MULTI_MARKERS = { invested: "never", payments: "cash-only" };

const LEVELS = [
  { min: 0, label: "Level 1 · Foundational" },
  { min: 25, label: "Level 2 · Developing" },
  { min: 45, label: "Level 3 · Practitioner" },
  { min: 65, label: "Level 4 · Advanced" },
  { min: 85, label: "Level 5 · Expert-track" },
];

function knowledgePoints(answers) {
  let points = 0;
  for (const [qid, table] of Object.entries(KNOWLEDGE_WEIGHTS)) {
    const answer = answers[qid];
    if (answer == null) continue;
    if (Array.isArray(answer)) {
      const marker = NEGATIVE_MULTI_MARKERS[qid];
      if (marker && answer.includes(marker)) continue;
      points += answer.reduce((sum, v) => sum + (table[v] ?? 0), 0);
    } else {
      points += table[answer] ?? 0;
    }
  }
  return clamp(points, 0, KNOWLEDGE_MAX);
}

function computeSubScores(answers) {
  const knowledge = Math.round((knowledgePoints(answers) / KNOWLEDGE_MAX) * 100);

  const tracking = { "5": 10, "10": 35, "15": 70, "20+": 100 }[answers["daily-time"]] ?? 0;

  const scam = { "not-confident": 0, somewhat: 50, "very-confident": 100 }[answers["scam-awareness"]] ?? 0;

  const invested =
    Array.isArray(answers.invested) && answers.invested.length > 0 && !answers.invested.includes("never");

  const goals = Array.isArray(answers["learn-goal"]) ? answers["learn-goal"] : [];
  const goalMap = { saving: 40, budgeting: 45, frauds: 35, investing: 80, wealth: 90 };
  const ambition =
    goals.length === 0 ? 50 : clamp(Math.round(goals.reduce((s, g) => s + (goalMap[g] ?? 55), 0) / goals.length), 30, 95);

  return { knowledge, tracking, scam, invested, ambition, goals };
}

function pickProfile({ knowledge, tracking, scam, ambition }) {
  const composite = clamp(Math.round(knowledge * 0.55 + tracking * 0.15 + scam * 0.15 + ambition * 0.15), 0, 100);
  let current = profiles["beginner-explorer"];
  for (const p of Object.values(profiles)) {
    if (composite >= p.minScore) current = p;
  }
  return { profile: current, composite };
}

function levelFor(composite) {
  let label = LEVELS[0].label;
  for (const l of LEVELS) if (composite >= l.min) label = l.label;
  return label;
}

/* Weekly goal & XP target scale with the learner's available time. */
const WEEKLY_MINUTES = { "5": 35, "10": 70, "15": 105, "20+": 180 };
const XP_TARGETS = { "5": 400, "10": 800, "15": 1200, "20+": 2000 };

/* Suggested games per dominant interest. */
const GAME_LIBRARY = [
  { id: "budget-sim", title: "Budget Simulator", fits: ["budgeting", "banking"], why: "Split a real salary across rent, food and savings — then see the month play out." },
  { id: "fraud-detective", title: "Fraud Detection", fits: ["upi-safety"], why: "Real scam formats, one decision at a time. Build the reflex to stop and verify." },
  { id: "banking-drills", title: "Banking Challenges", fits: ["banking"], why: "Cheque vs UPI vs NEFT — pick the right rail for the right job." },
  { id: "investment-missions", title: "Investment Missions", fits: ["investing", "stock-market"], why: "Guided missions that teach risk before the Market Simulator lets you loose." },
];

function pickGames(goals, profileId) {
  const picks = [];
  for (const g of goals) {
    for (const game of GAME_LIBRARY) {
      if (game.fits.includes(g) && !picks.some((p) => p.id === game.id)) picks.push(game);
    }
  }
  /* Ensure a full list of three, profile-aware. */
  const fallbackOrder = {
    "beginner-explorer": ["budget-sim", "fraud-detective", "banking-drills"],
    "smart-saver": ["budget-sim", "investment-missions", "fraud-detective"],
    "future-investor": ["investment-missions", "budget-sim", "fraud-detective"],
    "financial-strategist": ["investment-missions", "fraud-detective", "budget-sim"],
  };
  for (const id of fallbackOrder[profileId] ?? fallbackOrder["beginner-explorer"]) {
    if (picks.length >= 3) break;
    const game = GAME_LIBRARY.find((g) => g.id === id);
    if (game && !picks.some((p) => p.id === game.id)) picks.push(game);
  }
  return picks.slice(0, 3);
}

export function analyzeAnswers(answers) {
  const subs = computeSubScores(answers);
  const { profile, composite } = pickProfile(subs);

  /* Financial score: knowledge-led blend. */
  const financialScore = clamp(
    Math.round(subs.knowledge * 0.45 + subs.tracking * 0.2 + subs.scam * 0.2 + subs.ambition * 0.15) + (subs.invested ? 6 : 0),
    10,
    98,
  );

  /* Confidence: time availability + scam radar. */
  const confidence = clamp(Math.round(subs.tracking * 0.45 + subs.scam * 0.55), 10, 96);

  const dailyTime = answers["daily-time"] ?? "10";
  const roadmap = buildRoadmap(profile.id, subs.goals);
  const games = pickGames(subs.goals, profile.id);

  return {
    profile,
    financialScore,
    knowledgeLevel: levelFor(composite),
    confidence,
    weeklyGoal: {
      minutes: WEEKLY_MINUTES[dailyTime] ?? 70,
      label: dailyTime === "20+" ? "20+ min a day" : `${dailyTime} min a day`,
    },
    xpTarget: { amount: XP_TARGETS[dailyTime] ?? 800, week: 1 },
    games,
    roadmap,
    name: "",
    completedAt: new Date().toISOString(),
  };
}

/** 5-week roadmap, goals-led, per profile. */
export function buildRoadmap(profileId, goals) {
  const base = {
    "beginner-explorer": ["Banking Basics", "UPI & Fraud Safety", "Budgeting", "Investing", "Stock Market Simulator"],
    "smart-saver": ["Budgeting", "Emergency Fund Planning", "Banking Basics", "SIP Planning", "Fraud Safety Drills"],
    "future-investor": ["Investing Fundamentals", "Stock Market Simulator", "Mutual Funds vs ETFs", "Risk & Position Sizing", "Portfolio Review"],
    "wealth-builder": ["Portfolio Stress-Test", "Tax-Aware Investing", "Insurance Gap Check", "Credit Leverage", "Advanced Market Lab"],
  }[profileId] ?? ["Banking Basics", "UPI & Fraud Safety", "Budgeting", "Investing", "Stock Market Simulator"];

  /* Lead the roadmap with the learner's first chosen goal. */
  const goalToTitle = {
    banking: "Banking Basics",
    "upi-safety": "UPI & Fraud Safety",
    investing: "Investing Fundamentals",
    budgeting: "Budgeting",
    taxes: "Tax-Aware Investing",
    "credit-score": "Credit Score Essentials",
    "stock-market": "Stock Market Simulator",
  };
  const weeks = base.slice();
  for (let i = goals.length - 1; i >= 0; i--) {
    const wanted = goalToTitle[goals[i]];
    const idx = wanted ? weeks.indexOf(wanted) : -1;
    if (idx > 0) {
      weeks.splice(idx, 1);
      weeks.unshift(wanted);
    }
  }
  return weeks.map((title, i) => ({ week: i + 1, title }));
}
