import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Building2, Sparkles } from "lucide-react";

import type { Club } from "@/features/clubs/api/clubs";

const clubThemes = [
  "from-blue-600 via-indigo-600 to-indigo-900",
  "from-orange-500 via-rose-500 to-pink-700",
  "from-emerald-500 via-teal-600 to-cyan-800",
  "from-violet-600 via-purple-600 to-fuchsia-800",
  "from-amber-500 via-orange-600 to-red-700",
  "from-sky-500 via-blue-600 to-indigo-800",
];

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
  const theme =
    clubThemes[Math.abs(club.id) % clubThemes.length];

  const resolvedDepartmentLabel =
    departmentLabel !== undefined
      ? departmentLabel
      : club.departmentId === null
        ? "Campus-wide"
        : undefined;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">

      {/* Club Banner */}
      <div
        className={`relative flex h-48 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br ${theme}`}
      >
        {/* Background pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[28px] border-white/10 transition-transform duration-500 group-hover:scale-110"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/25 bg-white/15 shadow-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          <span className="text-5xl font-black tracking-tight text-white">
            {initial}
          </span>
        </div>

        {/* Category badge */}
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5" />
          {badge}
        </span>

        {/* Decorative bottom line */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20" />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* Department */}
        <div className="min-h-7">
          {resolvedDepartmentLabel && (
            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary-subtle px-3 py-1.5 text-caption font-bold text-primary">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {resolvedDepartmentLabel}
              </span>
            </span>
          )}
        </div>

        {/* Club Name */}
        <h2 className="mt-3 line-clamp-1 break-words text-heading-sm font-extrabold tracking-tight text-text transition-colors duration-200 group-hover:text-primary">
          {club.name}
        </h2>

        {/* Description */}
        <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-label leading-6 text-text-muted">
          {club.description ||
            "Explore this campus community, connect with students and discover exciting opportunities."}
        </p>

        {/* Action */}
        {(footer || href) && (
          <div className="mt-auto pt-6">
            {footer ?? (
              <Link
                href={href!}
                className="group/link flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-label font-bold text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                <span>{actionLabel}</span>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-all group-hover/link:bg-white/15 group-hover/link:text-white">
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </span>
              </Link>
            )}
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
      className="overflow-hidden rounded-3xl border border-border-subtle bg-surface"
    >
      {/* Banner skeleton */}
      <div className="relative flex h-48 animate-pulse items-center justify-center bg-secondary">
        <div className="h-24 w-24 rounded-3xl bg-secondary-hover" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="h-6 w-28 animate-pulse rounded-full bg-secondary" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-secondary" />

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-secondary" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
        </div>

        <div className="h-12 w-full animate-pulse rounded-xl bg-secondary" />
      </div>
    </div>
  );
}
