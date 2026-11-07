
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccess } from "@/lib/navigation/access";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const {
    navItems,
    isPending,
    unauthorized,
  } = useAccess();

  const navigation = navItems.filter((item) =>
    item.href.startsWith("/teacher")
  );

  const isActive = (href: string) =>
    href === "/teacher"
      ? pathname === href
      : pathname.startsWith(href);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading teacher workspace...</p>
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
    <div className="min-h-screen bg-background text-text">

      {/* Sidebar */}
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

      {/* Main content */}
      <div className="lg:pl-[250px]">

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-surface px-5 sm:px-8">
          <div>
            <p className="text-xs text-muted">
              EduNex / Teacher Workspace
            </p>

            <h2 className="font-semibold">
              {navigation.find((item) => isActive(item.href))?.label ??
                "Teacher Portal"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">Faculty</p>
              <p className="text-xs text-muted">Teacher Account</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-semibold text-primary">
              T
            </div>
          </div>
        </header>

        {/* Mobile navigation */}
        <nav className="flex gap-2 overflow-x-auto border-b border-border bg-surface px-4 py-3 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                isActive(item.href)
                  ? "bg-primary-subtle font-medium text-primary"
                  : "text-muted hover:bg-background"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
