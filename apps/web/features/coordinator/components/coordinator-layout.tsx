
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import {
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAccess } from "@/lib/navigation/access";
import { ModeSwitch } from "@/components/layout/mode-switch";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/button";

export default function CoordinatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { getNavItems, mode, isSuperAdmin } = useAccess();

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navigation = getNavItems(mode)
    .filter(
      (item) =>
        item.href === "/dashboard" ||
        item.href.startsWith("/club-coordinator/"),
    )
    .map((item) => ({
      ...item,
      name:
        item.href === "/dashboard"
          ? "Dashboard"
          : item.href === "/club-coordinator/events"
            ? "Browse Events"
            : item.label,
      icon:
        item.href === "/dashboard"
          ? "\u25a6"
          : item.href === "/club-coordinator/events"
            ? "\u25f7"
            : item.href === "/club-coordinator/membership-requests" ||
                item.href === "/club-coordinator/members"
              ? "\u{1f465}"
              : item.icon,
    }));

  const currentPage =
    navigation.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/dashboard" &&
          pathname.startsWith(`${item.href}/`)),
    )?.name ?? "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out md:w-64 md:translate-x-0 md:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              E
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                EduNex
              </h1>
              <p className="text-xs text-slate-500">
                Campus Management
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center text-lg">
                    {item.icon}
                  </span>

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="hidden p-4 md:block">
          <div className="rounded-2xl bg-indigo-50 p-3">
            <p className="text-sm font-semibold text-indigo-900">
              Campus activities
            </p>

            <p className="mt-1 text-xs leading-5 text-indigo-700">
              Manage events and keep your campus community connected.
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            EduNex © 2026
          </p>
        </div>

        {/* Logout */}
        <div className="border-t border-slate-100 p-4">
          <Button
            type="button"
            onClick={handleLogout}
            className="!flex !w-full !items-center !justify-center gap-3 rounded-xl px-4 py-3"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 md:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">

          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-xs text-slate-500">
                Club Coordinator / {currentPage}
              </p>

              <h2 className="mt-1 truncate text-lg font-semibold text-slate-900">
                {currentPage}
              </h2>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ModeSwitch />

            {(mode === "coordinator" || isSuperAdmin) && (
              <Link
                href="/club-coordinator/profile"
                className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-50 sm:gap-3"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    Alex Johnson
                  </p>

                  <p className="text-xs text-slate-500">
                    Club Coordinator
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                  AJ
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
