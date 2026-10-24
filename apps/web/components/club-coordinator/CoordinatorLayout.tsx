
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { name: "Dashboard", href: "/club-coordinator/dashboard", icon: "▦" },
  { name: "Browse Events", href: "/club-coordinator/events", icon: "◷" },
  { name: "Request for Event", href: "/club-coordinator/request-event", icon: "+" },
  { name: "Profile", href: "/club-coordinator/profile", icon: "♙" },
];

export default function CoordinatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const currentPage =
    navigation.find((item) => item.href === pathname)?.name ?? "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="flex w-full flex-col border-b border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            E
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              EduNex
            </h1>
            <p className="text-xs text-slate-500">Campus Management</p>
          </div>
        </div>

        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center text-lg">
                    {item.icon}
                  </span>
                  {item.name}
                  {active && (
                    <span className="ml-auto hidden h-2 w-2 rounded-full bg-indigo-600 md:block" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto hidden p-4 md:block">
          <div className="rounded-2xl bg-indigo-50 p-4">
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
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs text-slate-500">Club Coordinator / {currentPage}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {currentPage}
            </h2>
          </div>

          <Link
            href="/club-coordinator/profile"
            className="flex items-center gap-3 rounded-xl p-1 hover:bg-slate-50"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Alex Johnson
              </p>
              <p className="text-xs text-slate-500">Club Coordinator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              AJ
            </div>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
