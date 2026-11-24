"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import {
  useTeacherClassesQuery,
  useTeacherStudentsQuery,
} from "@/features/teacher/api/teacher-query";

const PAGE_SIZE = 10;

/* ---------- Helpers ---------- */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

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

function UsersIcon({ className = "h-5 w-5" }: { className?: string }) {
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
      <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" />
      <circle cx="10" cy="8" r="3.5" />
      <path d="M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.65a3.5 3.5 0 0 1 0 6.7" />
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

/* ---------- Skeleton ---------- */

function TeacherStudentsSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="bg-background px-5 py-4">
          <div className="h-4 w-full max-w-md rounded bg-border" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-t border-border px-5 py-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-border" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-border" />
              <div className="h-3 w-28 rounded bg-border" />
            </div>
            <div className="hidden h-6 w-24 rounded-full bg-border md:block" />
            <div className="hidden h-4 w-28 rounded bg-border md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);

  // Wait until the user pauses typing before searching
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const selectedSemester = semester ? Number(semester) : undefined;

  const { data, isLoading, isFetching, isError, refetch } =
    useTeacherStudentsQuery({
      search: debouncedSearch,
      semester: selectedSemester,
      page,
      limit: PAGE_SIZE,
    });

  const { data: classes } = useTeacherClassesQuery();

  const students = data?.students ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const currentPage = pagination?.page ?? page;
  const hasFilters = search.trim().length > 0 || selectedSemester !== undefined;

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSemester("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Students
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Search and browse the students in your department.
          </p>
        </div>

        {!isLoading && !isError && (
          <div className="inline-flex items-center gap-3 self-start rounded-xl border border-border bg-surface px-4 py-3 sm:self-auto">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-primary">
              <UsersIcon className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-semibold">{total}</p>
              <p className="text-xs text-muted">
                {total === 1 ? "Student" : "Students"}
                {hasFilters ? " found" : " in total"}
              </p>
            </div>
          </div>
        )}
      </header>

      {
        <>
          {/* Filters (always mounted so the search box keeps focus) */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or admission number"
                aria-label="Search students"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by semester"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-48"
            >
              <option value="">All semesters</option>
              {classes?.map((item) => (
                <option key={item.semester} value={item.semester}>
                  Semester {item.semester}
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

          {/* Content */}
          {isLoading ? (
            <TeacherStudentsSkeleton />
          ) : isError ? (
            <div
              role="alert"
              className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-12 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <AlertIcon />
              </span>
              <h2 className="mt-4 text-base font-semibold">
                Couldn&apos;t load students
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
          ) : !students.length ? (
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <UsersIcon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-base font-semibold">
                No students found
              </h2>
              <p className="mt-1 text-sm text-muted">
                {hasFilters
                  ? "Try a different search or semester."
                  : "Students will appear here once they join your department."}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 text-sm font-medium text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div
              className={`overflow-hidden rounded-2xl border border-border bg-surface transition-opacity ${
                isFetching ? "opacity-60" : "opacity-100"
              }`}
            >
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-muted">
                    <tr>
                      <th className="px-6 py-3.5 font-medium">Student</th>
                      <th className="px-6 py-3.5 font-medium">
                        Admission number
                      </th>
                      <th className="px-6 py-3.5 font-medium">Semester</th>
                      <th className="px-6 py-3.5 font-medium">Phone</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="transition-colors hover:bg-background"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary">
                              {getInitials(student.name)}
                            </span>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono text-[13px] text-muted">
                          {student.admissionNumber}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-primary-subtle px-2.5 py-1 text-xs font-medium text-primary">
                            Semester {student.semester}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-muted">
                          {student.phone || (
                            <span className="text-muted/60">Not provided</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <ul className="divide-y divide-border md:hidden">
                {students.map((student) => (
                  <li key={student.id} className="flex items-start gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary">
                      {getInitials(student.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-medium">{student.name}</p>
                        <span className="shrink-0 rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-medium text-primary">
                          Sem {student.semester}
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-muted">
                        {student.admissionNumber}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {student.phone || "Phone not provided"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && total > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
              <p className="text-muted">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of <span className="font-medium text-foreground">{total}</span>{" "}
                students
              </p>

              <div className="flex items-center gap-3">
                <span className="text-muted">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isFetching}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      }
    </div>
  );
}
