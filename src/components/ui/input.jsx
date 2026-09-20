import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/utils";

export const Input = forwardRef(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-lg border border-border bg-secondary/60 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus-ring hover:border-border-strong focus-visible:border-ring",
        className,
      )}
      {...props}
    />
  );
});

export function PasswordInput({ className, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-10", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function Label({ className, ...props }) {
  return (
    <label
      className={cn("text-[13px] font-medium leading-none text-foreground select-none", className)}
      {...props}
    />
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="text-xs text-destructive">{children}</p>;
}
