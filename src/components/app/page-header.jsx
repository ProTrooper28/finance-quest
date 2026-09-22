import { Link } from "@/utils/router";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/utils";

const EASE = [0.23, 0.86, 0.44, 1];

/**
 * Consistent page heading: breadcrumb, title, subtitle and optional action.
 * Used at the top of every app page.
 */
export function PageHeader({ title, subtitle, crumb, action, className }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className={cn("flex flex-wrap items-end justify-between gap-4", className)}
    >
      <div>
        {crumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            {crumb.map((item, i) => {
              const last = i === crumb.length - 1;
              return (
                <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                  {last ? (
                    <span className="text-foreground/70">{item.label}</span>
                  ) : (
                    <>
                      <Link to={item.to} className="transition hover:text-foreground">
                        {item.label}
                      </Link>
                      <ChevronRight className="size-3 text-muted-foreground/60" />
                    </>
                  )}
                </span>
              );
            })}
          </nav>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-2.5">{action}</div> : null}
    </motion.header>
  );
}

/** Small uppercase section label used between card groups. */
export function SectionHeader({ title, hint, action }) {
  return (
    <div className="mb-3.5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
        {hint ? <p className="mt-0.5 text-[13px] text-muted-foreground">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}
