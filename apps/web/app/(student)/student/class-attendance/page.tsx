"use client";

import { isAxiosError } from "axios";

import Card from "@/components/ui/card";
import { useAccess } from "@/lib/navigation/access";
import { useMyClassAttendanceSummaryQuery } from "@/features/class-attendance/api/class-attendance-query";

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message;
    if (error.response?.status === 401) return "Please sign in to continue.";
    if (typeof msg === "string" && msg) return msg;
    if (error.response?.status === 403) return "You don't have access.";
  }
  return error instanceof Error ? error.message : "Failed to load attendance.";
}

export default function StudentClassAttendancePage() {
  const { can, isPending: accessPending } = useAccess();
  const allowed = can("class_attendance", "view_own");

  const { data, isLoading, isError, error, refetch } =
    useMyClassAttendanceSummaryQuery(allowed);

  if (accessPending) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <p className="text-text-muted">Checking access...</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <Card className="border-border p-6">
          <h1 className="text-xl font-semibold text-text">My Attendance</h1>
          <p className="mt-2 text-text-muted">You don&apos;t have access.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6 space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-border" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
      </div>
    );
  }

  if (isError) {
    const forbidden = isAxiosError(error) && error.response?.status === 403;
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <Card className="border-border p-6">
          <h1 className="text-xl font-semibold text-text">My Attendance</h1>
          <p className={`mt-2 ${forbidden ? "text-text" : "text-red-600"}`}>
            {getErrorMessage(error)}
          </p>
          {!forbidden && (
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
          )}
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { overall, subjects, minimumPercentage } = data;

  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-text">My Attendance</h1>
        <p className="mt-1 text-sm text-text-muted">
          Your subject-wise class attendance. Minimum required: {minimumPercentage}%.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border p-5">
          <p className="text-sm text-text-muted">Overall attendance</p>
          <p className="mt-2 text-3xl font-bold text-text">{overall.percentage}%</p>
          <p className="mt-1 text-sm text-text-muted">
            {overall.attended} / {overall.total} classes
          </p>
        </Card>
        <Card className="border-border p-5">
          <p className="text-sm text-text-muted">Classes attended</p>
          <p className="mt-2 text-3xl font-bold text-green-700">{overall.attended}</p>
        </Card>
        <Card className="border-border p-5">
          <p className="text-sm text-text-muted">Total classes</p>
          <p className="mt-2 text-3xl font-bold text-text">{overall.total}</p>
        </Card>
      </div>

      <Card className="border-border overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold text-text">Subject-wise attendance</h2>
          <p className="mt-1 text-sm text-text-muted">
            Subjects below {minimumPercentage}% are highlighted in red.
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-text">No attendance records yet</p>
            <p className="mt-2 text-sm text-text-muted">
              Your class attendance will appear here once it is recorded.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-secondary/50 text-xs uppercase text-text-muted">
                <tr>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Present / Total</th>
                  <th className="px-5 py-4">Percentage</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subjects.map((s) => (
                  <tr
                    key={s.subjectId}
                    className={s.belowMinimum ? "bg-red-50/70" : undefined}
                  >
                    <td className="px-5 py-4 font-medium text-text">
                      {s.subjectName}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">
                      {s.subjectCode}
                    </td>
                    <td className="px-5 py-4 text-sm text-text">
                      {s.attended} / {s.total}
                    </td>
                    <td
                      className={`px-5 py-4 text-sm font-semibold ${
                        s.belowMinimum ? "text-red-700" : "text-text"
                      }`}
                    >
                      {s.percentage}%
                    </td>
                    <td className="px-5 py-4">
                      {s.belowMinimum ? (
                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                          Below {minimumPercentage}%
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          On track
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
