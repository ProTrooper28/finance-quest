import { useLocation } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { NAV_SECTIONS, dataIcon } from "@/data/app";
import { Link, useNavigate } from "@/utils/router";
import { cn, storage } from "@/utils";

/**
 * Collapsible left sidebar. Sections with icons + labels, active highlight,
 * hover states, and logout at the bottom. Labels collapse to icons-only on
 * desktop; the mobile variant is a slide-over drawer.
 */
export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = () => {
    storage.clear("finquest-user");
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Desktop rail */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[68px]" : "w-[248px]",
        )}
      >
        <div className={cn("flex h-16 flex-none items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-8 flex-none place-items-center rounded-lg bg-brand-duo text-[13px] font-semibold text-white">
              FQ
            </span>
            {!collapsed ? <span className="text-[15px] font-semibold tracking-tight text-foreground">FinQuest</span> : null}
          </Link>
          {!collapsed ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="Collapse sidebar"
              className="ml-auto grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <PanelLeftClose className="size-4" />
            </button>
          ) : null}
        </div>

        <SidebarNav pathname={pathname} collapsed={collapsed} />

        <div className="mt-auto flex-none border-t border-border p-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleCollapsed}
                aria-label="Expand sidebar"
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <PanelLeftOpen className="size-4" />
              </button>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleCollapsed}
                className="flex flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                <PanelLeftOpen className="size-4" /> Collapse
              </button>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 0.86, 0.44, 1] }}
            className="relative flex h-full w-[264px] flex-col border-r border-border bg-sidebar"
          >
            <div className="flex h-16 flex-none items-center justify-between border-b border-border px-4">
              <Link to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-brand-duo text-[13px] font-semibold text-white">FQ</span>
                <span className="text-[15px] font-semibold tracking-tight text-foreground">FinQuest</span>
              </Link>
              <button
                type="button"
                onClick={onToggleCollapsed && onCloseMobile}
                aria-label="Close menu"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>
            <SidebarNav pathname={pathname} collapsed={false} onNavigate={onCloseMobile} />
            <div className="mt-auto border-t border-border p-3">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" /> Log out
              </button>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </>
  );
}

function SidebarNav({ pathname, collapsed, onNavigate }) {
  return (
    <nav className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-2.5" : "px-3")}>
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="mb-5 last:mb-0">
          {!collapsed ? (
            <p className="mb-1.5 px-2.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted-foreground/70">
              {section.label}
            </p>
          ) : (
            <div className="mx-auto mb-2.5 h-px w-6 bg-border" />
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = dataIcon(item.icon);
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "nav-item h-9",
                      collapsed && "justify-center px-0",
                      active && "nav-item-active",
                    )}
                  >
                    <Icon className="size-4 flex-none" />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
