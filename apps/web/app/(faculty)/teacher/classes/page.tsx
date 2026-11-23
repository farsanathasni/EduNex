"use client";

import { useTeacherClassesQuery } from "@/features/teacher/api/teacher-query";

/* ---------- Icons (inline, no extra dependency) ---------- */

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

/* ---------- Shared header ---------- */

function PageHeader({ count }: { count?: number }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Classes
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          View the semesters available in your department.
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
              {count === 1 ? "Semester" : "Semesters"} available
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Loading skeleton ---------- */

function TeacherClassesSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-8 w-44 rounded-md bg-border" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-border" />
        </div>
        <div className="h-16 w-44 rounded-xl bg-border" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-border" />
              <div className="h-6 w-20 rounded-full bg-border" />
            </div>
            <div className="mt-6 h-6 w-36 rounded bg-border" />
            <div className="mt-3 h-4 w-44 rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function TeacherClassesPage() {
  const { data, isLoading, isError, refetch } = useTeacherClassesQuery();

  if (isLoading) {
    return <TeacherClassesSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeader />
        <div
          role="alert"
          className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-12 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertIcon />
          </span>
          <h2 className="mt-4 text-base font-semibold">
            Couldn&apos;t load your classes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader count={data?.length} />

      {!data?.length ? (
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
            <BookIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-base font-semibold">No semesters yet</h2>
          <p className="mt-1 text-sm text-muted">
            Semesters appear here once students are added to your department.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <li key={item.semester}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                {/* Accent bar */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                />

                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-xl font-bold text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                    {item.semester}
                  </span>
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted">
                    Department
                  </span>
                </div>

                <h2 className="mt-6 text-lg font-semibold tracking-tight">
                  Semester {item.semester}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Students enrolled in this semester.
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
