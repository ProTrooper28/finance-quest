import { Signal } from "lucide-react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { ModuleCard } from "@/components/app/cards";
import { dataIcon, simulationCards, simulationsMeta } from "@/data/app";
import { cn } from "@/utils";

const toneChip = {
  blue: "text-blue-300",
  violet: "text-violet-300",
  cyan: "text-cyan-300",
  amber: "text-amber-300",
  emerald: "text-emerald-300",
};

export function SimulationsPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title={simulationsMeta.title}
        subtitle={simulationsMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Simulations" }]}
      />

      <SectionHeader title="All simulations" hint="Decisions in, debriefs out — every scenario ends with the why" />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {simulationCards.map((s, i) => (
          <ModuleCard
            key={s.id}
            icon={dataIcon(s.icon)}
            title={s.title}
            body={s.body}
            meta={[s.meta, s.difficulty]}
            metaIcon={Signal}
            delay={i * 0.05}
          />
        ))}
      </div>

      <SectionHeader title="Seasonal events" hint="Rotating challenges with bonus rewards" />

      <div className="card-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Starts October 1</p>
            <h3 className="mt-2 text-[15px] font-semibold tracking-tight text-foreground">Festive Budget Challenge</h3>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              Plan a festival month without dipping into savings. Top 100 finishers earn a limited badge.
            </p>
          </div>
          <span className={cn("rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground", toneChip.blue)}>
            Notify me
          </span>
        </div>
      </div>
    </div>
  );
}
