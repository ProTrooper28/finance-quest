import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

const ease = [0.23, 0.86, 0.44, 1];

export function RoadmapTimeline({ weeks }) {
  return (
    <ol className="relative mx-auto max-w-md">
      {weeks.map((w, i) => (
        <motion.li
          key={w.week}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.08, ease }}
          className="relative"
        >
          <div className="card-surface card-interactive flex items-center gap-4 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-semibold text-primary tnum">
              W{w.week}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">Week {w.week}</p>
              <p className="truncate text-sm font-semibold">{w.title}</p>
            </div>
          </div>
          {i < weeks.length - 1 ? (
            <div className="flex justify-center py-1 text-muted-foreground">
              <ChevronDown className="size-4" />
            </div>
          ) : null}
        </motion.li>
      ))}
    </ol>
  );
}
