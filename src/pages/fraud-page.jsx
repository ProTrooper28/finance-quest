import { Coins, Gauge, Sparkles } from "lucide-react";

import { ProgressBarCompact } from "@/components/assessment/progress-bar";
import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { fraudMeta, fraudScenario } from "@/data/app";

export function FraudPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title={fraudMeta.title}
        subtitle={fraudMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Fraud Simulator" }]}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Scenario card */}
        <div className="space-y-5 lg:col-span-2">
          <section className="card-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-medium text-violet-300">
                {fraudScenario.category}
              </span>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">
                Scenario 2 of 5
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-5">
              <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Incoming request</p>
              <p className="mt-2.5 text-[15px] leading-relaxed text-foreground">{fraudScenario.message}</p>
            </div>

            <p className="mt-6 text-[13px] font-medium text-muted-foreground">What do you do?</p>
            <div className="mt-3 space-y-2.5">
              {fraudScenario.choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-left transition hover:border-border-strong hover:bg-accent focus-ring"
                >
                  <span className="grid size-7 flex-none place-items-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground">
                    {c.id.toUpperCase()}
                  </span>
                  <span className="text-[13.5px] font-medium text-foreground">{c.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Side: progress, difficulty, reward */}
        <div className="space-y-5">
          <section className="card-surface p-5">
            <p className="eyebrow">Session progress</p>
            <div className="mt-3.5">
              <ProgressBarCompact value={40} className="bg-secondary" />
            </div>
            <p className="tnum mt-2.5 text-xs text-muted-foreground">2 of 5 scenarios cleared</p>
          </section>

          <section className="card-surface p-5">
            <p className="eyebrow">This scenario</p>
            <div className="mt-3.5 space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-muted-foreground"><Gauge className="size-4" />Difficulty</span>
                <span className="font-medium text-foreground">{fraudScenario.difficulty}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-muted-foreground"><Sparkles className="size-4" />Reward</span>
                <span className="font-medium text-foreground">{fraudScenario.reward}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 text-muted-foreground"><Coins className="size-4" />Bonus</span>
                <span className="font-medium text-foreground">+15 coins</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SectionHeader
        title="Debrief"
        hint="After every choice, the correct response and why it matters appears here"
      />
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
        The AI debrief panel will appear here once scenarios are wired up.
      </div>
    </div>
  );
}
