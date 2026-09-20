import { useCallback, useEffect, useRef, useState } from "react";

import { fireConfetti } from "@/lib/confetti";
import { storage } from "@/utils";

/**
 * Creates an account in memory + localStorage (frontend-only for now).
 * Returns { user, signUp, signIn, signInAsGuest, signOut, pending, error }.
 *
 * Signup/login navigate to /assessment; guest login skips auth entirely
 * and lands on the same onboarding journey. Swap the internals for
 * Supabase when the backend lands.
 */
export function useAuthFlow() {
  const [user, setUser] = useState(() => storage.get("finquest-user", null));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const signUp = useCallback(async ({ name, email }) => {
    setPending(true);
    setError(null);
    // Simulated latency so the UI feels real; swap for an API call later.
    await new Promise((r) => setTimeout(r, 700));
    const next = { name: name || email.split("@")[0], email };
    storage.set("finquest-user", next);
    setUser(next);
    setPending(false);
    return next;
  }, []);

  const signIn = useCallback(async ({ email }) => {
    setPending(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 700));
    const next = storage.get("finquest-user", null) ?? { name: email.split("@")[0], email };
    storage.set("finquest-user", next);
    setUser(next);
    setPending(false);
    return next;
  }, []);

  /** Guest login — no credentials, straight into onboarding. */
  const signInAsGuest = useCallback(() => {
    const next = { name: "Guest", email: null, guest: true };
    storage.set("finquest-user", next);
    setUser(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    storage.clear("finquest-user");
    setUser(null);
  }, []);

  return { user, signUp, signIn, signInAsGuest, signOut, pending, error };
}

/** Analysis stages shown on the AI analysis page. */
export const ANALYSIS_STAGES = [
  "Understanding your financial profile",
  "Identifying strengths",
  "Finding knowledge gaps",
  "Building your personalized roadmap",
  "Selecting simulations",
];

/**
 * Runs the staged AI analysis animation, 0 -> 100 over ~4.5s.
 * Returns { progress, stepsDone, done }.
 */
export function useAnalysisAnimation(totalMs = 4500) {
  const [progress, setProgress] = useState(0);
  const [stepsDone, setStepsDone] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - started) / totalMs);
      /* Ease-out so the counter slows near 100 for a "thinking" feel. */
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(eased * 100));
      setStepsDone(Math.min(ANALYSIS_STAGES.length, Math.floor(eased * (ANALYSIS_STAGES.length + 0.4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalMs]);

  return { progress, stepsDone, done: progress >= 100 };
}

/** Number count-up with ease-out, used on the result score. */
export function useCountUp(target, duration = 1400, start = true) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!start) return undefined;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current ?? 0);
  }, [target, duration, start]);

  return value;
}

/** Fires the shared confetti burst once when `when` flips true. */
export function useConfetti(when, delayMs = 350) {
  useEffect(() => {
    if (!when) return undefined;
    const t = setTimeout(() => fireConfetti(110), delayMs);
    return () => clearTimeout(t);
  }, [when, delayMs]);
}

/** Convenience: clear the assessment draft. */
export function clearAssessmentDraft() {
  storage.clear("finquest-assessment-v1");
}
