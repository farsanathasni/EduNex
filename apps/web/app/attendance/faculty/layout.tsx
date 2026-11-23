
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { useAccess } from "@/lib/navigation/access";
import { RouteGuard } from "@/features/auth/components/route-guard";
import { NotificationBell } from "@/features/notifications/api/components/notification-bell";

export default function FacultyAttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { navItems, isPending, unauthorized } = useAccess();

  const navigation = navItems.filter(
    (item) =>
      item.href.startsWith("/teacher") ||
      item.href === "/attendance/faculty",
  );

  const isActive = (href: string) =>
    href === "/teacher"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const activeItem = navigation.find((item) => isActive(item.href));

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading faculty workspace...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">
          Please sign in to access your workspace.
        </p>
      </div>
    );
  }

  return (
    <RouteGuard roles={["faculty", "super-admin"]}>
    <div className="min-h-screen bg-background text-text">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] border-r border-border bg-surface lg:block">
        <div className="flex h-20 items-center gap-3 border-b border-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
            E
          </div>

          <div>
            <h1 className="text-lg font-bold">EduNex</h1>
            <p className="text-xs text-muted">Teacher Portal</p>
          </div>
        </div>

        <div className="px-4 py-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-primary-subtle text-primary"
                      : "text-muted hover:bg-background hover:text-text"
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
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-surface px-4 sm:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-background lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <div>
              <p className="text-xs text-muted">
                EduNex / Teacher Workspace
              </p>

              <h2 className="font-semibold">
                {activeItem?.label ?? "Faculty Portal"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell role="faculty" />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">Faculty</p>
              <p className="text-xs text-muted">Teacher Account</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-semibold text-primary">
              T
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 z-30 border-b border-border bg-surface p-4 shadow-lg lg:hidden">
            <div className="mb-3 px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Workspace
              </p>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                      active
                        ? "bg-primary-subtle text-primary"
                        : "text-muted hover:bg-background hover:text-text"
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
          </div>
        )}

        {/* Page Content */}
        <main className="mx-auto max-w-[1500px] p-3 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
    </RouteGuard>
  );
}
