/* Content model for the market simulator: universe, scenarios, news,
   missions, achievements. Values are placeholders until the backend lands;
   the market engine (utils/market-engine.js) animates everything. */

export const SCENARIOS = [
  { id: "live", name: "Live Simulated Market", difficulty: 2, duration: "Open-ended", xp: 0, desc: "Real-time simulated market driven by rolling news events.", tag: "Default" },
  { id: "beginner", name: "Beginner Market", difficulty: 1, duration: "Open-ended", xp: 200, desc: "Lower volatility, fewer shocks — learn the mechanics safely.", tag: "Guided" },
  { id: "bull", name: "Bull Market", difficulty: 2, duration: "~15 min", xp: 400, desc: "Everything trends up. The trap is overconfidence.", tag: "Trend" },
  { id: "bear", name: "Bear Market", difficulty: 3, duration: "~15 min", xp: 500, desc: "Sustained selling pressure. Survival is the win condition.", tag: "Trend" },
  { id: "volatility", name: "High Volatility", difficulty: 4, duration: "~10 min", xp: 600, desc: "Violent swings both ways — position sizing is everything.", tag: "Advanced" },
  { id: "ipo", name: "IPO Week", difficulty: 3, duration: "~12 min", xp: 500, desc: "Fresh listings, listing pops and froth. Separate hype from value.", tag: "Event" },
  { id: "budget", name: "Budget Day", difficulty: 4, duration: "~8 min", xp: 600, desc: "One announcement moves entire sectors in minutes.", tag: "Event" },
  { id: "rbi", name: "RBI Policy Day", difficulty: 3, duration: "~8 min", xp: 500, desc: "Repo rate decisions reshape banking, autos and real estate.", tag: "Event" },
  { id: "earnings", name: "Earnings Season", difficulty: 2, duration: "~15 min", xp: 400, desc: "Company results land one after another. Trade the surprises.", tag: "Event" },
];

export const HISTORICAL_REPLAYS = [
  { id: "covid", name: "COVID Crash 2020", year: "Mar 2020", difficulty: 4, duration: "~20 min", xp: 1000, desc: "Experience the panic of March 2020. Can you protect your portfolio?" },
  { id: "gfc", name: "2008 Financial Crisis", year: "Sep–Dec 2008", difficulty: 5, duration: "~25 min", xp: 1200, desc: "Lehman falls. Everything is correlated. What survives?" },
  { id: "bullrun", name: "2020 Bull Run", year: "Apr–Dec 2020", difficulty: 2, duration: "~20 min", xp: 800, desc: "The fastest recovery in history. Ride it — without chasing." },
  { id: "budget24", name: "Budget 2024", year: "Jul 2024", difficulty: 3, duration: "~12 min", xp: 700, desc: "One speech, instant sector rotations. Read the fine print fast." },
  { id: "demo", name: "Demonetization (Educational)", year: "Nov 2016", difficulty: 3, duration: "~15 min", xp: 800, desc: "Cash vanishes overnight. Watch which sectors absorb the shock." },
  { id: "reliance", name: "Reliance Major Acquisition", year: "2023", difficulty: 2, duration: "~10 min", xp: 600, desc: "A mega-deal reshapes telecom and retail overnight." },
  { id: "earnings", name: "Tesla Earnings Surprise", year: "Oct 2021", difficulty: 2, duration: "~10 min", xp: 600, desc: "A blowout quarter vs valuation reality. Momentum meets nerves." },
  { id: "inflation", name: "Global Inflation Surge", year: "2022", difficulty: 4, duration: "~20 min", xp: 1000, desc: "Rates rise worldwide. Growth stocks bleed, value holds." },
];

export const STAR = { filled: "fill-amber-300 text-amber-300", empty: "text-white/20" };

/* ------------------------------ session setup ----------------------------- */

export const TIME_MODES = [
  { id: "intraday", name: "Intraday", icon: "Zap", duration: "10–15 min", xp: 300, desc: "One trading day, 09:15 to 15:30. Every tick is a price move." },
  { id: "weekly", name: "Weekly Simulation", icon: "CalendarRange", duration: "15–20 min", xp: 450, desc: "Mon to Fri. Sector trends and mid-week events shape the tape." },
  { id: "monthly", name: "Monthly Simulation", icon: "CalendarDays", duration: "20–30 min", xp: 600, desc: "Four weeks of decisions — earnings, dividends and rotations." },
  { id: "longterm", name: "Long-Term Investor (1 Year)", icon: "TrendingUp", duration: "20–30 min", xp: 800, desc: "Accelerated month-by-month. Jan to Dec wealth building." },
  { id: "replay", name: "Historical Replay", icon: "History", duration: "10–25 min", xp: 1000, desc: "Re-run a famous market event and trade through it." },
];

export const INVESTMENT_STYLES = [
  { id: "day", name: "Day Trader", icon: "Zap", tagline: "Minute-by-minute price movement, frequent news, high volatility, fast decisions." },
  { id: "swing", name: "Swing Trader", icon: "CalendarRange", tagline: "Hold for several days. Medium volatility, company events and sector trends." },
  { id: "investor", name: "Long-Term Investor", icon: "TrendingUp", tagline: "Monthly progression — earnings, budgets, dividends and wealth creation." },
  { id: "learning", name: "Learning Mode", icon: "GraduationCap", tagline: "AI pauses after every major event, explains why prices moved and hints before decisions. Best for beginners." },
];

export const LOADING_STEPS = [
  "Loading Market Data",
  "Initializing Economy",
  "Loading Companies",
  "Connecting AI Mentor",
  "Preparing Challenges",
];

export const UNIVERSE = [
  { sym: "RELIANCE", name: "Reliance Industries", sector: "Energy", base: 2934, risk: 45, volatility: 0.9 },
  { sym: "TCS", name: "Tata Consultancy", sector: "IT", base: 3891, risk: 30, volatility: 0.8 },
  { sym: "HDFCBANK", name: "HDFC Bank", sector: "Banking", base: 1642, risk: 38, volatility: 0.9 },
  { sym: "INFY", name: "Infosys", sector: "IT", base: 1510, risk: 35, volatility: 1.0 },
  { sym: "TATAMOTORS", name: "Tata Motors", sector: "Auto", base: 985, risk: 62, volatility: 1.5 },
  { sym: "ICICIBANK", name: "ICICI Bank", sector: "Banking", base: 1188, risk: 40, volatility: 1.0 },
  { sym: "SBIN", name: "State Bank of India", sector: "Banking", base: 812, risk: 48, volatility: 1.2 },
  { sym: "ITC", name: "ITC", sector: "FMCG", base: 465, risk: 22, volatility: 0.6 },
  { sym: "LT", name: "Larsen & Toubro", sector: "Infra", base: 3540, risk: 42, volatility: 1.0 },
  { sym: "MARUTI", name: "Maruti Suzuki", sector: "Auto", base: 12480, risk: 44, volatility: 1.0 },
  { sym: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", base: 1785, risk: 32, volatility: 0.8 },
  { sym: "ZOMATO", name: "Zomato", sector: "Consumer Tech", base: 265, risk: 75, volatility: 1.9 },
];

export const SECTORS = ["Energy", "IT", "Banking", "Auto", "FMCG", "Infra", "Pharma", "Consumer Tech"];

/* News pool — impact is per-sector drift applied on release. */
export const NEWS_POOL = [
  { id: "n1", cat: "Policy", headline: "Government announces ₹15,000 Cr EV subsidy program", impact: "bullish", confidence: 86, sectors: { Auto: 1.8, Energy: 0.6 }, tickers: ["TATAMOTORS", "MARUTI"], min: 0 },
  { id: "n2", cat: "Policy", headline: "RBI increases repo rate by 25 bps", impact: "bearish", confidence: 92, sectors: { Banking: -1.2, Auto: -0.9, Infra: -0.7 }, tickers: ["HDFCBANK", "ICICIBANK", "SBIN"], min: 1 },
  { id: "n3", cat: "Corporate", headline: "Reliance acquires majority stake in a retail chain", impact: "bullish", confidence: 81, sectors: { Energy: 1.4 }, tickers: ["RELIANCE"], min: 0 },
  { id: "n4", cat: "Earnings", headline: "Infosys beats quarterly earnings, raises guidance", impact: "bullish", confidence: 88, sectors: { IT: 1.6 }, tickers: ["INFY", "TCS"], min: 1 },
  { id: "n5", cat: "Macro", headline: "Crude oil surges past $95 on supply cuts", impact: "bearish", confidence: 78, sectors: { Energy: -1.5, Auto: -0.8 }, tickers: ["RELIANCE", "TATAMOTORS"], min: 1 },
  { id: "n6", cat: "Macro", headline: "Inflation prints hotter than expected at 6.1%", impact: "bearish", confidence: 84, sectors: { FMCG: -1.0, Banking: -0.6, ConsumerTech: -1.2 }, tickers: ["ITC", "ZOMATO"], min: 1 },
  { id: "n7", cat: "Earnings", headline: "TCS wins multi-year deal; FY guidance bumped", impact: "bullish", confidence: 83, sectors: { IT: 1.2 }, tickers: ["TCS"], min: 0 },
  { id: "n8", cat: "Global", headline: "US Fed hints at pause — global risk-on mood", impact: "bullish", confidence: 72, sectors: { IT: 1.0, Banking: 0.8, ConsumerTech: 1.5 }, tickers: ["INFY", "HDFCBANK", "ZOMATO"], min: 2 },
  { id: "n9", cat: "Corporate", headline: "Zomato posts first profitable quarter", impact: "bullish", confidence: 76, sectors: { ConsumerTech: 2.2 }, tickers: ["ZOMATO"], min: 0 },
  { id: "n10", cat: "Policy", headline: "Budget leak: capex allocation up 12%", impact: "bullish", confidence: 64, sectors: { Infra: 2.0, Banking: 0.7 }, tickers: ["LT", "SBIN"], min: 2 },
  { id: "n11", cat: "Corporate", headline: "Pharma export approvals accelerate", impact: "bullish", confidence: 70, sectors: { Pharma: 1.3 }, tickers: ["SUNPHARMA"], min: 1 },
  { id: "n12", cat: "Macro", headline: "Monsoon 6% below average — rural demand worry", impact: "bearish", confidence: 68, sectors: { FMCG: -1.4, Auto: -0.7 }, tickers: ["ITC", "MARUTI"], min: 2 },
  { id: "n13", cat: "Global", headline: "Global crisis: credit spreads blow out overnight", impact: "bearish", confidence: 90, sectors: { Banking: -2.2, Infra: -1.8, Energy: -1.5, IT: -1.4, Auto: -1.6, FMCG: -0.8, Pharma: -0.5, ConsumerTech: -2.0 }, tickers: ["HDFCBANK", "LT", "RELIANCE", "ZOMATO"], min: 3 },
  { id: "n14", cat: "Corporate", headline: "Maruti unveils record order book for new SUV", impact: "bullish", confidence: 79, sectors: { Auto: 1.5 }, tickers: ["MARUTI"], min: 0 },
  { id: "n15", cat: "Corporate", headline: "ITC diversifies into premium beverages", impact: "neutral", confidence: 60, sectors: { FMCG: 0.4 }, tickers: ["ITC"], min: 1 },
];

/* Event cadence — weighted picks while a session runs. */
export const EVENT_KINDS = [
  { kind: "Budget Announcement", weight: 1 },
  { kind: "Election Result", weight: 1 },
  { kind: "Repo Rate Change", weight: 2 },
  { kind: "Inflation Report", weight: 2 },
  { kind: "Company Earnings", weight: 3 },
  { kind: "Acquisition", weight: 2 },
  { kind: "Dividend", weight: 2 },
  { kind: "IPO Launch", weight: 1 },
  { kind: "Global Crisis", weight: 1 },
  { kind: "Sector Boom", weight: 2 },
];

export const MISSIONS = [
  { id: "m-banking", title: "Buy 3 Banking stocks", target: 3, metric: "sector:Banking", xp: 300, coins: 75 },
  { id: "m-diversify", title: "Diversify across 5 sectors", target: 5, metric: "sectors", xp: 350, coins: 80 },
  { id: "m-profit", title: "Earn 5% portfolio profit", target: 5, metric: "profitPct", xp: 400, coins: 100 },
  { id: "m-beat-nifty", title: "Beat the NIFTY", target: 1, metric: "beatNifty", xp: 500, coins: 100 },
  { id: "m-first", title: "Place your first trade", target: 1, metric: "trades", xp: 100, coins: 25 },
  { id: "m-survive-crash", title: "Protect capital during a crash", target: 1, metric: "crashSurvived", xp: 350, coins: 80 },
  { id: "m-earnings", title: "Invest after an earnings report", target: 1, metric: "earningsBuys", xp: 250, coins: 60 },
  { id: "m-low-risk", title: "Keep portfolio risk below 45", target: 1, metric: "lowRisk", xp: 300, coins: 70 },
];

export const ACHIEVEMENTS = [
  { id: "first-trade", name: "First Trade", desc: "Place your first simulated trade", icon: "CandlestickChart", xp: 50 },
  { id: "first-profit", name: "First Profit", desc: "Sell any position for a gain", icon: "TrendingUp", xp: 75 },
  { id: "diversify-master", name: "Diversification Master", desc: "Hold 5+ sectors at once", icon: "PieChart", xp: 150 },
  { id: "news-analyst", name: "News Analyst", desc: "Trade in the direction of news 3 times", icon: "Newspaper", xp: 120 },
  { id: "risk-manager", name: "Risk Manager", desc: "Keep risk score below 45 after 5 trades", icon: "ShieldCheck", xp: 150 },
  { id: "market-expert", name: "Market Expert", desc: "Complete any historical replay", icon: "Gauge", xp: 300 },
  { id: "legend-investor", name: "Legend Investor", desc: "Beat NIFTY in a high-difficulty scenario", icon: "Trophy", xp: 500 },
];
