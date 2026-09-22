/**
 * Navigation adapter.
 *
 * App code (pages/components) imports Link and useNavigate from here and
 * stays router-agnostic. The implementation is backed by TanStack Router,
 * which is bundled and wired by the platform build config.
 */
import { useCallback } from "react";
import { Link as TanStackLink, useNavigate as useTanStackNavigate } from "@tanstack/react-router";

export { TanStackLink as Link };

/**
 * React-Router-style navigate: navigate("/path") or
 * navigate("/path", { replace: true }).
 *
 * The returned function is referentially stable (useCallback), so it is safe
 * to use in effect dependency arrays — an unstable identity here re-triggers
 * effects on every render.
 */
export function useNavigate() {
  const navigate = useTanStackNavigate();
  return useCallback((to, options = {}) => navigate({ to, ...options }), [navigate]);
}
