import {
  Activity, Award, BadgeCheck, Banknote, BarChart3, BookOpen, Briefcase, Building2, CandlestickChart,  ChevronRight, CircleDollarSign, ClipboardCheck, Coins, Compass, CreditCard, Flame, Gamepad2, Gauge,
  GraduationCap, HelpCircle, Landmark, Languages, LayoutGrid, LineChart, MessageSquare, Newspaper, PieChart, PiggyBank, PlaySquare,
  Receipt, Rocket, ScrollText, Settings, Shield, ShieldCheck, ShieldQuestion, ShoppingBag, Smartphone, Sparkles,
  Store, Target, TrendingUp, Trophy, UserRound, Wallet, Zap,
} from "lucide-react";

/* ---------------------------------- nav ---------------------------------- */

export const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: "LayoutGrid" },
      { to: "/progress", label: "Progress", icon: "TrendingUp" },
    ],
  },
  {
    label: "Learning",
    items: [
      { to: "/learn", label: "Learn", icon: "BookOpen" },
      { to: "/simulations", label: "Simulations", icon: "Gamepad2" },
      { to: "/market", label: "Market Simulator", icon: "CandlestickChart" },
    ],
  },
  {
    label: "Tools",
    items: [
      { to: "/fraud-lab", label: "Fraud Simulator", icon: "ShieldCheck" },
      { to: "/budget-planner", label: "Budget Planner", icon: "Wallet" },
      { to: "/mentor", label: "AI Mentor", icon: "MessageSquare" },
    ],
  },
  {
    label: "You",
    items: [
      { to: "/achievements", label: "Achievements", icon: "Trophy" },
      { to: "/profile", label: "Profile", icon: "UserRound" },
      { to: "/settings", label: "Settings", icon: "Settings" },
    ],
  },
];

/* -------------------------------- dashboard ------------------------------- */

export const greeting = {
  eyebrow: "Tuesday, 22 September",
  title: "Good evening, Taran",
  message: "You're 40 XP from Level 6 — a lesson and a challenge will get you there tonight.",
};

export const stats = [
  { id: "xp", label: "Total XP", value: "1,260", delta: "+120 this week", icon: "Zap", tone: "blue" },
  { id: "coins", label: "Coins", value: "480", delta: "+35 today", icon: "Coins", tone: "amber" },
  { id: "streak", label: "Daily streak", value: "6 days", delta: "Best: 9 days", icon: "Flame", tone: "orange" },
  { id: "rank", label: "Current rank", value: "#12", delta: "of 248 learners", icon: "Trophy", tone: "violet" },
];

export const continueLearning = {
  eyebrow: "Continue where you left off",
  title: "UPI & Digital Payments",
  body: "You're halfway through Lesson 3 — sending money with a UPI ID, and where the limits apply.",
  progress: 52,
  lesson: "Lesson 3 of 5",
  minutes: "4 min left",
};

export const weeklyProgress = {
  title: "Weekly progress",
  subtitle: "Lessons completed per day",
  days: [
    { day: "M", value: 2 },
    { day: "T", value: 3 },
    { day: "W", value: 1 },
    { day: "T", value: 4 },
    { day: "F", value: 0 },
    { day: "S", value: 0 },
    { day: "S", value: 0 },
  ],
  total: 10,
  goal: 14,
  unit: "lessons",
};

export const dailyChallenge = {
  tag: "Today's challenge",
  title: "Spot the phishing email",
  body: "A 'bank' email asks you to confirm your account via a link. One choice keeps your money safe — pick it.",
  reward: "+40 XP · +15 coins",
  minutes: 3,
  cta: "Start challenge",
};

export const recommended = {
  eyebrow: "Recommended for you",
  title: "Credit Score Fundamentals",
  body: "Your assessment shows this is where the quickest wins are — two lessons and you'll know what moves your score.",
  meta: ["2 lessons", "1 quiz", "8 min"],
};

export const quickActions = [
  { id: "lesson", label: "Start a lesson", to: "/learn", icon: "BookOpen" },
  { id: "simulation", label: "Play a simulation", to: "/simulations", icon: "Gamepad2" },
  { id: "mentor", label: "Open AI Mentor", to: "/mentor", icon: "MessageSquare" },
  { id: "assessment", label: "Continue assessment", to: "/assessment", icon: "ClipboardCheck" },
];

export const activity = [
  { id: 1, icon: "BookOpen", title: "Completed lesson — Banking Basics 101", meta: "2 hours ago · +30 XP" },
  { id: 2, icon: "ShieldCheck", title: "Fraud simulator — spotted the OTP scam", meta: "Yesterday · +40 XP" },
  { id: 3, icon: "Coins", title: "Earned the Early Riser badge", meta: "Yesterday · +25 coins" },
  { id: 4, icon: "CandlestickChart", title: "Market simulator — opened a demo position", meta: "2 days ago · +20 XP" },
  { id: 5, icon: "ScrollText", title: "Finished assessment — Financial level: Smart Saver", meta: "3 days ago" },
];

export const roadmapPreview = [
  { week: "Week 1", title: "Banking Basics", done: true },
  { week: "Week 2", title: "UPI & Fraud Safety", done: false, current: true },
  { week: "Week 3", title: "Budgeting", done: false },
  { week: "Week 4", title: "Investing", done: false },
];

export const upcomingAchievement = {
  icon: "Flame",
  title: "Week Warrior",
  body: "Complete lessons on 7 consecutive days to earn this badge.",
  progress: 71,
  label: "6 of 7 days",
};

/* ---------------------------------- learn --------------------------------- */

export const learnCategories = [
  { id: "banking", title: "Banking", icon: "Landmark", modules: 6, minutes: 32, body: "Accounts, cards, net banking and how money actually moves." },
  { id: "upi", title: "UPI & Payments", icon: "Smartphone", modules: 5, minutes: 24, body: "Sending, receiving, limits and the failure cases worth knowing." },
  { id: "investing", title: "Investing", icon: "TrendingUp", modules: 8, minutes: 46, body: "Risk, compounding and the first principles before you buy anything." },
  { id: "mutual-funds", title: "Mutual Funds", icon: "PieChart", modules: 6, minutes: 38, body: "SIPs, expense ratios and reading a fund sheet without the jargon." },
  { id: "taxes", title: "Taxes", icon: "Receipt", modules: 5, minutes: 30, body: "Slabs, TDS, deductions and filing — minus the dread." },
  { id: "insurance", title: "Insurance", icon: "ShieldCheck", modules: 4, minutes: 22, body: "What to buy first, what to skip, and how much cover is enough." },
  { id: "credit-score", title: "Credit Score", icon: "Gauge", modules: 4, minutes: 20, body: "What builds it, what quietly breaks it, and how to check it free." },
  { id: "budgeting", title: "Budgeting", icon: "Wallet", modules: 5, minutes: 28, body: "Systems that survive a bad month, not just a good one." },
];

export const learnMeta = {
  title: "Learn",
  subtitle: "Short, interactive lessons across eight tracks. Pick a category to see its modules.",
  progressLabel: "3 of 8 tracks started",
};

/* ------------------------------- simulations ------------------------------ */

export const simulationCards = [
  { id: "budget-sim", title: "Budget Simulator", icon: "Wallet", body: "Run a month on a fixed salary — rent, food, fun and the surprises in between.", meta: "12 decisions · 15 min", difficulty: "Easy", tone: "blue" },
  { id: "fraud-sim", title: "Fraud Simulator", icon: "ShieldCheck", body: "Real scam scripts — fake QR codes, OTP calls, too-good deposits. Pick the safe response.", meta: "5 scenarios · 10 min", difficulty: "Medium", tone: "violet" },
  { id: "invest-sim", title: "Investment Simulator", icon: "TrendingUp", body: "Deploy virtual capital across asset classes and watch the trade-offs play out.", meta: "Open-ended · 20 min", difficulty: "Medium", tone: "cyan" },
  { id: "challenges", title: "Decision Challenges", icon: "Zap", body: "Fast, timed money calls — buy, wait or walk away, with instant debriefs.", meta: "3 rounds · 8 min", difficulty: "Hard", tone: "amber" },
  { id: "banking-missions", title: "Banking Missions", icon: "Landmark", body: "Open accounts, set up transfers and handle a failed payment — mission style.", meta: "4 missions · 18 min", difficulty: "Easy", tone: "emerald" },
];

export const simulationsMeta = {
  title: "Simulations",
  subtitle: "Make the decisions here so they feel familiar when the money is real.",
};

/* --------------------------------- market --------------------------------- */

export const marketMeta = {
  title: "Market Simulator",
  subtitle: "₹10,00,000 in demo capital. Real mechanics, zero risk.",
};

export const marketStats = [
  { id: "cash", label: "Cash available", value: "₹4,12,500" },
  { id: "invested", label: "Invested value", value: "₹5,87,430" },
  { id: "total", label: "Portfolio value", value: "₹9,99,930" },
  { id: "pnl", label: "Overall P/L", value: "-₹70 · 0.0%", tone: "neutral" },
];

export const watchlist = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: "₹2,934.10", change: "+1.2%", up: true },
  { symbol: "TCS", name: "Tata Consultancy", price: "₹3,891.55", change: "-0.4%", up: false },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: "₹1,642.80", change: "+0.8%", up: true },
  { symbol: "INFY", name: "Infosys", price: "₹1,510.25", change: "+2.1%", up: true },
];

export const trending = [
  { symbol: "TATAMOTORS", name: "Tata Motors", change: "+4.6%", up: true },
  { symbol: "ZOMATO", name: "Zomato", change: "+3.9%", up: true },
  { symbol: "PAYTM", name: "One97 (Paytm)", change: "-3.2%", up: false },
  { symbol: "YESBANK", name: "Yes Bank", change: "+2.8%", up: true },
];

export const marketNews = [
  { id: 1, tag: "Earnings", title: "Infosys beats quarterly estimates, guidance raised", time: "18 min ago" },
  { id: 2, tag: "Policy", title: "RBI holds rates steady; commentary leans dovish", time: "1 hr ago" },
  { id: 3, tag: "Global", title: "US futures slip as inflation data lands hotter", time: "3 hrs ago" },
];

export const tradePanel = {
  stock: "RELIANCE",
  price: "₹2,934.10",
  change: "+1.2%",
  cash: "₹4,12,500",
};

/* ---------------------------------- fraud --------------------------------- */

export const fraudMeta = {
  title: "Fraud Simulator",
  subtitle: "Real scam patterns, safe outcomes. Decide, then see the correct response.",
};

export const fraudScenario = {
  id: "fake-upi",
  difficulty: "Medium",
  reward: "+40 XP",
  category: "Fake UPI request",
  message:
    "Someone sends a collect request: 'You are receiving ₹2,499 from Rahul. Enter your UPI PIN to approve.' You never sold anything online today.",
  choices: [
    { id: "a", label: "Enter UPI PIN to receive the money" },
    { id: "b", label: "Decline and report the request as spam" },
    { id: "c", label: "Call the number back to check" },
  ],
};

/* --------------------------------- budget --------------------------------- */

export const budgetMeta = {
  title: "Budget Planner",
  subtitle: "One screen for the month — money in, money out, what's left.",
};

export const budgetStats = [
  { id: "income", label: "Monthly income", value: "₹48,000", tone: "neutral" },
  { id: "spent", label: "Spent this month", value: "₹31,240", tone: "neutral" },
  { id: "left", label: "Left to allocate", value: "₹16,760", tone: "positive" },
  { id: "saved", label: "Saved (goal 20%)", value: "₹9,600", tone: "positive" },
];

export const budgetBreakdown = [
  { id: 1, label: "Rent", value: "₹15,000", share: 48 },
  { id: 2, label: "Food & groceries", value: "₹7,400", share: 24 },
  { id: 3, label: "Transport", value: "₹2,150", share: 7 },
  { id: 4, label: "Subscriptions", value: "₹1,190", share: 4 },
  { id: 5, label: "Shopping", value: "₹5,500", share: 17 },
];

export const savingsGoals = [
  { id: 1, title: "Emergency fund", target: "₹1,50,000", saved: "₹64,000", progress: 43 },
  { id: 2, title: "New laptop", target: "₹85,000", saved: "₹22,500", progress: 26 },
  { id: 3, title: "Goa trip", target: "₹30,000", saved: "₹18,000", progress: 60 },
];

/* --------------------------------- mentor --------------------------------- */

export const mentorMeta = {
  title: "AI Mentor",
  subtitle: "Ask anything about money — from 'what is an SIP' to 'should I take this loan'.",
};

export const mentorSuggestions = [
  { icon: "HelpCircle", text: "What is an SIP and how do I start one?" },
  { icon: "CreditCard", text: "How does a credit card affect my credit score?" },
  { icon: "Landmark", text: "Savings account vs fixed deposit — which first?" },
  { icon: "ShieldQuestion", text: "How do I spot a UPI scam before it costs me?" },
  { icon: "Receipt", text: "What tax-saving options apply to a first salary?" },
  { icon: "PiggyBank", text: "How much of my salary should I save each month?" },
];

export const mentorEmpty = {
  title: "Ask your first question",
  body: "Your mentor knows where you are in the journey — beginner-friendly by default, and it keeps answers short unless you ask for depth.",
};

/* ------------------------------- achievements ----------------------------- */

export const achievementsMeta = {
  title: "Achievements",
  subtitle: "Badges, certificates and the ladder — everything you've unlocked so far.",
};

export const badgeGroups = [
  {
    id: "badges",
    label: "Badges",
    items: [
      { id: "first-lesson", title: "First Steps", body: "Completed your first lesson", icon: "BookOpen", earned: true },
      { id: "streak-3", title: "On Fire", body: "3-day learning streak", icon: "Flame", earned: true },
      { id: "quiz-ace", title: "Quiz Ace", body: "Scored 100% on any quiz", icon: "Award", earned: true },
      { id: "fraud-spotter", title: "Fraud Spotter", body: "Cleared 3 fraud scenarios", icon: "ShieldCheck", earned: true },
      { id: "week-warrior", title: "Week Warrior", body: "7-day learning streak", icon: "Zap", earned: false, progress: 71 },
      { id: "investor", title: "First Trade", body: "Placed your first simulated trade", icon: "CandlestickChart", earned: false },
    ],
  },
];

export const certificates = [
  { id: "banking", title: "Banking Basics — Certificate", meta: "Earned 3 days ago · Level: Proficient" },
  { id: "upi", title: "UPI & Digital Payments — Certificate", meta: "In progress · 2 lessons left" },
];

export const xpTimeline = [
  { id: 1, label: "Level 6 — Confident Saver", xp: "1,300 XP", state: "next" },
  { id: 2, label: "Level 5 — Smart Saver", xp: "1,000 XP", state: "current" },
  { id: 3, label: "Level 4 — Curious Beginner", xp: "700 XP", state: "done" },
  { id: 4, label: "Level 3 — Explorer", xp: "400 XP", state: "done" },
];

export const leaderboardPreview = [
  { rank: 1, name: "Aarav M.", xp: "2,140", you: false },
  { rank: 2, name: "Diya S.", xp: "1,985", you: false },
  { rank: 3, name: "Kabir R.", xp: "1,760", you: false },
  { rank: 12, name: "You", xp: "1,260", you: true },
  { rank: 13, name: "Ishita K.", xp: "1,240", you: false },
];

/* --------------------------------- progress ------------------------------- */

export const progressMeta = {
  title: "Progress",
  subtitle: "How the learning is actually going — streaks, accuracy and where to focus next.",
};

export const progressStats = [
  { id: "modules", label: "Modules completed", value: "6" },
  { id: "accuracy", label: "Quiz accuracy", value: "87%" },
  { id: "score", label: "Finance score", value: "72 / 100" },
  { id: "time", label: "Time invested", value: "6h 20m" },
];

export const completedModules = [
  { id: 1, title: "Banking Basics 101", track: "Banking", score: 92 },
  { id: 2, title: "Types of bank accounts", track: "Banking", score: 88 },
  { id: 3, title: "UPI — how transfers work", track: "UPI & Payments", score: 95 },
  { id: 4, title: "Reading a pay slip", track: "Taxes", score: 81 },
  { id: 5, title: "Emergency funds 101", track: "Budgeting", score: 90 },
  { id: 6, title: "Spotting phishing attempts", track: "Digital Security", score: 84 },
];

export const skillGraph = [
  { skill: "Banking", level: 82 },
  { skill: "Payments", level: 74 },
  { skill: "Budgeting", level: 68 },
  { skill: "Fraud awareness", level: 91 },
  { skill: "Investing", level: 31 },
  { skill: "Taxes", level: 44 },
];

export const streakCalendar = [
  1, 2, 0, 1, 3, 0, 0, 2, 1, 1, 0, 4, 2, 0, 1, 0, 3, 2, 1, 0, 0, 1, 2, 2, 3, 1, 0, 2,
];

/* --------------------------------- profile -------------------------------- */

export const profileMeta = {
  title: "Profile",
  subtitle: "Your account, your history, your trophies.",
};

export const profileUser = {
  name: "Taran Mehta",
  handle: "@taranm",
  joined: "Joined September 2026",
  journey: "Financial profile — Smart Saver",
};

export const profileStats = [
  { id: "xp", label: "Total XP", value: "1,260" },
  { id: "coins", label: "Coins", value: "480" },
  { id: "level", label: "Level", value: "5" },
  { id: "streak", label: "Best streak", value: "9 days" },
];

export const xpHistory = [
  { id: 1, label: "Daily challenge — phishing email", meta: "Today · +40 XP" },
  { id: 2, label: "Lesson — UPI limits & failures", meta: "Yesterday · +30 XP" },
  { id: 3, label: "Fraud simulator — QR scam", meta: "Yesterday · +40 XP" },
  { id: 4, label: "Quiz — banking basics", meta: "2 days ago · +50 XP" },
];

export const preferences = [
  { id: "language", label: "Learning language", value: "English" },
  { id: "pace", label: "Daily pace", value: "10 min / day" },
  { id: "reminders", label: "Streak reminders", value: "On" },
  { id: "sound", label: "Sound effects", value: "Off" },
];

/* --------------------------------- settings ------------------------------- */

export const settingsMeta = {
  title: "Settings",
  subtitle: "Preferences for the app. Account controls arrive with the backend.",
};

export const settingSections = [
  {
    id: "learning",
    label: "Learning",
    items: [
      { id: "language", label: "Language", value: "English", hint: "Used across lessons and the AI mentor." },
      { id: "pace", label: "Daily pace", value: "10 minutes", hint: "Drives your weekly goal and XP targets." },
      { id: "reminders", label: "Streak reminders", value: "On", hint: "A single nudge if you haven't learned by 8pm." },
    ],
  },
  {
    id: "appearance",
    label: "Appearance",
    items: [
      { id: "theme", label: "Theme", value: "Dark", hint: "Dark is tuned first; light follows." },
      { id: "motion", label: "Reduced motion", value: "Off", hint: "Falls back to the system preference automatically." },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      { id: "email", label: "Email", value: "taran@finquest.app", hint: "Changes will require verification once accounts sync." },
      { id: "export", label: "Export data", value: "Coming soon", hint: "Download your XP history and certificates." },
    ],
  },
];

/* ------------------------------ icon registry ----------------------------- */

const icons = {
  Activity, Award, BadgeCheck, Banknote, BarChart3, BookOpen, Briefcase, Building2, CandlestickChart,
  ChevronRight, CircleDollarSign, ClipboardCheck, Coins, Compass, CreditCard, Flame, Gamepad2, Gauge,
  GraduationCap, HelpCircle, Landmark, Languages, LayoutGrid, LineChart, MessageSquare, Newspaper,
  PieChart, PiggyBank, PlaySquare, Receipt, Rocket, ScrollText, Settings, Shield, ShieldCheck,
  ShieldQuestion, ShoppingBag, Smartphone, Sparkles, Store, Target, TrendingUp, Trophy, UserRound,
  Wallet, Zap,
};

/** Resolve an icon name from data files to a Lucide component (falls back to a dot). */
export function dataIcon(name, Fallback = ChevronRight) {
  return icons[name] ?? Fallback;
}
