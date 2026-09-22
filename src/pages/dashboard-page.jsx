import { motion } from "motion/react";

import { JourneyTrail } from "@/components/dashboard/journey-trail";
import { ContinueLearningCards, QuickPlayCards } from "@/components/dashboard/learning-cards";
import { MissionCard } from "@/components/dashboard/mission-card";
import { MissionHero } from "@/components/dashboard/mission-hero";
import { DailyRewardCard, LeaderboardCard, MentorCard } from "@/components/dashboard/reward-cards";

const EASE = [0.23, 0.86, 0.44, 1];

function FadeIn({ delay = 0, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function DashboardPage() {
  return (
    <div className="space-y-7">
      {/* Identity + progression hero */}
      <MissionHero />

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-7">
          <MissionCard />
          <FadeIn delay={0.1}>
            <JourneyTrail />
          </FadeIn>
          <ContinueLearningCards />
          <QuickPlayCards />
        </div>

        {/* Side rail */}
        <div className="space-y-5">
          <FadeIn delay={0.15}>
            <DailyRewardCard />
          </FadeIn>
          <FadeIn delay={0.2}>
            <LeaderboardCard />
          </FadeIn>
          <FadeIn delay={0.25}>
            <MentorCard />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
