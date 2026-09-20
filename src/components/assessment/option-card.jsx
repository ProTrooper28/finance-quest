import { motion } from "motion/react";
import { Check } from "lucide-react";

import { cn } from "@/utils";

/* Lucide icon lookup: assessment option icons resolve by name. */
import {
  Banknote, BarChart3, Bitcoin, BookOpen, Briefcase, Calculator, CalendarCheck, CalendarDays,
  CalendarRange, CandlestickChart, CircleSlash, CloudOff, CreditCard, Gamepad2, Gem, Gauge,
  GraduationCap, Landmark, Languages, LineChart, ListChecks, PieChart, PiggyBank, PlaySquare,
  Receipt, Repeat, ShieldAlert, ShieldCheck, ShieldHalf, ShieldQuestion, Smartphone, Sprout, Store,
  Timer, TrendingUp, Umbrella, UserRound, Wallet, WalletCards, Workflow,
} from "lucide-react";

const lucideIcons = {
  Banknote, BarChart3, Bitcoin, BookOpen, Briefcase, Calculator, CalendarCheck, CalendarDays,
  CalendarRange, CandlestickChart, CircleSlash, CloudOff, CreditCard, Gamepad2, Gem, Gauge,
  GraduationCap, Landmark, Languages, LineChart, ListChecks, PieChart, PiggyBank, PlaySquare,
  Receipt, Repeat, ShieldAlert, ShieldCheck, ShieldHalf, ShieldQuestion, Smartphone, Sprout, Store,
  Timer, TrendingUp, Umbrella, UserRound, Wallet, WalletCards, Workflow,
};

export function OptionCard({ icon, label, selected, multi, onClick, index = 0 }) {
  const Icon = lucideIcons[icon] ?? CircleSlash;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04, ease: [0.23, 0.86, 0.44, 1] }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-150 focus-ring",
        selected
          ? "border-[#a78bfa] bg-[#a78bfa]/15 shadow-[0_0_0_1px_#a78bfa]"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]",
      )}
      aria-pressed={selected}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-lg border transition-colors",
          selected ? "border-[#a78bfa]/50 bg-[#a78bfa]/20 text-[#c4b5fd]" : "border-white/10 bg-black/40 text-white/60 group-hover:text-white",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex-1 text-sm font-medium text-white">{label}</span>
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-full border transition-all",
          multi ? "rounded-md" : "",
          selected ? "border-white bg-white text-black" : "border-white/30",
        )}
      >
        {selected ? <Check className="size-3" /> : null}
      </span>
    </motion.button>
  );
}
