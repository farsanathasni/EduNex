
"use client";

import {
  Menu,
  Search,
} from "lucide-react";

import Button from "@/components/ui/button";

interface StudentHeaderProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  onOpenMobileMenu: () => void;
  canSwitchMode?: boolean;
  onSwitchMode?: () => void;
  onLogout: () => void;
  isSigningOut?: boolean;
  title?: string;
  subtitle?: string;
}

export default function StudentHeader({
  search = "",
  onSearchChange,
  onOpenMobileMenu,
  canSwitchMode = false,
  onSwitchMode,
  onLogout,
  isSigningOut = false,
  title = "Student dashboard",
  subtitle = "Your personal campus space",
}: StudentHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
      <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-label font-bold text-text">{title}</p>
            <p className="hidden text-caption text-text-muted sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {onSearchChange && (
            <div className="relative hidden md:block">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search events"
                aria-label="Search events"
                className="w-40 rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-label text-text outline-none transition placeholder:text-text-subtle hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 lg:w-56"
              />
            </div>
          )}

          {canSwitchMode && onSwitchMode && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onSwitchMode}
            >
              <span className="sm:hidden">Coordinator</span>
              <span className="hidden sm:inline">
                Switch to coordinator
              </span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onLogout}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing out..." : "Log out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
