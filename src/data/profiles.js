/**
 * Financial profiles generated from assessment answers.
 * The scoring engine in utils/assessment.js picks one of these.
 */

export const profiles = {
  "beginner-explorer": {
    id: "beginner-explorer",
    emoji: "🟢",
    title: "Beginner Explorer",
    headline: "You're at the start of the curve — and that's the best place to be.",
    summary:
      "Your answers show limited exposure to investing and payments, with strong intent to learn. The roadmap below builds the fundamentals first, so every later decision has a solid floor under it.",
    minScore: 0,
    strengths: ["Willingness to learn", "Clear goals", "Fresh start, no bad habits"],
    weakAreas: ["Investment basics", "Scam identification", "Expense tracking"],
    learningStyleKey: "short-lessons",
  },
  "smart-saver": {
    id: "smart-saver",
    emoji: "🟡",
    title: "Smart Saver",
    headline: "You already save consistently — now make the money work.",
    summary:
      "You track money carefully and avoid most traps, but idle savings lose to inflation. The roadmap below shows you where to move money next — and how to protect it first.",
    minScore: 34,
    strengths: ["Consistent saving habit", "Budget discipline", "Healthy scam caution"],
    weakAreas: ["Investment products", "Compound growth maths", "Credit basics"],
    learningStyleKey: "guided-sims",
  },
  "future-investor": {
    id: "future-investor",
    emoji: "🔵",
    title: "Future Investor",
    headline: "You know the basics — you're ready to put capital to work.",
    summary:
      "You've used modern payment rails and probably made a first investment. The gap is depth: asset allocation, risk sizing and reading market noise. The roadmap focuses there.",
    minScore: 52,
    strengths: ["Payment fluency", "First investments made", "Comfort with numbers"],
    weakAreas: ["Risk management", "Market volatility", "Portfolio balance"],
    learningStyleKey: "market-sims",
  },
  "financial-strategist": {
    id: "financial-strategist",
    emoji: "🟣",
    title: "Financial Strategist",
    headline: "Strong fundamentals — time to sharpen the edge cases.",
    summary:
      "You invest, track and can spot most scams. The roadmap now works the advanced layer: tax-aware choices, insurance gaps and portfolio stress-testing in the market simulator.",
    minScore: 70,
    strengths: ["Advanced knowledge", "Active investor", "Strong fraud radar"],
    weakAreas: ["Tax optimization", "Insurance gaps", "Portfolio stress-testing"],
    learningStyleKey: "advanced-labs",
  },
};

/* Ordered for lookup helpers. */
export const profileList = Object.values(profiles);
