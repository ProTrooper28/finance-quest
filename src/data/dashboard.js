/* Content model for the gamified dashboard. Icon names resolve through
   dataIcon() in src/data/app.js. Values are placeholders until the backend
   lands — shapes match what the real API will return. */

export const hero = {
  firstName: "Taran",
  greeting: "Good evening",
  levelName: "Financial Explorer",
  level: 5,
  xp: 1260,
  xpForLevel: 2000,
  xpToNext: 420,
  streak: 8,
  coins: 480,
  completion: 62,
};

export const mission = {
  tag: "Today's mission",
  title: "Protect yourself from a fake UPI scam",
  body: "A collect request just landed claiming you're owed ₹2,499. Make the right call before the timer runs out — the same script scammers used 4,000 times last week.",
  xp: 150,
  coins: 50,
  difficulty: "Easy",
  difficultyStars: 1,
  minutes: 5,
  cta: "Start Mission",
  to: "/fraud-lab",
};

/* Vertical journey, rendered as a glowing vertical trail. */
export const journey = [
  { id: "banking", label: "Banking Basics", state: "done", xp: 120 },
  { id: "upi", label: "UPI Payments", state: "done", xp: 130 },
  { id: "budgeting", label: "Budgeting", state: "done", xp: 140 },
  { id: "fraud", label: "Fraud Protection", state: "current", xp: 150 },
  { id: "investing", label: "Investing", state: "locked", xp: 180 },
  { id: "market", label: "Stock Market", state: "locked", xp: 200 },
  { id: "wealth", label: "Wealth Building", state: "locked", xp: 250 },
];

/* Game-level module cards. */
export const continueLevels = [
  {
    id: "fraud-detection",
    icon: "ShieldCheck",
    title: "Fraud Detection",
    level: "Level 4 · Module 3",
    progress: 68,
    reward: "+250 XP",
    minutes: 12,
    to: "/fraud-lab",
  },
  {
    id: "market-challenge",
    icon: "CandlestickChart",
    title: "Stock Market Challenge",
    locked: true,
    lockedLabel: "Locked until Level 6",
    preview: "Learn how markets react to breaking news.",
    reward: "500 XP",
    to: "/market",
  },
];

export const quickPlay = [
  { id: "budget", icon: "Wallet", title: "Budget Challenge", tagline: "Can you survive 30 days with ₹40,000?", cta: "Play", to: "/budget-planner" },
  { id: "arena", icon: "TrendingUp", title: "Investment Arena", tagline: "You have ₹1,00,000 virtual capital.", cta: "Invest", to: "/market" },
  { id: "scam", icon: "Shield", title: "Scam Escape", tagline: "Spot fake QR codes before time runs out.", cta: "Start", to: "/fraud-lab" },
  { id: "banking", icon: "Landmark", title: "Banking Quest", tagline: "Open an account, transfer money and avoid mistakes.", cta: "Begin", to: "/learn" },
];

export const dailyReward = {
  day: 3,
  dayTotal: 7,
  coins: 25,
  label: "Daily login reward",
  body: "Check in daily — the chest grows every day of your streak.",
  nextIn: "09h 24m",
  badge: { icon: "Sparkles", title: "New badge unlocked", body: "Steady Saver — logged in 3 days in a row" },
};

export const leaderboard = {
  title: "Top learners this week",
  rank: 14,
  xpToTop10: 80,
  you: { name: "You", xp: "1,260" },
  rows: [
    { rank: 1, name: "Aarav M.", xp: "2,140", tone: "amber" },
    { rank: 2, name: "Diya S.", xp: "1,985", tone: "silver" },
    { rank: 3, name: "Kabir R.", xp: "1,760", tone: "bronze" },
    { rank: 4, name: "Ishita K.", xp: "1,640" },
    { rank: 5, name: "Rohan P.", xp: "1,510" },
  ],
};

export const mentorCard = {
  title: "Need help choosing your next lesson?",
  body: "Your mentor knows your roadmap and where you struggle. Ask it anything.",
  askCta: "Ask AI",
  roadmapCta: "Continue Roadmap",
};
