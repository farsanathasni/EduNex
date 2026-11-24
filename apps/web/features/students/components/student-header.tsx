"use client";

import {
  useRegisterHeaderSearch,
} from "@/components/layout/header-search";
import PortalHeader from "@/components/layout/portal-header";
import Button from "@/components/ui/button";
import { NotificationBell } from "@/features/notifications/api/components/notification-bell";

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
  useRegisterHeaderSearch(
    onSearchChange
      ? {
          value: search,
          onChange: onSearchChange,
          placeholder: "Search events",
        }
      : null,
  );

  return (
    <PortalHeader
      title={title}
      subtitle={subtitle}
      breadcrumb="Student Portal"
      onOpenMobileMenu={onOpenMobileMenu}
      menuBreakpoint="lg"
      notifications={<NotificationBell role="student" />}
      switchButton={
        canSwitchMode && onSwitchMode ? (
          <Button type="button" variant="primary" size="md" onClick={onSwitchMode}>
            <span className="sm:hidden">Coordinator</span>
            <span className="hidden sm:inline">Switch to coordinator</span>
          </Button>
        ) : null
      }
      actions={
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onLogout}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out..." : "Log out"}
        </Button>
      }
    />
  );
}
