# FinQuest implementation plan

## Product shape
- Build a polished dark fintech experience with blue-purple gradients, restrained glass surfaces, Inter typography, and mobile-first navigation.
- Use separate, shareable pages for the public home, account access, dashboard, learning, stock simulator, fraud simulator, personal finance tools, AI mentor, analytics, and profile.
- Use “FinQuest” as the final product name.

## Core experience
- Create a high-impact home page with the supplied headline, product previews, journey, social proof, statistics, and footer.
- Add account creation, login, Google sign-in, password recovery, and profile-backed onboarding for financial goals.
- Store user progress, XP, coins, streaks, achievements, certificates, watchlists, simulation state, and personalized roadmap in Lovable Cloud.
- Default the mentor to one ongoing conversation per user with Cloud-backed history, since the unanswered choices should support cross-device learning.

## Learning and simulation
- Build an 11-module learning path with short lessons, visual explanations, exercises, quizzes, completion gates, and rewards.
- Build the virtual stock market with virtual cash, a watchlist, portfolio actions, simulated news, charts, and decision feedback.
- Build fraud scenarios and personal-finance calculators/challenges with immediate educational explanations.
- Add dashboard and analytics views for progression, weak topics, weekly performance, rank, and suggested next steps.

## AI mentor
- Use Lovable AI for streaming mentor conversations, personalized explanations, adaptive difficulty, multilingual answers, roadmap generation, and simulation feedback.
- Keep AI instructions and calls private on the server, save completed messages, and surface clear usage or service errors.
- Compose the visible mentor with AI Elements, including message rendering, loading, tool activity, and a focused prompt box.

## Technical details
- Use TanStack Start routes and route-specific metadata throughout.
- Add Cloud tables with row-level access rules so each learner sees only their own private data.
- Generate starter content and demo market data for a convincing first-run experience.
- Validate critical flows on desktop and mobile: onboarding, login/reset, module completion, simulator decisions, persistence, and AI chat.
