import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className merge. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format a number with Indian digit grouping, e.g. 1000000 -> "10,00,000". */
export function formatIN(value) {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

/** Clamp n to [min, max]. */
export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Persisted state helper — SSR-safe localStorage read/write. */
export const storage = {
  get(key, fallback = null) {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode / full quota — ignore */
    }
  },
  clear(key) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
