"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useEventAttendance,
  useSaveEventAttendance,
} from "@/features/attendence/api/attendance-query";
import { AttendanceStatus } from "@/features/attendence/api/attendance";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
// Adjust these paths to wherever your shared components live.


const LIMIT = 10;

export default function AttendancePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.eventId);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, isFetching } = useEventAttendance(
    eventId,
    { page, limit: LIMIT, search },
  );

  const saveMutation = useSaveEventAttendance(eventId);

  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>(
    {},
  );

  useEffect(() => {
    if (!data) return;

    setAttendance((previous) => {
      const updated = { ...previous };
      data.members.forEach((member) => {
        if (member.status) {
          updated[member.studentId] = member.status;
        } else {
          delete updated[member.studentId];
        }
      });
      return updated;
    });
  }, [data]);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance((previous) => ({ ...previous, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    if (!data) return;
    setAttendance((previous) => {
      const updated = { ...previous };
      data.members.forEach((m) => {
        updated[m.studentId] = "present";
      });
      return updated;
    });
  };

  const handleSave = async () => {
    const attendanceData = Object.entries(attendance).map(
      ([studentId, status]) => ({ studentId: Number(studentId), status }),
    );

    if (!attendanceData.length) return;

    try {
      await saveMutation.mutateAsync({ attendance: attendanceData });
    } catch {
      // Error is shown below.
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-secondary-hover" />
        <div className="h-28 animate-pulse rounded-2xl bg-secondary-hover" />
        <div className="h-96 animate-pulse rounded-2xl bg-secondary-hover" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <Card padding="lg" className="border-red-200 bg-red-50">
          <p className="font-semibold text-red-700">
            Couldn&apos;t load attendance
          </p>
          <p className="mt-1 text-label text-red-600">
            {error?.message || "Check your connection and try again."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </Card>
      </div>
    );
  }

  const { event, members, summary, pagination } = data;

  const startItem =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  const total = Math.max(summary.total, 1);
  const presentPct = (summary.present / total) * 100;
  const absentPct = (summary.absent / total) * 100;

  const markedCount = Object.keys(attendance).length;

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-label font-medium text-text-muted transition-colors hover:text-primary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to events
        </button>

        <PageHeader
          title="Event attendance"
          description="Mark each approved member as present or absent, then save."
          action={
            <Button
              size="lg"
              onClick={handleSave}
              disabled={saveMutation.isPending || markedCount === 0}
            >
              {saveMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving…
                </>
              ) : (
                "Save attendance"
              )}
            </Button>
          }
        />
      </div>

      {/* Save feedback */}
      {saveMutation.isSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-label font-medium text-green-700"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
            <path d="m5 12 4 4L19 6" />
          </svg>
          Attendance saved.
        </div>
      )}
      {saveMutation.isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-label text-red-700"
        >
          {saveMutation.error.message ||
            "Couldn't save attendance. Try again."}
        </div>
      )}

      {/* Event + overview: the one featured block */}
      <section className="overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-lg">
        <div className="flex flex-wrap items-end justify-between gap-4 p-6 md:p-7">
          <div className="min-w-0">
            <p className="text-caption text-white/70">{event.clubName}</p>
            <h2 className="mt-1 truncate text-heading-sm font-bold">
              {event.title}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-display-sm font-extrabold leading-none">
              {summary.percentage}%
            </p>
            <p className="mt-1 text-caption text-white/70">attendance</p>
          </div>
        </div>

        {/* Segmented bar: present / absent / unmarked */}
        <div className="px-6 pb-6 md:px-7">
          <div
            className="flex h-2.5 overflow-hidden rounded-full bg-white/20"
            role="img"
            aria-label={`${summary.present} present, ${summary.absent} absent, ${summary.unmarked} unmarked`}
          >
            <div
              className="bg-green-400 transition-all duration-500"
              style={{ width: `${presentPct}%` }}
            />
            <div
              className="bg-accent transition-all duration-500"
              style={{ width: `${absentPct}%` }}
            />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Approved members" value={summary.total} dot="bg-white" />
            <Stat label="Present" value={summary.present} dot="bg-green-400" />
            <Stat label="Absent" value={summary.absent} dot="bg-accent" />
            <Stat label="Not marked" value={summary.unmarked} dot="bg-white/30" />
          </dl>
        </div>
      </section>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden !p-0">
        <div className="flex flex-col gap-4 border-b border-border-subtle p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-subheading font-bold text-text">Students</h2>
            <p className="mt-0.5 text-caption text-text-muted">
              {markedCount > 0
                ? `${markedCount} marked in this session`
                : "No one marked yet"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllPresent}
              disabled={members.length === 0}
            >
              Mark all on page present
            </Button>

            <div className="relative w-full sm:w-72">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or admission no."
                aria-label="Search students"
                className="w-full rounded-lg border border-border bg-secondary-subtle py-2 pl-9 pr-3 text-label text-text outline-none transition placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        <div className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-secondary text-caption font-semibold text-text-muted">
                <th className="w-14 px-5 py-3">#</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Admission no.</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle">
              {members.map((member, index) => {
                const status = attendance[member.studentId];
                return (
                  <tr
                    key={member.studentId}
                    className="transition-colors hover:bg-secondary-subtle"
                  >
                    <td className="px-5 py-3.5 text-caption tabular-nums text-text-subtle">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-label font-bold text-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-text">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-label tabular-nums text-text-muted">
                      {member.admissionNumber}
                    </td>

                    <td className="px-5 py-3.5">
                      <div
                        role="group"
                        aria-label={`Attendance for ${member.name}`}
                        className="ml-auto inline-flex w-fit rounded-lg border border-border bg-secondary p-0.5 sm:float-right"
                      >
                        <SegmentButton
                          active={status === "present"}
                          tone="present"
                          onClick={() =>
                            handleStatusChange(member.studentId, "present")
                          }
                        >
                          Present
                        </SegmentButton>
                        <SegmentButton
                          active={status === "absent"}
                          tone="absent"
                          onClick={() =>
                            handleStatusChange(member.studentId, "absent")
                          }
                        >
                          Absent
                        </SegmentButton>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {members.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <p className="font-semibold text-text">No students found</p>
                    <p className="mt-1 text-label text-text-muted">
                      {search
                        ? "Try a different name or admission number."
                        : "This club has no approved members yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-label text-text-muted">
              Showing{" "}
              <span className="font-semibold text-text">
                {startItem}–{endItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-text">{pagination.total}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPreviousPage || isFetching}
              >
                Previous
              </Button>
              <span className="px-2 text-label tabular-nums text-text-muted">
                {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage || isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-caption text-white/70">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        {label}
      </dt>
      <dd className="mt-1 text-subheading font-bold tabular-nums">{value}</dd>
    </div>
  );
}

function SegmentButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: "present" | "absent";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const activeStyle =
    tone === "present"
      ? "bg-green-600 text-white shadow-sm"
      : "bg-red-600 text-white shadow-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-4 py-1.5 text-caption font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
        active ? activeStyle : "text-text-muted hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
