"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { HeaderSearchSlot, useHeaderSearchContext } from "@/components/layout/header-search";
import Button from "@/components/ui/button";

type PortalHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  onOpenMobileMenu?: () => void;
  mobileMenuExpanded?: boolean;
  menuBreakpoint?: "md" | "lg";
  notifications?: ReactNode;
  switchButton?: ReactNode;
  actions?: ReactNode;
  userMenu?: ReactNode;
  className?: string;
};

export default function PortalHeader({
  title,
  subtitle,
  breadcrumb,
  onOpenMobileMenu,
  mobileMenuExpanded,
  menuBreakpoint = "md",
  notifications,
  switchButton,
  actions,
  userMenu,
  className = "",
}: PortalHeaderProps) {
  const { config } = useHeaderSearchContext();
  const menuHiddenClass = menuBreakpoint === "lg" ? "lg:hidden" : "md:hidden";
  const searchHiddenClass = menuBreakpoint === "lg" ? "hidden lg:block" : "hidden md:block";

  return (
    <header
      className={`sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur ${className}`}
    >
      <div className="page-container flex min-h-[76px] flex-wrap items-center gap-3 py-3">
        {onOpenMobileMenu ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuExpanded}
            onClick={onOpenMobileMenu}
            className={`shrink-0 border border-border ${menuHiddenClass}`}
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </Button>
        ) : null}

        <div className="min-w-0 flex-1">
          {breadcrumb ? (
            <p className="hidden truncate text-caption text-text-muted sm:block">
              {breadcrumb}
            </p>
          ) : null}
          <p className="truncate text-label font-bold text-text">{title}</p>
          {subtitle ? (
            <p className="hidden truncate text-caption text-text-muted sm:block">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          <HeaderSearchSlot
            className={`w-40 min-w-0 lg:w-56 ${searchHiddenClass}`}
          />
          {switchButton}
          {actions}
          {notifications}
          {userMenu}
        </div>
      </div>

      {config ? (
        <div className="page-container pb-3 md:hidden">
          <HeaderSearchSlot className="w-full" />
        </div>
      ) : null}
    </header>
  );
}
