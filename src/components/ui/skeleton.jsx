import { cn } from "@/utils";

/**
 * Loading skeleton block. Pulse-only, never spinners.
 */
export function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-white/[0.06]", className)} />;
}

/** Skeleton for a standard dashboard card. */
export function CardSkeleton({ className }) {
  return (
    <div className={cn("card-surface p-5", className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-7 w-32" />
      <Skeleton className="mt-4 h-3 w-full max-w-[220px]" />
    </div>
  );
}

/** Skeleton rows for list-style loading states. */
export function ListSkeleton({ rows = 4, className }) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4">
          <Skeleton className="size-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
