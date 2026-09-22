import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

import { Navbar } from "@/components/app/navbar";
import { Sidebar } from "@/components/app/sidebar";

const EASE = [0.23, 0.86, 0.44, 1];

/**
 * App shell for the authenticated product: collapsible sidebar + sticky
 * navbar + content region with keyed page transitions. The shell owns the
 * collapse state; pages render inside the scrollable content area.
 */
export function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  /* Close the mobile drawer whenever the route changes. */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
