"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";

import Button from "@/components/ui/button";
import { useAccess } from "@/lib/navigation/access";
import { useMyTeachingSubjectsQuery } from "@/features/class-attendance/api/class-attendance-query";
import type { ClassSubject } from "@/features/class-attendance/api/class-attendance";

/* ---------- Icons (inline, no extra dependency) ---------- */

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

/* ---------- Helpers ---------- */

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (error.response?.status === 401) return "Please sign in to continue.";
    if (typeof msg === "string" && msg) return msg;
    if (error.response?.status === 403) return "You don't have access.";
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

/* ---------- Shared pieces ---------- */

function PageHeader({ count }: { count?: number }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Subjects
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Pick a subject to take class attendance.
        </p>
      </div>

      {typeof count === "number" && count > 0 && (
        <div className="inline-flex items-center gap-3 self-start rounded-xl border border-border bg-surface px-4 py-3 sm:self-auto">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-primary">
            <BookIcon className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-lg font-semibold">{count}</p>
            <p className="text-xs text-muted">
              {count === 1 ? "Subject" : "Subjects"} assigned
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl space-y-6 p-6">{children}</div>;
}

function StateCard({
  icon,
  title,
  message,
  tone = "neutral",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  tone?: "neutral" | "error";
  children?: React.ReactNode;
}) {
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : undefined}
      className={`mx-auto flex max-w-md flex-col items-center rounded-2xl px-6 py-12 text-center ${
        isError
          ? "border border-red-500/30 bg-red-500/5"
          : "border border-dashed border-border bg-surface"
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          isError
            ? "bg-red-500/10 text-red-500"
            : "bg-primary-subtle text-primary"
        }`}
      >
        {icon}
      </span>
      <h2 className="mt-4 text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

/* ---------- Skeleton ---------- */

function SubjectsSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-8 w-48 rounded-md bg-border" />
          <div className="mt-3 h-4 w-72 max-w-full rounded bg-border" />
        </div>
        <div className="h-16 w-44 rounded-xl bg-border" />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="h-10 flex-1 rounded-lg bg-border" />
          <div className="h-10 w-full rounded-lg bg-border sm:w-48" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 rounded-md bg-border" />
              <div className="h-6 w-24 rounded-full bg-border" />
            </div>
            <div className="mt-5 h-5 w-44 rounded bg-border" />
            <div className="mt-2 h-4 w-28 rounded bg-border" />
            <div className="mt-6 h-10 w-full rounded-lg bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function MySubjectsPage() {
  const { can, isPending: accessPending } = useAccess();
  const allowed = can("class_attendance", "mark");

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");

  const { data, isLoading, isError, error, refetch } =
    useMyTeachingSubjectsQuery(allowed);

  const subjects = useMemo(() => data ?? [], [data]);

  const semesterOptions = useMemo(() => {
    const set = new Set<number>();
    subjects.forEach((s) => set.add(s.semester));
    return Array.from(set).sort((a, b) => a - b);
  }, [subjects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sem = semester ? Number(semester) : undefined;
    return subjects.filter((s) => {
      if (sem !== undefined && s.semester !== sem) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      );
    });
  }, [subjects, search, semester]);

  const hasFilters = search.trim().length > 0 || semester !== "";

  const clearFilters = () => {
    setSearch("");
    setSemester("");
  };

  const takeHref = (subject: ClassSubject) =>
    `/teacher/class-attendance/take?subjectId=${subject.id}`;

  if (accessPending) {
    return (
      <Shell>
        <SubjectsSkeleton />
      </Shell>
    );
  }

  if (!allowed) {
    return (
      <Shell>
        <PageHeader />
        <StateCard
          icon={<AlertIcon />}
          title="No access"
          message="You don't have permission to take class attendance."
        />
      </Shell>
    );
  }

  if (isLoading) {
    return (
      <Shell>
        <SubjectsSkeleton />
      </Shell>
    );
  }

  if (isError) {
    const forbidden = isAxiosError(error) && error.response?.status === 403;
    return (
      <Shell>
        <PageHeader />
        <StateCard
          tone={forbidden ? "neutral" : "error"}
          icon={<AlertIcon />}
          title={forbidden ? "No access" : "Couldn't load your subjects"}
          message={getErrorMessage(error)}
        >
          {!forbidden && (
            <Button onClick={() => void refetch()}>Try again</Button>
          )}
        </StateCard>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader count={subjects.length} />

      {/* Filters */}
      {subjects.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code"
              aria-label="Search subjects"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            aria-label="Filter by semester"
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-48"
          >
            <option value="">All semesters</option>
            {semesterOptions.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition hover:bg-primary-subtle"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {subjects.length === 0 ? (
        <StateCard
          icon={<BookIcon className="h-6 w-6" />}
          title="No subjects assigned"
          message="Subjects will appear here once they're assigned to you."
        />
      ) : filtered.length === 0 ? (
        <StateCard
          icon={<SearchIcon className="h-6 w-6" />}
          title="No matching subjects"
          message="Try a different search or semester."
        >
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        </StateCard>
      ) : (
        <>
          {hasFilters && (
            <p className="text-sm text-muted">
              Showing {filtered.length} of {subjects.length} subjects
            </p>
          )}

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((subject) => (
              <li key={subject.id}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-primary-subtle px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                      {subject.code}
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted">
                      Semester {subject.semester}
                    </span>
                  </div>

                  <h2
                    className="mt-5 line-clamp-2 min-h-[3rem] text-lg font-semibold leading-snug tracking-tight"
                    title={subject.name}
                  >
                    {subject.name}
                  </h2>

                  <div className="mt-6 border-t border-border pt-4">
                    <Link href={takeHref(subject)} className="block">
                      <Button size="sm" className="w-full">
                        <span className="inline-flex items-center justify-center gap-2">
                          <CheckIcon />
                          Take attendance
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Shell>
  );
}
