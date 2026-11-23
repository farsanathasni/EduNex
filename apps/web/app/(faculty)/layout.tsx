
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import LogoutButton from "@/features/auth/components/logout-button";
import { useAccess } from "@/lib/navigation/access";
import { NotificationBell } from "@/features/notifications/api/components/notification-bell";

function TeacherLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { navItems, isPending, unauthorized } = useAccess();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = navItems.filter(
    (item) =>
      item.href.startsWith("/teacher") ||
      item.href === "/attendance/faculty" ||
      item.href === "/announcement/faculty",
  );

  const activeHref = menuItems.reduce<string | null>(
    (best, item) => {
      const matches =
        item.href === "/teacher"
          ? pathname === item.href
          : pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

      if (!matches) return best;

      return !best || item.href.length > best.length
        ? item.href
        : best;
    },
    null,
  );

  const getPageTitle = () => {
    if (pathname === "/teacher/notifications") {
      return {
        title: "Notifications",
        description: "Stay up to date with campus activity",
      };
    }

    if (pathname === "/attendance/faculty") {
      return {
        title: "Event Attendance Reports",
        description: "View event attendance records",
      };
    }

    if (pathname.startsWith("/attendance/faculty/")) {
      return {
        title: "Event Attendance",
        description: "View event attendance details",
      };
    }

    if (pathname === "/announcement/faculty") {
      return {
        title: "Announcements",
        description: "Stay informed with campus announcements",
      };
    }

    return {
      title:
        menuItems.find((item) => item.href === activeHref)
          ?.label ?? "Teacher Portal",
      description: "Teacher workspace and academic activities",
    };
  };

  const pageTitleMap: Record<string, string> = {
    "/teacher/issues": "Issues",
    "/teacher/issues/new": "New Issue",
    "/teacher/issues/detail": "Issue Thread",
    "/teacher/lost-found": "Lost & Found",
    "/teacher/lost-found/new": "Report Found Item",
    "/teacher/lost-found/my-claims": "My Claims",
    "/teacher/lost-found/detail": "Item Details",
  };

  const headerTitle =
  pageTitleMap[pathname] ??
  (pathname.startsWith("/teacher/issues/")
    ? pageTitleMap["/teacher/issues/detail"]
    : pathname.startsWith("/teacher/lost-found/")
      ? pageTitleMap["/teacher/lost-found/detail"]
      : null) ??
  (pathname === "/teacher/notifications"
    ? "Notifications"
    : menuItems.find((item) => item.href === activeHref)?.label ??
      "Teacher Portal");

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">
          Loading teacher workspace...
        </p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">
          Please sign in to access your workspace.
        </p>
      </div>
    );
  }

  const pageInfo = getPageTitle();

  return (
    <div className="min-h-screen bg-background text-text md:flex">

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Branding */}
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-xl font-extrabold text-primary-foreground shadow-sm">
              E
            </div>

            <div>
              <h1 className="text-2xl font-bold text-primary">
                EduNex
              </h1>

              <p className="mt-0.5 text-sm text-text-muted">
                Teacher Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Teacher Workspace
          </p>

          {menuItems.map((item) => {
            const active = item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                <span className="flex w-5 items-center justify-center text-lg">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <LogoutButton className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm font-medium text-text transition hover:bg-background disabled:opacity-50" />
        </div>
      </aside>

      {/* Main workspace */}
      <div className="min-w-0 flex-1">

        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface/95 px-4 py-4 backdrop-blur-md sm:px-6">

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg border border-border px-3 py-2 text-lg transition hover:bg-background md:hidden"
          >
            ☰
          </button>

          {/* Page information */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-text">
              {pageInfo.title}
            </p>

            <h2 className="font-semibold">{headerTitle}</h2>
            <p className="truncate text-xs text-text-muted">
              {pageInfo.description}
            </p>
          </div>

          {/* Notifications */}
          <NotificationBell role="faculty" />
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard roles={["faculty"]}>
      <TeacherLayoutContent>
        {children}
      </TeacherLayoutContent>
    </RouteGuard>
  );
}
