import { forwardRef } from "react";

import { cn } from "@/utils";

export const Card = forwardRef(function Card({ className, glass = false, ...props }, ref) {
  return <div ref={ref} className={cn(glass ? "glass-card" : "card-surface", className)} {...props} />;
});

export const CardHeader = forwardRef(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
});

export const CardTitle = forwardRef(function CardTitle({ className, ...props }, ref) {
  return <h3 ref={ref} className={cn("text-base font-semibold tracking-tight", className)} {...props} />;
});

export const CardDescription = forwardRef(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn("text-sm leading-relaxed text-muted-foreground", className)} {...props} />;
});

export const CardContent = forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />;
});

export const CardFooter = forwardRef(function CardFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />;
});
