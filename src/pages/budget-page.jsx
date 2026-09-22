import { PieChart, Target, Wallet } from "lucide-react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { ProgressRow, StatCard } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { budgetBreakdown, budgetMeta, budgetStats, savingsGoals } from "@/data/app";
import { cn } from "@/utils";

export function BudgetPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title={budgetMeta.title}
        subtitle={budgetMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Budget Planner" }]}
        action={
          <Button variant="secondary" size="sm">
            <Wallet /> Edit budget
          </Button>
        }
      />

      {/* Monthly overview */}
      <section className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {budgetStats.map((s, i) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            tone={s.tone === "positive" ? "emerald" : "blue"}
            delay={i * 0.05}
          />
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Expense breakdown */}
        <div className="space-y-5 lg:col-span-2">
          <section>
            <SectionHeader title="Expenses" hint="Where this month's money went" />
            <div className="card-surface space-y-4 p-5">
              {budgetBreakdown.map((b, i) => (
                <ProgressRow
                  key={b.id}
                  label={b.label}
                  value={b.share}
                  display={`${b.value} · ${b.share}%`}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Savings goals" hint="Progress against each target" />
            <div className="grid gap-3.5 sm:grid-cols-3">
              {savingsGoals.map((g, i) => (
                <div key={g.id} className="card-surface card-interactive p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/12 text-emerald-300">
                      <Target className="size-4" />
                    </span>
                    <p className="text-[13.5px] font-semibold text-foreground">{g.title}</p>
                  </div>
                  <p className="tnum mt-3 text-[13px] text-muted-foreground">
                    <span className="font-semibold text-foreground">{g.saved}</span> of {g.target}
                  </p>
                  <div className="mt-3">
                    <ProgressRow label="" value={g.progress} display={`${g.progress}%`} delay={i * 0.06} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Analytics side */}
        <div className="space-y-5">
          <section className="card-surface p-5">
            <p className="eyebrow">Split this month</p>
            <div className="mt-4 flex items-center justify-center py-6">
              <div className="relative grid size-36 place-items-center rounded-full"
                style={{
                  background:
                    "conic-gradient(rgb(59 130 246) 0% 48%, rgb(99 102 241) 48% 72%, rgb(16 185 129) 72% 79%, rgb(245 158 11) 79% 83%, rgb(148 163 184) 83% 100%)",
                }}
              >
                <div className="grid size-24 place-items-center rounded-full bg-card text-center">
                  <div>
                    <p className="tnum text-lg font-semibold text-foreground">65%</p>
                    <p className="text-[10px] text-muted-foreground">of income spent</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {budgetBreakdown.map((b) => (
                <div key={b.id} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        b.id === 1 && "bg-blue-500",
                        b.id === 2 && "bg-indigo-500",
                        b.id === 3 && "bg-emerald-500",
                        b.id === 4 && "bg-amber-500",
                        b.id === 5 && "bg-slate-400",
                      )}
                    />
                    {b.label}
                  </span>
                  <span className="tnum text-foreground">{b.share}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card-surface p-5">
            <p className="eyebrow">Insight</p>
            <div className="mt-3 flex items-start gap-3">
              <span className="grid size-8 flex-none place-items-center rounded-lg bg-blue-500/12 text-blue-300">
                <PieChart className="size-4" />
              </span>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Shopping is <span className="font-medium text-foreground">17%</span> of your spend this month — trimming
                it by half frees <span className="font-medium text-emerald-400">₹2,750</span> toward the emergency fund.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
