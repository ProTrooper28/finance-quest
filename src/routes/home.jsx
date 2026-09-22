import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy entry — the app shell dashboard replaced the three-card home. */
export const Route = createFileRoute("/home")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard", replace: true });
  },
});
