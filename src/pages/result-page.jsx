import { useEffect } from "react";
import { useNavigate } from "@/utils/router";
import { motion } from "motion/react";
import { ArrowRight, Compass, Gamepad2, Rocket, Target } from "lucide-react";

import { ProgressBarCompact } from "@/components/assessment/progress-bar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { ProfileCard } from "@/components/result/profile-card";
import { RoadmapTimeline } from "@/components/result/roadmap-timeline";
import { useAssessment } from "@/hooks/use-assessment";
import { useConfetti } from "@/hooks/use-auth-flow";
import { storage } from "@/utils";

const ease = [0.23, 0.86, 0.44, 1];

function MetaTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 p-4">
      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
        <Icon className="size-3.5 text-blue-400" />
        {label}
      </div>
      <p className="mt-1.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

export function ResultPage() {
  const navigate = useNavigate();
  const { result, finish, reset } = useAssessment();
  const payload = result ?? storage.get("finquest-result-v1", null);

  useConfetti(Boolean(payload));

  /* Direct visit with no result: compute from any saved draft, else bounce. */
  useEffect(() => {
    if (!payload) finish();
  }, [payload, finish]);

  if (!payload) return null;

  const retake = () => {
    reset();
    navigate("/assessment", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="text-center"
      >
        <p className="eyebrow">Your learning journey</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Welcome, {payload.name || "Guest"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{payload.profile.headline}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
        className="mt-10"
      >
        <ProfileCard
          profile={payload.profile}
          score={payload.financialScore}
          level={payload.knowledgeLevel}
          confidence={payload.confidence}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22, ease }}
        className="mt-6 grid gap-3 sm:grid-cols-2"
      >
        <MetaTile icon={Target} label="Weekly goal" value={`${payload.weeklyGoal.minutes} min · ${payload.weeklyGoal.label}`} />
        <MetaTile icon={Rocket} label={`XP target — Week ${payload.xpTarget.week}`} value={`${payload.xpTarget.amount} XP`} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease }}
        className="mt-10"
      >
        <p className="eyebrow">Recommended games</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {payload.games.map((g) => (
            <div key={g.id} className="card-surface card-interactive hover-lift p-4">
              <Gamepad2 className="size-4 text-blue-400" />
              <p className="mt-2.5 text-sm font-semibold">{g.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{g.why}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.38, ease }}
        className="mt-10 text-center"
      >
        <p className="eyebrow">Your roadmap</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">Five weeks, starting where you are.</h2>
      </motion.div>

      <div className="mt-8">
        <RoadmapTimeline weeks={payload.roadmap} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.4, ease }}
        className="mt-12 flex flex-col items-center gap-3"
      >
        <Button size="xl" className="w-full max-w-xs bg-brand-duo font-medium hover:opacity-90" onClick={() => navigate("/dashboard")}>
          Start My Journey <ArrowRight />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            toast("Modules are coming soon", {
              description: `Your roadmap starts with ${payload.roadmap[0]?.title ?? "the basics"}.`,
            })
          }
        >
          <Compass /> Explore Modules
        </Button>
        <Button variant="link" size="sm" className="text-muted-foreground" onClick={retake}>
          Retake assessment
        </Button>
      </motion.div>
    </div>
  );
}
