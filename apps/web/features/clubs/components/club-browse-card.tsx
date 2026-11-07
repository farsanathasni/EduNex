import Link from "next/link";
import type { ReactNode } from "react";

import type { Club } from "@/features/clubs/api/clubs";

const clubThemes = [
  "from-blue-600 via-indigo-600 to-indigo-800",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-violet-600 via-purple-600 to-fuchsia-700",
  "from-amber-500 via-orange-600 to-red-600",
  "from-sky-500 via-blue-600 to-indigo-700",
];

function BuildingIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 21h16" />
      <path d="M6 21V5l6-2 6 2v16" />
      <path d="M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01" />
      <path d="M10 21v-4h4v4" />
    </svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ClubBrowseCard({
  club,
  departmentLabel,
  badge = "Campus club",
  href,
  actionLabel = "View Details",
  footer,
}: {
  club: Club;
  departmentLabel?: string | null;
  badge?: string;
  href?: string;
  actionLabel?: string;
  footer?: ReactNode;
}) {
  const initial = club.name.trim().charAt(0).toUpperCase() || "C";
  const theme = clubThemes[Math.abs(club.id) % clubThemes.length];
  const resolvedDepartmentLabel =
    departmentLabel !== undefined
      ? departmentLabel
      : club.departmentId === null
        ? "Campus-wide"
        : undefined;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <div
        className={`relative flex h-44 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${theme}`}
      >
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[20px] border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        <span className="relative text-6xl font-black tracking-tight text-white/90">
          {initial}
        </span>
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="min-h-6">
          {resolvedDepartmentLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-subtle px-2.5 py-1 text-[11px] font-bold text-primary">
              <BuildingIcon className="h-3 w-3" />
              <span className="line-clamp-1">{resolvedDepartmentLabel}</span>
            </span>
          )}
        </div>

        <h2 className="mt-2 line-clamp-1 text-lg font-extrabold tracking-tight text-text transition group-hover:text-primary">
          {club.name}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-text-muted">
          {club.description ||
            "Explore this campus community and discover what makes it special."}
        </p>

        {(footer || href) && (
          <div className="mt-auto pt-6">
            {footer ??
              (href && (
                <Link
                  href={href}
                  className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary-subtle"
                >
                  <span>{actionLabel}</span>
                  <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function ClubBrowseCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-3xl border border-border bg-surface"
    >
      <div className="h-44 animate-pulse bg-secondary" />
      <div className="p-5 sm:p-6">
        <div className="h-6 w-24 animate-pulse rounded-full bg-secondary" />
        <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-secondary" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-secondary" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-secondary" />
        <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-secondary" />
      </div>
    </div>
  );
}
