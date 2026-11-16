
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, GraduationCap } from "lucide-react";

import { useAccess } from "@/lib/navigation/access";

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({
  isOpen,
  onClose,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const { getNavItems } = useAccess();

  const navItems = getNavItems("student");

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-border bg-surface
          transition-transform duration-300
          lg:sticky lg:top-[76px] lg:z-20 lg:h-[calc(100vh-76px)]
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex min-h-[76px] items-center justify-between border-b border-border px-5">
          <Link
            href="/studentDashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-extrabold text-text">
                EduNex
              </p>
              <p className="text-xs text-text-muted">
                Student Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-secondary lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          aria-label="Student navigation"
          className="flex-1 space-y-2 overflow-y-auto px-3 py-6"
        >
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-text-subtle">
            Main Menu
          </p>

          {navItems.map((item) => {
  const isActive =
    pathname === item.href ||
    (item.href !== "/student" &&
      pathname.startsWith(`${item.href}/`));

  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={onClose}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "text-text-muted hover:bg-secondary hover:text-text"
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center text-lg">
        {item.icon}
      </span>

      <span>{item.label}</span>
    </Link>
  );
})}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-xl bg-primary-subtle p-4">
            <p className="text-sm font-bold text-text">
              Welcome, Student!
            </p>
            <p className="mt-1 text-xs leading-5 text-text-muted">
              Stay connected with your campus community.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
