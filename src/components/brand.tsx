import { Link } from "@tanstack/react-router";

export function BrandMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="#2563eb" />
      <path
        d="M8 21.5 13 15l4 3.5L24 10"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="10" r="2.2" fill="#fff" />
    </svg>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 font-semibold text-foreground"
      aria-label="FinQuest home"
    >
      <BrandMark />
      {!compact && (
        <span className="text-[1.0625rem] tracking-tight">
          Fin<span className="text-primary">Quest</span>
        </span>
      )}
    </Link>
  );
}
