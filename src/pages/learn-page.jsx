import { BookOpen, Clock3, Signal } from "lucide-react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { ModuleCard } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { dataIcon, learnCategories, learnMeta } from "@/data/app";

export function LearnPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title={learnMeta.title}
        subtitle={learnMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Learn" }]}
        action={
          <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            {learnMeta.progressLabel}
          </span>
        }
      />

      <SectionHeader title="Categories" hint="Each track unlocks its modules as you progress" />

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {learnCategories.map((c, i) => (
          <ModuleCard
            key={c.id}
            icon={dataIcon(c.icon)}
            title={c.title}
            body={c.body}
            meta={[`${c.modules} modules`, `${c.minutes} min`]}
            metaIcon={BookOpen}
            delay={i * 0.04}
          />
        ))}
      </div>

      <SectionHeader title="In progress" hint="Pick up where you stopped" />

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">UPI &amp; Digital Payments</p>
              <h3 className="mt-2 text-[15px] font-semibold tracking-tight text-foreground">
                Lesson 3 — Sending money with a UPI ID
              </h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                Where the limits apply, and what happens when a transfer fails.
              </p>
            </div>
            <Button asChild size="sm" className="bg-brand-duo font-medium hover:opacity-90">
              <a href="/learn">Resume</a>
            </Button>
          </div>
          <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock3 className="size-3.5" />4 min left</span>
            <span className="flex items-center gap-1.5"><Signal className="size-3.5" />52% complete</span>
          </div>
        </div>

        <EmptyState
          icon={BookOpen}
          title="Nothing else in progress"
          body="Finished lessons will collect here so you can revisit them anytime."
          action={
            <Button asChild variant="secondary" size="sm">
              <a href="/learn">Browse categories</a>
            </Button>
          }
        />
      </div>
    </div>
  );
}
