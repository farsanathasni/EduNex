
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/teacher",
    icon: "LayoutDashboard",
  },
  {
    label: "My Classes",
    href: "/teacher/classes",
    icon: "BookOpen",
  },
  {
    label: "My Students",
    href: "/teacher/students",
    icon: "Users",
  },
  {
    label: "Study Materials",
    href: "/teacher/study-materials",
    icon: "FileText",
  },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-text">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-border bg-surface lg:block">
        <div className="flex h-20 items-center border-b border-border px-7">
          <h1 className="text-xl font-bold text-primary">EduNex</h1>
          <span className="ml-2 rounded-md bg-primary-subtle px-2 py-1 text-xs font-medium text-primary">
            Faculty
          </span>
        </div>

        <div className="px-4 py-7">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Teacher workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active =
                item.href === "/teacher"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

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
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-surface px-5 sm:px-8">
          <div>
            <p className="text-sm text-muted">EduNex / Faculty</p>
            <h2 className="font-semibold">Teacher Portal</h2>
          </div>

          <span className="rounded-full bg-primary-subtle px-4 py-2 text-sm font-medium text-primary">
            Faculty
          </span>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b border-border bg-surface px-4 py-3 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                pathname === item.href
                  ? "bg-primary-subtle text-primary"
                  : "text-muted"
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
