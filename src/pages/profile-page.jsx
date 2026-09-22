import { Award, Pencil, ScrollText } from "lucide-react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { AchievementCard, ProgressRow } from "@/components/app/cards";
import { Button } from "@/components/ui/button";
import { completedModules, dataIcon, preferences, profileMeta, profileStats, profileUser, xpHistory } from "@/data/app";
import { storage } from "@/utils";

export function ProfilePage() {
  const user = storage.get("finquest-user", null) ?? {};
  const name = user.name && user.name !== "Guest" ? user.name : profileUser.name;
  const initial = name[0]?.toUpperCase() ?? "T";

  return (
    <div className="space-y-7">
      <PageHeader
        title={profileMeta.title}
        subtitle={profileMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Profile" }]}
        action={
          <Button variant="secondary" size="sm">
            <Pencil /> Edit profile
          </Button>
        }
      />

      {/* Identity header */}
      <section className="card-surface p-6">
        <div className="flex flex-wrap items-center gap-5">
          <span className="grid size-16 flex-none place-items-center rounded-2xl border border-border bg-secondary text-xl font-semibold text-foreground">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{name}</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {profileUser.handle} · {profileUser.joined}
            </p>
            <p className="mt-1 text-[13px] text-blue-300">{profileUser.journey}</p>
          </div>
          <div className="flex gap-6">
            {profileStats.map((s) => (
              <div key={s.id}>
                <p className="tnum text-lg font-semibold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Achievements strip */}
          <section>
            <SectionHeader title="Achievements" hint="Most recent badges" />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <AchievementCard icon={dataIcon("Flame")} title="On Fire" body="3-day learning streak" earned delay={0} />
              <AchievementCard icon={dataIcon("ShieldCheck")} title="Fraud Spotter" body="Cleared 3 fraud scenarios" earned delay={0.05} />
            </div>
          </section>

          {/* XP history */}
          <section>
            <SectionHeader title="XP history" hint="Your latest earns" />
            <div className="card-surface divide-y divide-border">
              {xpHistory.map((x) => (
                <div key={x.id} className="flex items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">{x.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{x.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Completed modules */}
          <section>
            <SectionHeader title="Completed modules" />
            <div className="card-surface divide-y divide-border">
              {completedModules.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">{m.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{m.track}</p>
                  </div>
                  <span className="tnum text-[13px] font-semibold text-foreground">{m.score}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <section>
            <SectionHeader title="Certificates" />
            <div className="card-surface divide-y divide-border">
              <div className="flex items-center gap-3 p-4">
                <span className="grid size-9 flex-none place-items-center rounded-lg border border-border bg-secondary text-blue-300">
                  <ScrollText className="size-4" />
                </span>
                <p className="text-[13px] font-medium text-foreground">Banking Basics</p>
              </div>
              <div className="flex items-center gap-3 p-4">
                <span className="grid size-9 flex-none place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
                  <Award className="size-4" />
                </span>
                <p className="text-[13px] text-muted-foreground">UPI &amp; Digital Payments — in progress</p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Preferences" />
            <div className="card-surface space-y-4 p-5">
              {preferences.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-medium text-foreground">{p.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card-surface p-5">
            <p className="eyebrow">Finance score</p>
            <div className="mt-3.5">
              <ProgressRow label="Composite score" value={72} display="72 / 100" delay={0} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
