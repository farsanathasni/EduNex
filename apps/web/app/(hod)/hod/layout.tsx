
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RouteGuard } from "@/features/auth/components/route-guard";
import LogoutButton from "@/features/auth/components/logout-button";
import { useAccess } from "@/lib/navigation/access";
import { NotificationBell } from "@/features/notifications/api/components/notification-bell";
import PortalHeader from "@/components/layout/portal-header";


export default function HodLayout({
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
    item.href.startsWith("/hod/") ||
    item.href === "/attendance/hod" ||
    item.href === "/announcement/hod",
)    .map((item) => ({
      ...item,
      label:
        item.href === "/hod/students"
          ? "Student Management"
          : item.href === "/hod/coordinators"
            ? "Coordinator Management"
            : item.href === "/hod/clubs"
              ? "Club Management"
              : item.label,
      icon:
        item.href === "/hod/coordinators"
          ? "\u2659"
          : item.href === "/hod/clubs"
            ? "\u25a6"
            : item.icon,
      }));

  const pageDetails: Record<string, { title: string; subtitle: string }> = {
    "/announcement/hod": {
      title: "Announcements",
      subtitle: "Stay updated with campus, department and club news",
    },
    "/hod/notifications": {
      title: "Notifications",
      subtitle: "Stay up to date with campus activity",
    },
    "/attendance/hod": {
      title: "Event Attendance Reports",
      subtitle: "View department event attendance",
    },
    "/hod/issues": {
      title: "Issues",
      subtitle: "Track issues raised by your department",
    },
    "/hod/issues/new": {
      title: "New Issue",
      subtitle: "Raise a concern with the right person",
    },
    "/hod/issues/detail": {
      title: "Issue Thread",
      subtitle: "Review replies and updates",
    },
    "/hod/lost-found": {
      title: "Lost & Found",
      subtitle: "Campus-wide lost and found items",
    },
    "/hod/lost-found/new": {
      title: "Report Found Item",
      subtitle: "Add photos and verification questions",
    },
    "/hod/lost-found/my-claims": {
      title: "My Claims",
      subtitle: "Track claims you submitted",
    },
    "/hod/lost-found/detail": {
      title: "Item Details",
      subtitle: "Review the item and claim activity",
    },
  };

  const currentPage =
    pageDetails[pathname]
    ?? (pathname.startsWith("/attendance/hod/")
      ? {
          title: "Event Attendance",
          subtitle: "View department event attendance",
        }
      : pathname.startsWith("/hod/issues/")
        ? pageDetails["/hod/issues/detail"]
        : pathname.startsWith("/hod/lost-found/")
          ? pageDetails["/hod/lost-found/detail"]
          : {
              title: "HOD Portal",
              subtitle: "Department management and administration",
            });

  return (
    <RouteGuard roles={["hod"]}>
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
            HOD Administration
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            HOD Workspace
          </p>

          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
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
        <PortalHeader
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          breadcrumb="HOD Portal"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          mobileMenuExpanded={mobileMenuOpen}
          notifications={<NotificationBell role="hod" />}
        />

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
    </RouteGuard>
  );
}
