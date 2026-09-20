import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:bg-[#3b82f6] active:translate-y-px",
        secondary: "border border-border bg-secondary text-foreground hover:bg-accent active:translate-y-px",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        outline: "border border-border-strong bg-transparent text-foreground hover:bg-accent",
        glass: "glass-card text-foreground hover:border-border-strong",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        xl: "h-12 px-6 text-[0.9375rem]",
        icon: "size-9",
        iconSm: "size-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = forwardRef(function Button(
  { className, variant, size, asChild = false, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props}>
      {children}
    </Comp>
  );
});

export { buttonVariants };
