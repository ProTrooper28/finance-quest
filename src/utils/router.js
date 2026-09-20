/**
 * Navigation adapter.
 *
 * App code (pages/components) imports Link and useNavigate from here and
 * stays router-agnostic. The implementation is backed by TanStack Router,
 * which is bundled and wired by the platform build config.
 */
import { Link as TanStackLink, useNavigate as useTanStackNavigate } from "@tanstack/react-router";

export { TanStackLink as Link };

/**
 * React-Router-style navigate: navigate("/path") or
 * navigate("/path", { replace: true }).
 */
export function useNavigate() {
  const navigate = useTanStackNavigate();
  return (to, options = {}) => navigate({ to, ...options });
}
