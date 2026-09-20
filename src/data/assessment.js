/**
 * Financial Fitness Assessment — question bank.
 * Cards, not forms: single and multi choice, one question per screen.
 * Scoring weights live in utils/assessment.js — this file stays declarative.
 */

export const ASSESSMENT_META = {
  title: "Financial Fitness Assessment",
  subtitle:
    "Answer a few quick questions so our AI can understand your current financial knowledge and create a personalized learning journey just for you.",
  estimatedMinutes: 2,
  questionCount: 8,
};

export const questions = [
  {
    id: "identity",
    kind: "single",
    label: "Who are you?",
    helper: "This shapes the examples we use in your lessons.",
    options: [
      { value: "student", label: "Student", icon: "GraduationCap" },
      { value: "professional", label: "Working Professional", icon: "Briefcase" },
      { value: "entrepreneur", label: "Entrepreneur", icon: "Store" },
      { value: "first-earner", label: "First Time Earner", icon: "Wallet" },
      { value: "other", label: "Other", icon: "UserRound" },
    ],
  },
  {
    id: "comfort",
    kind: "single",
    label: "How comfortable are you with finance?",
    helper: "Be honest — the roadmap adapts either way.",
    options: [
      { value: "just-starting", label: "Just getting started", icon: "Sprout" },
      { value: "know-basics", label: "I know the basics", icon: "BookOpen" },
      { value: "fairly-comfortable", label: "Fairly comfortable", icon: "BarChart3" },
      { value: "very-comfortable", label: "Very comfortable", icon: "LineChart" },
    ],
  },
  {
    id: "invested",
    kind: "multi",
    label: "Have you ever invested?",
    helper: "Pick everything that applies.",
    options: [
      { value: "never", label: "Never", icon: "CircleSlash" },
      { value: "sip", label: "SIP", icon: "Repeat" },
      { value: "mutual-funds", label: "Mutual Funds", icon: "PieChart" },
      { value: "stocks", label: "Stocks", icon: "TrendingUp" },
      { value: "crypto", label: "Crypto", icon: "Bitcoin" },
    ],
  },
  {
    id: "payments",
    kind: "multi",
    label: "Which payment methods do you use?",
    helper: "Select all that apply.",
    options: [
      { value: "upi", label: "UPI", icon: "Smartphone" },
      { value: "debit-card", label: "Debit Card", icon: "CreditCard" },
      { value: "credit-card", label: "Credit Card", icon: "WalletCards" },
      { value: "net-banking", label: "Net Banking", icon: "Landmark" },
      { value: "cash-only", label: "Cash Only", icon: "Banknote" },
    ],
  },
  {
    id: "learn-goal",
    kind: "multi",
    label: "What do you want to learn?",
    helper: "Your roadmap leads with these.",
    options: [
      { value: "banking", label: "Banking", icon: "Landmark" },
      { value: "upi-safety", label: "UPI & digital safety", icon: "Smartphone" },
      { value: "investing", label: "Investing", icon: "TrendingUp" },
      { value: "budgeting", label: "Budgeting", icon: "Calculator" },
      { value: "taxes", label: "Taxes", icon: "Receipt" },
      { value: "credit-score", label: "Credit Score", icon: "Gauge" },
      { value: "stock-market", label: "Stock Market", icon: "CandlestickChart" },
    ],
  },
  {
    id: "scam-awareness",
    kind: "single",
    label: "How confident are you in spotting online scams?",
    helper: "Fake UPI requests, phishing links, OTP fraud…",
    options: [
      { value: "not-confident", label: "Not confident", icon: "ShieldQuestion" },
      { value: "somewhat", label: "Somewhat confident", icon: "ShieldHalf" },
      { value: "very-confident", label: "Very confident", icon: "ShieldCheck" },
    ],
  },
  {
    id: "daily-time",
    kind: "single",
    label: "How much time can you spend learning daily?",
    helper: "Sessions are paced to fit.",
    options: [
      { value: "5", label: "5 min", icon: "Timer" },
      { value: "10", label: "10 min", icon: "Timer" },
      { value: "15", label: "15 min", icon: "Timer" },
      { value: "20+", label: "20+ min", icon: "Timer" },
    ],
  },
  {
    id: "language",
    kind: "single",
    label: "Preferred learning language?",
    helper: "Mentor replies in this language.",
    options: [
      { value: "english", label: "English", icon: "Languages" },
      { value: "hindi", label: "Hindi", icon: "Languages" },
      { value: "regional", label: "Regional language", icon: "Languages" },
    ],
  },
];
