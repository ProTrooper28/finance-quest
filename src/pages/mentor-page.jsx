import { ArrowUp, MessageSquare, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/app/page-header";
import { dataIcon, mentorEmpty, mentorMeta, mentorSuggestions } from "@/data/app";

export function MentorPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title={mentorMeta.title}
        subtitle={mentorMeta.subtitle}
        crumb={[{ label: "Home", to: "/dashboard" }, { label: "AI Mentor" }]}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Conversation area */}
        <div className="lg:col-span-2">
          <div className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card">
            {/* Empty state */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-2xl border border-blue-500/25 bg-blue-500/10 text-blue-300">
                <Sparkles className="size-6" />
              </span>
              <h2 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{mentorEmpty.title}</h2>
              <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">{mentorEmpty.body}</p>
            </div>

            {/* Prompt input */}
            <div className="border-t border-border p-4">
              <div className="flex items-end gap-2 rounded-xl border border-border bg-secondary/50 p-2 focus-within:border-border-strong">
                <textarea
                  rows="1"
                  placeholder="Ask about saving, investing, taxes, scams…"
                  className="max-h-28 flex-1 resize-none bg-transparent px-2.5 py-2 text-[13.5px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  className="grid size-9 flex-none place-items-center rounded-lg bg-primary text-primary-foreground transition hover:bg-[#3b82f6]"
                >
                  <ArrowUp className="size-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Educational guidance only — not investment advice.
              </p>
            </div>
          </div>
        </div>

        {/* Suggested questions */}
        <div>
          <div className="card-surface p-5">
            <p className="eyebrow">Suggested questions</p>
            <div className="mt-3.5 space-y-2">
              {mentorSuggestions.map((s) => {
                const Icon = dataIcon(s.icon, MessageSquare);
                return (
                  <button
                    key={s.text}
                    type="button"
                    className="group flex w-full items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3.5 text-left transition hover:border-border-strong hover:bg-accent focus-ring"
                  >
                    <span className="mt-0.5 grid size-7 flex-none place-items-center rounded-lg border border-border bg-background text-muted-foreground group-hover:text-foreground">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="text-[13px] leading-snug text-foreground">{s.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-border p-5 text-[12.5px] leading-relaxed text-muted-foreground">
            Conversation history, multilingual replies and mentor memory will plug into this layout.
          </div>
        </div>
      </div>
    </div>
  );
}
