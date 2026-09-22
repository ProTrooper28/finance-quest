/* Market simulation runtime. All simulation logic (state shape, reducer,
   clock, trades, missions) lives in market-sim-core.js so it can be fuzz
   tested headlessly; this module only binds it to React: a reducer hook,
   the tick interval, and stable action callbacks. */

import { useCallback, useEffect, useMemo, useReducer } from "react";

import {
  TICK_MS, createInitialState, reducer,
} from "@/hooks/market-sim-core";

/** The whole simulator state, driven from one reducer. */
export function useMarketSim() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  /* ------------------------------ market clock ---------------------------- */

  useEffect(() => {
    if (!state.running) return;
    const iv = setInterval(() => {
      dispatch({ type: "tick" });
    }, TICK_MS);
    return () => clearInterval(iv);
  }, [state.running]);

  /* -------------------------------- actions ------------------------------- */
  /* Defined once — stable identities keep effect deps quiet. */

  const selectStock = useCallback((sym) => dispatch({ type: "select", sym }), []);
  const closePanel = useCallback(() => dispatch({ type: "closePanel" }), []);
  const highlightNews = useCallback((uid) => dispatch({ type: "highlight", uid }), []);
  const clearHighlight = useCallback(() => dispatch({ type: "clearHighlight" }), []);
  const startSession = useCallback((scenarioId, replayId, timeMode, style) => dispatch({ type: "start", scenarioId, replayId, timeMode, style }), []);
  const clearFeedback = useCallback(() => dispatch({ type: "clearFeedback" }), []);
  const clearReport = useCallback(() => dispatch({ type: "clearReport" }), []);
  const endSession = useCallback(() => dispatch({ type: "end" }), []);
  const dismissToast = useCallback((id) => dispatch({ type: "dismissToast", id }), []);
  const trade = useCallback((sym, side, qty) => dispatch({ type: "trade", sym, side, qty }), []);

  const actions = useMemo(
    () => ({ selectStock, closePanel, highlightNews, clearHighlight, startSession, trade, endSession, clearFeedback, clearReport, dismissToast }),
    [selectStock, closePanel, highlightNews, clearHighlight, startSession, trade, endSession, clearFeedback, clearReport, dismissToast],
  );

  return { state, actions };
}
