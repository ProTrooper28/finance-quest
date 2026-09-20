import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

import { cn } from "@/utils";

let listeners = [];
let toasts = [];

function emitChange() {
  for (const l of listeners) l();
}

/** Imperative toast API: toast("Saved"), toast.error("Oops"), toast.success("Done"). */
export const toast = Object.assign(
  (message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, message, variant: "info", duration: 3500, ...opts }];
    emitChange();
  },
  {
    success: (message, opts = {}) => toast(message, { ...opts, variant: "success" }),
    error: (message, opts = {}) => toast(message, { ...opts, variant: "error" }),
    dismiss: (id) => {
      toasts = toasts.filter((t) => t.id !== id);
      emitChange();
    },
  },
);

export function Toaster() {
  const [, force] = useState(0);

  useEffect(() => {
    const listener = () => force((n) => n + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return undefined;
    const timers = toasts.map((t) => setTimeout(() => toast.dismiss(t.id), t.duration));
    return () => timers.forEach(clearTimeout);
  });

  const icons = { success: CheckCircle2, error: XCircle, info: Info };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-xs flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.variant] ?? Info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.23, 0.86, 0.44, 1] }}
              className={cn(
                "glass-card pointer-events-auto flex items-start gap-2.5 rounded-xl p-3.5 text-sm shadow-raised",
                t.variant === "success" && "border-success/40",
                t.variant === "error" && "border-destructive/40",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  t.variant === "success" && "text-success",
                  t.variant === "error" && "text-destructive",
                  t.variant === "info" && "text-info",
                )}
              />
              <span className="flex-1 leading-snug">{t.message}</span>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
