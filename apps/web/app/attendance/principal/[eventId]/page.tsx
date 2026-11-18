"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import {
  useEventAttendance,
  useSaveEventAttendance,
} from "@/features/attendence/api/attendance-query";
import type { AttendanceStatus } from "@/features/attendence/api/attendance";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import Button from "@/components/ui/button";
// Adjust these paths to wherever your shared components live.


type StatusMap = Record<number, AttendanceStatus>;

const LIMIT = 10;

export default function PrincipalEventAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.eventId);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // `server` = what is saved, `local` = what is currently selected on screen.
  const [{ local, server }, setMarks] = useState<{
    local: StatusMap;
    server: StatusMap;
  }>({ local: {}, server: {} });

  const { data, isLoading, isError, error, isFetching } = useEventAttendance(
    eventId,
    { page, limit: LIMIT, search },
  );

  const saveMutation = useSaveEventAttendance(eventId);

  // Sync saved statuses from the API without overwriting unsaved edits.
  useEffect(() => {
    if (!data) return;

    setMarks((prev) => {
      const nextServer = { ...prev.server };
      const nextLocal = { ...prev.local };

      data.members.forEach((member) => {
        const id = member.studentId;
        const hasUnsavedEdit =
          id in prev.local && prev.local[id] !== prev.server[id];

        if (member.status) nextServer[id] = member.status;
        else delete nextServer[id];

        if (!hasUnsavedEdit) {
          if (member.status) nextLocal[id] = member.status;
          else delete nextLocal[id];
        }
      });

      return { local: nextLocal, server: nextServer };
    });
  }, [data]);

  const changes = Object.entries(local)
    .filter(([id, status]) => server[Number(id)] !== status)
    .map(([id, status]) => ({ studentId: Number(id), status }));

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setMarks((prev) => ({
      ...prev,
      local: { ...prev.local, [studentId]: status },
    }));
  };

  const handleMarkAllPresent = () => {
    if (!data) return;
    setMarks((prev) => {
      const nextLocal = { ...prev.local };
      data.members.forEach((m) => {
        nextLocal[m.studentId] = "present";
      });
      return { ...prev, local: nextLocal };
    });
  };

  const handleDiscard = () => {
    setMarks((prev) => ({ ...prev, local: { ...prev.server } }));
  };

  const handleSave = async () => {
    if (changes.length === 0) return;

    try {
      await saveMutation.mutateAsync({ attendance: changes });
      setMarks((prev) => {
        const nextServer = { ...prev.server };
        changes.forEach((c) => {
          nextServer[c.studentId] = c.status;
        });
        return { ...prev, server: nextServer };
      });
    } catch {
      // Error is displayed below.
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-secondary-hover" />
        <div className="h-60 animate-pulse rounded-3xl bg-secondary-hover" />
        <div className="h-96 animate-pulse rounded-2xl bg-secondary-hover" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full space-y-4 p-4 sm:p-6 lg:p-8">
        <BackLink onClick={() => router.push("/attendance/principal")} />
        <Card padding="lg" className="border-red-200 bg-red-50">
          <p className="font-semibold text-red-700">
            Couldn&apos;t load attendance
          </p>
          <p className="mt-1 text-label text-red-600">
            {error instanceof Error ? error.message : "Event not found."}
          </p>
        </Card>
      </div>
    );
  }

  const { event, members, summary, pagination } = data;
  const start = new Date(event.startTime);

  const total = Math.max(summary.total, 1);
  const presentPct = (summary.present / total) * 100;
  const absentPct = (summary.absent / total) * 100;

  const startItem =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <BackLink onClick={() => router.push("/attendance/principal")} />
        <PageHeader
          title="Event attendance"
          description="View and manage attendance across all departments."
        />
      </div>

      {saveMutation.isSuccess && changes.length === 0 && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-label font-medium text-green-700"
        >
          <CheckCircle2 className="h-4 w-4" />
          Attendance saved.
        </div>
      )}
      {saveMutation.isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-label text-red-700"
        >
          {saveMutation.error instanceof Error
            ? saveMutation.error.message
            : "Couldn't save attendance. Try again."}
        </div>
      )}

      {/* Event hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-hover p-6 text-primary-foreground shadow-lg sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-white/5"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/5"
        />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-white text-primary shadow-md">
                <span className="text-caption font-semibold leading-none">
                  {start.toLocaleDateString(undefined, { month: "short" })}
                </span>
                <span className="mt-0.5 text-heading font-extrabold leading-none tabular-nums">
                  {start.getDate()}
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-label font-medium text-white/75">
                  {event.clubName}
                </p>
                <h2 className="mt-0.5 text-heading font-bold leading-tight">
                  {event.title}
                </h2>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-white/75">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {start.toLocaleDateString(undefined, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {start.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-display-sm font-extrabold leading-none tabular-nums">
                {summary.percentage}%
              </p>
              <p className="mt-1 text-caption text-white/70">attendance</p>
            </div>
          </div>

          {/* Segmented bar */}
          <div
            className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-white/15"
            role="img"
            aria-label={`${summary.present} present, ${summary.absent} absent, ${summary.unmarked} not marked`}
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

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile icon={Users} label="Approved members" value={summary.total} />
            <StatTile
              icon={CheckCircle2}
              label="Present"
              value={summary.present}
              tone="text-green-300"
            />
            <StatTile
              icon={XCircle}
              label="Absent"
              value={summary.absent}
              tone="text-orange-300"
            />
            <StatTile icon={Clock} label="Not marked" value={summary.unmarked} />
          </div>
        </div>
      </section>

      {/* Student list */}
      <Card padding="sm" className="overflow-hidden !p-0">
        <div className="flex flex-col gap-4 border-b border-border-subtle p-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="text-subheading font-bold text-text">Students</h2>
            <p className="mt-0.5 text-caption text-text-muted">
              Mark or update attendance for approved club members.
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
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or admission no."
                aria-label="Search students"
                className="w-full rounded-lg border border-border bg-secondary-subtle py-2 pl-9 pr-3 text-label text-text outline-none transition placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        <div
          className={`overflow-x-auto transition-opacity ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="bg-secondary text-caption font-semibold text-text-muted">
                <th className="w-14 px-5 py-3">#</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Admission no.</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Marked at</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle">
              {members.map((member, index) => {
                const status = local[member.studentId];
                const edited = status !== server[member.studentId];

                return (
                  <tr
                    key={member.studentId}
                    className={`transition-colors hover:bg-secondary-subtle ${
                      edited ? "bg-primary-subtle/40" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 text-caption tabular-nums text-text-subtle">
                      {(page - 1) * LIMIT + index + 1}
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
                        className="inline-flex w-fit rounded-lg border border-border bg-secondary p-0.5"
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

                    <td className="px-5 py-3.5 text-caption tabular-nums text-text-subtle">
                      {member.markedAt
                        ? new Date(member.markedAt).toLocaleString(undefined, {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Not marked"}
                    </td>
                  </tr>
                );
              })}

              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
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
          <div className="flex flex-col gap-3 border-t border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="text-label text-text-muted">
              Showing{" "}
              <span className="font-semibold text-text">
                {startItem}–{endItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-text">{pagination.total}</span>{" "}
              students
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPreviousPage || isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
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
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Sticky save bar: appears only when there are unsaved changes */}
      {changes.length > 0 && (
        <div
          role="region"
          aria-label="Unsaved changes"
          className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-5 py-3.5 shadow-lg"
        >
          <p className="flex items-center gap-2.5 text-label font-semibold text-text">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            {changes.length} unsaved {changes.length === 1 ? "change" : "changes"}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={saveMutation.isPending}
            >
              Discard
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving…
                </>
              ) : (
                "Save attendance"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 text-label font-medium text-text-muted transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to attendance reports
    </button>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone = "text-white",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ${tone}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-heading font-extrabold leading-none tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-caption text-white/70">{label}</p>
      </div>
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
