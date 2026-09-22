import { motion } from "motion/react";
import { Bell, Coins, Flame, Menu, Search, Settings, Zap } from "lucide-react";

import { Link, useNavigate } from "@/utils/router";

/**
 * Top navbar: menu (mobile), search, notifications, XP + coins, level,
 * avatar and settings. Values are placeholders until the backend lands.
 */
export function Navbar({ onOpenMobile }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-none items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="grid size-9 flex-none place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground lg:hidden"
      >
        <Menu className="size-[18px]" />
      </button>

      {/* Search */}
      <label className="relative hidden min-w-0 flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search modules, simulations, actions…"
          className="h-9 w-full rounded-lg border border-border bg-secondary/60 pl-9 pr-14 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus-ring"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex">
          ⌘K
        </kbd>
      </label>

      <div className="ml-auto flex flex-none items-center gap-1.5 sm:gap-2">
        {/* XP + coins */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-secondary/50 py-1.5 pl-2.5 pr-3 md:flex">
          <Zap className="size-3.5 text-blue-300" />
          <span className="tnum text-[13px] font-semibold text-foreground">1,260</span>
          <span className="text-[11px] text-muted-foreground">XP</span>
          <span className="mx-1 h-3.5 w-px bg-border" />
          <Coins className="size-3.5 text-amber-300" />
          <span className="tnum text-[13px] font-semibold text-foreground">480</span>
        </div>

        {/* Daily streak */}
        <div className="hidden items-center gap-1.5 rounded-lg border border-orange-500/25 bg-orange-500/10 px-2.5 py-1.5 md:flex">
          <Flame className="size-3.5 text-orange-300" />
          <span className="tnum text-[13px] font-semibold text-foreground">8</span>
          <span className="text-[11px] text-muted-foreground">day streak</span>
        </div>

        {/* Level */}
        <Link
          to="/achievements"
          className="hidden items-center gap-2 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 transition hover:border-border-strong sm:flex"
        >
          <span className="text-[11px] font-medium text-muted-foreground">LVL</span>
          <span className="tnum text-[13px] font-semibold text-foreground">5</span>
          <span className="relative h-1 w-10 overflow-hidden rounded-full bg-secondary-foreground/15">
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-brand-duo"
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 0.8, ease: [0.23, 0.86, 0.44, 1] }}
            />
          </span>
        </Link>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>

        {/* Settings */}
        <button
          type="button"
          aria-label="Settings"
          onClick={() => navigate("/settings")}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Settings className="size-[18px]" />
        </button>

        {/* Avatar */}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          aria-label="Open profile"
          className="ml-0.5 grid size-9 place-items-center rounded-full border border-border bg-secondary text-[13px] font-semibold text-foreground transition hover:border-border-strong focus-ring"
        >
          T
        </button>
      </div>
    </header>
  );
}
