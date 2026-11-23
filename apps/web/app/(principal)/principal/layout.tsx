"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import LogoutButton from "@/features/auth/components/logout-button";
import { useAccess } from "@/lib/navigation/access";
import { NotificationBell } from "@/features/notifications/api/components/notification-bell";


export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { navItems } = useAccess();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItems = navItems
  .filter(
    (item) =>
      item.href.startsWith("/principal") ||
      item.href.startsWith("/attendance/principal")||
      item.href.startsWith("/announcement/principal"),
  )
    .map((item) => ({
      ...item,
      label:
        item.href === "/principal/students"
          ? "Student Management"
          : item.label,
    }));

  const pageDetails: Record<string, { title: string; subtitle: string }> = {
    "/principal/issues": {
      title: "Issues",
      subtitle: "Track issues sent across the college",
    },
    "/principal/issues/new": {
      title: "New Issue",
      subtitle: "Raise a concern with the right person",
    },
    "/principal/issues/detail": {
      title: "Issue Thread",
      subtitle: "Review replies and updates",
    },
  };

  const currentPage =
    pageDetails[pathname]
    ?? (pathname.startsWith("/principal/issues/")
      ? pageDetails["/principal/issues/detail"]
      : {
          title: "Principal Portal",
          subtitle: "College administration and management",
        });

  return (
    <RouteGuard roles={["super-admin"]}>
    <div className="min-h-screen bg-background text-text md:flex">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold text-primary">
            EduNex
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Principal Administration
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Administration
          </p>

          {menuItems.map((item) => {
            const active =
              item.href === "/principal"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <LogoutButton />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface px-4 py-4 sm:px-6">
  <button
    type="button"
    onClick={() => setMobileMenuOpen(true)}
    aria-label="Open navigation menu"
    className="rounded-lg border border-border px-3 py-2 md:hidden"
  >
    ☰
  </button>

  <div className="min-w-0 flex-1">
    <p className="font-semibold">{currentPage.title}</p>
    <p className="text-xs text-text-muted">{currentPage.subtitle}</p>
  </div>

  <NotificationBell role="principal" />
</header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
    </RouteGuard>
  );
}
