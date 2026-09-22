import { ChevronRight } from "lucide-react";

import { PageHeader, SectionHeader } from "@/components/app/page-header";
import { settingsMeta, settingSections } from "@/data/app";

function SettingRow({ label, value, hint }) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-accent/50 focus-ring"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-foreground">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
      <span className="flex-none text-[13px] text-muted-foreground">{value}</span>
      <ChevronRight className="size-4 flex-none text-muted-foreground/60 transition group-hover:text-foreground" />
    </button>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title={settingsMeta.title}
        subtitle={settingsMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "Settings" }]}
      />

      <div className="max-w-2xl space-y-6">
        {settingSections.map((section) => (
          <section key={section.id}>
            <SectionHeader title={section.label} />
            <div className="card-surface divide-y divide-border overflow-hidden">
              {section.items.map((item) => (
                <SettingRow key={item.id} label={item.label} value={item.value} hint={item.hint} />
              ))}
            </div>
          </section>
        ))}

        <p className="text-xs leading-relaxed text-muted-foreground">
          Rows are visual placeholders — selecting them will open editable controls once preferences are wired up.
        </p>
      </div>
    </div>
  );
}
