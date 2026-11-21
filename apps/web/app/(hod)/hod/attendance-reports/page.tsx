"use client";

import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAttendanceOverviewQuery,
  useAttendanceSubjectsQuery,
  useStudentAttendanceDetailQuery,
  useStudentAttendanceReportsQuery,
} from "@/features/attendance-reports/api/attendance-reports-query";
import type { AttendanceOverview } from "@/features/attendance-reports/api/attendance-reports";
import { useAccess } from "@/lib/navigation/access";

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

function InlineBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span>{message}</span>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

function SummaryCards({
  overview,
  isLoading,
  isError,
  error,
  onRetry,
}: {
  overview: AttendanceOverview | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}) {
  if (isError) {
    return (
      <InlineBanner message={getErrorMessage(error)} onRetry={onRetry} />
    );
  }

  if (isLoading || !overview) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Students",
      value: overview.students.toLocaleString(),
      hint: overview.departmentName ?? "All departments",
    },
    {
      label: "Average attendance",
      value: `${overview.averagePercentage}%`,
      hint: `${overview.attended} of ${overview.total} records attended`,
    },
    {
      label: "Below 75%",
      value: overview.belowThreshold.toLocaleString(),
      hint: "Students under the attendance threshold",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <p className="text-xs font-semibold uppercase text-text-muted">
            {card.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-text">{card.value}</p>
          <p className="mt-1 truncate text-xs text-text-muted">{card.hint}</p>
        </Card>
      ))}
    </div>
  );
}

function StudentDetailDialog({
  studentId,
  semester,
  onClose,
}: {
  studentId: number | null;
  semester: number | undefined;
  onClose: () => void;
}) {
  const params = useMemo(() => ({ semester }), [semester]);
  const { data, isLoading, isError, error, refetch } =
    useStudentAttendanceDetailQuery(studentId, params, studentId !== null);

  if (studentId === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-report-title"
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border bg-surface p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="student-report-title"
              className="text-xl font-semibold text-text"
            >
              Attendance breakdown
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {data?.student.name ?? "Loading student details..."}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : isError ? (
            <InlineBanner
              message={getErrorMessage(error)}
              onRetry={() => void refetch()}
            />
          ) : !data || data.subjects.length === 0 ? (
            <Card className="text-center">
              <p className="font-medium">No attendance recorded</p>
              <p className="mt-2 text-sm text-text-muted">
                This student has no class attendance for the selected filters.
              </p>
            </Card>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg bg-secondary px-3 py-2">
                  Roll: {data.student.admissionNumber}
                </span>
                <span className="rounded-lg bg-secondary px-3 py-2">
                  Semester: {data.student.semester}
                </span>
                <span className="rounded-lg bg-secondary px-3 py-2">
                  Overall: {data.overall.attended}/{data.overall.total} (
                  {data.overall.percentage}%)
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-border bg-background text-xs uppercase text-text-muted">
                    <tr>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Sem</th>
                      <th className="p-3">Attended</th>
                      <th className="p-3">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subjects.map((subject) => (
                      <tr
                        key={subject.subjectId}
                        className="border-b border-border last:border-0"
                      >
                        <td className="p-3 font-medium">{subject.subjectName}</td>
                        <td className="p-3 text-text-muted">
                          {subject.subjectCode}
                        </td>
                        <td className="p-3 text-text-muted">
                          {subject.semester}
                        </td>
                        <td className="p-3">
                          {subject.attended}/{subject.total}
                        </td>
                        <td
                          className={`p-3 font-semibold ${
                            subject.belowThreshold
                              ? "text-red-700"
                              : "text-text"
                          }`}
                        >
                          {subject.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function HodAttendanceReportsPage() {
  const { can, isPending: accessPending } = useAccess();
  const canView = can("class_attendance", "report");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [belowThreshold, setBelowThreshold] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const overviewParams = useMemo(
    () => ({ semester: semester ? Number(semester) : undefined }),
    [semester],
  );
  const subjectParams = useMemo(
    () => ({
      semester: semester ? Number(semester) : undefined,
      from: from || undefined,
      to: to || undefined,
    }),
    [semester, from, to],
  );
  const studentParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      semester: semester ? Number(semester) : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
      from: from || undefined,
      to: to || undefined,
      belowThreshold,
      sort: "percentage" as const,
      order: "desc" as const,
      page,
      limit: 10,
    }),
    [debouncedSearch, semester, subjectId, from, to, belowThreshold, page],
  );

  const overviewQuery = useAttendanceOverviewQuery(overviewParams, canView);
  const subjectsQuery = useAttendanceSubjectsQuery(subjectParams, canView);
  const studentsQuery = useStudentAttendanceReportsQuery(
    studentParams,
    canView,
  );

  const clearFilters = () => {
    setSearch("");
    setSemester("");
    setSubjectId("");
    setFrom("");
    setTo("");
    setBelowThreshold(false);
    setPage(1);
  };

  if (accessPending) {
    return <p className="text-text-muted">Checking access...</p>;
  }

  if (!canView) {
    return (
      <Card className="p-6">
        <h1 className="text-xl font-semibold">Class Attendance Reports</h1>
        <p className="mt-2 text-text-muted">You don&apos;t have access.</p>
      </Card>
    );
  }

  const students = studentsQuery.data?.students ?? [];
  const pagination = studentsQuery.data?.pagination;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">
          Class Attendance Reports
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Monitor class attendance across your department.
        </p>
      </div>

      <SummaryCards
        overview={overviewQuery.data}
        isLoading={overviewQuery.isLoading}
        isError={overviewQuery.isError}
        error={overviewQuery.error}
        onRetry={() => void overviewQuery.refetch()}
      />

      <Card className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or roll number"
            aria-label="Search students"
          />
          <select
            value={semester}
            onChange={(event) => {
              setSemester(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by semester"
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          >
            <option value="">All semesters</option>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                Semester {value}
              </option>
            ))}
          </select>
          <select
            value={subjectId}
            onChange={(event) => {
              setSubjectId(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by subject"
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
          >
            <option value="">All subjects</option>
            {subjectsQuery.data?.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectCode} - {subject.subjectName}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value);
              setPage(1);
            }}
            aria-label="Attendance from date"
          />
          <Input
            type="date"
            value={to}
            onChange={(event) => {
              setTo(event.target.value);
              setPage(1);
            }}
            aria-label="Attendance to date"
          />
          <label className="flex items-center gap-2 self-center text-sm text-text">
            <input
              type="checkbox"
              checked={belowThreshold}
              onChange={(event) => {
                setBelowThreshold(event.target.checked);
                setPage(1);
              }}
              className="h-4 w-4 rounded border-border"
            />
            Below 75% only
          </label>
        </div>

        {subjectsQuery.isError && (
          <InlineBanner
            message={getErrorMessage(subjectsQuery.error)}
            onRetry={() => void subjectsQuery.refetch()}
          />
        )}
        {subjectsQuery.isLoading && (
          <div className="grid gap-2 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        )}
        <Button variant="secondary" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      </Card>

      {studentsQuery.isError ? (
        <InlineBanner
          message={getErrorMessage(studentsQuery.error)}
          onRetry={() => void studentsQuery.refetch()}
        />
      ) : studentsQuery.isLoading ? (
        <Card className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </Card>
      ) : students.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-medium">No students found</p>
          <p className="mt-2 text-sm text-text-muted">
            Try a different search or filter combination.
          </p>
        </Card>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-background text-xs uppercase text-text-muted">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll number</th>
                <th className="p-4">Semester</th>
                <th className="p-4">Attended</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.studentId}
                  className="border-b border-border last:border-0"
                >
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4 text-text-muted">
                    {student.admissionNumber}
                  </td>
                  <td className="p-4 text-text-muted">{student.semester}</td>
                  <td className="p-4">
                    {student.attended}/{student.total}
                  </td>
                  <td
                    className={`p-4 font-semibold ${
                      student.belowThreshold ? "text-red-700" : "text-text"
                    }`}
                  >
                    {student.percentage}%
                  </td>
                  <td className="p-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedStudentId(student.studentId)}
                    >
                      View details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total}{" "}
            total
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <StudentDetailDialog
        studentId={selectedStudentId}
        semester={overviewParams.semester}
        onClose={() => setSelectedStudentId(null)}
      />
    </div>
  );
}
