"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";

import Button from "@/components/ui/button";
import { useAccess } from "@/lib/navigation/access";
import {
  useAttendanceRosterQuery,
  useMyTeachingSubjectsQuery,
  useSaveClassAttendanceMutation,
} from "@/features/class-attendance/api/class-attendance-query";

type LocalStatus = "present" | "late" | "absent";

type StatusMap = Record<number, LocalStatus>;

const STATUS_OPTIONS: { value: LocalStatus; label: string; active: string }[] =
  [
    { value: "present", label: "Present", active: "bg-green-600 text-white" },
    { value: "late", label: "Late", active: "bg-amber-500 text-white" },
    { value: "absent", label: "Absent", active: "bg-red-500 text-white" },
  ];

/* ---------- Helpers ---------- */

function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (error.response?.status === 401) return "Please sign in to continue.";
    if (typeof msg === "string" && msg) return msg;
    if (error.response?.status === 403) return "You don't have access.";
  }
  return error instanceof Error ? error.message : "Failed to save attendance.";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/* ---------- Icons (inline, no extra dependency) ---------- */

type IconProps = { className?: string };

function Svg({
  className = "h-5 w-5",
  strokeWidth = 1.8,
  children,
}: IconProps & { strokeWidth?: number; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const SearchIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <Svg className={className} strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

const ClipboardIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="5" y="4" width="14" height="17" rx="2.5" />
    <path d="M9 4.5h6M9 11l2 2 4-4M9 17h6" />
  </Svg>
);

const AlertIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </Svg>
);

const LockIcon = ({ className = "h-4 w-4" }: IconProps) => (
  <Svg className={className}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

const CheckCircleIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </Svg>
);

/* ---------- Shared pieces ---------- */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">{children}</div>
  );
}

function PageHeader() {
  return (
    <header className="border-b border-border pb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Take Attendance
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Choose a subject, date and period, then mark each student.
      </p>
    </header>
  );
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

function RosterSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl border border-border bg-border/40" />
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border p-4">
          <div className="h-10 w-full max-w-sm rounded-lg bg-border" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-border" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-border" />
              <div className="h-3 w-24 rounded bg-border" />
            </div>
            <div className="hidden h-9 w-60 rounded-lg bg-border sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

/* ---------- Page ---------- */

function TakeAttendanceInner() {
  const { can, isPending: accessPending } = useAccess();
  const allowed = can("class_attendance", "mark");
  const searchParams = useSearchParams();

  const [subjectOverride, setSubjectOverride] = useState<number | "">("");
  const [date, setDate] = useState(todayIST());
  const [period, setPeriod] = useState(1);
  const [studentSearch, setStudentSearch] = useState("");
  const [editState, setEditState] = useState<{ key: string; map: StatusMap }>({
    key: "",
    map: {},
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { data: subjects, isLoading: subjectsLoading } =
    useMyTeachingSubjectsQuery(allowed);

  const subjectId = useMemo(() => {
    if (subjectOverride !== "") return subjectOverride;
    const sp = searchParams.get("subjectId");
    if (!sp) return "" as const;
    const n = Number(sp);
    return Number.isFinite(n) && n > 0 ? n : ("" as const);
  }, [subjectOverride, searchParams]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const rosterParams =
    allowed && subjectId !== "" && subjectId > 0 && date
      ? { subjectId: Number(subjectId), date, period }
      : null;

  const {
    data: roster,
    isLoading: rosterLoading,
    isError: rosterError,
    error: rosterErrorObj,
    refetch: refetchRoster,
  } = useAttendanceRosterQuery(rosterParams);

  const rosterKey = roster
    ? `${roster.subject.id}-${roster.date}-${roster.period}-${roster.alreadyMarked}`
    : "";

  const baseStatusMap = useMemo<StatusMap>(() => {
    if (!roster) return {};
    const next: StatusMap = {};
    roster.students.forEach((s) => {
      next[s.id] = s.status;
    });
    return next;
  }, [roster]);

  const statusMap = useMemo<StatusMap>(() => {
    if (!roster || editState.key !== rosterKey) return baseStatusMap;
    return { ...baseStatusMap, ...editState.map };
  }, [baseStatusMap, editState, roster, rosterKey]);

  const saveMutation = useSaveClassAttendanceMutation();

  const filteredStudents = useMemo(() => {
    if (!roster) return [];
    const q = studentSearch.trim().toLowerCase();
    if (!q) return roster.students;
    return roster.students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q),
    );
  }, [roster, studentSearch]);

  const counts = useMemo(() => {
    if (!roster) return { total: 0, present: 0, late: 0, absent: 0 };
    let present = 0;
    let late = 0;
    let absent = 0;
    roster.students.forEach((s) => {
      const st = statusMap[s.id] ?? "present";
      if (st === "absent") absent += 1;
      else if (st === "late") late += 1;
      else present += 1;
    });
    return { total: roster.students.length, present, late, absent };
  }, [roster, statusMap]);

  const setAll = (status: LocalStatus) => {
    if (!roster) return;
    const next: StatusMap = {};
    roster.students.forEach((s) => {
      next[s.id] = status;
    });
    setEditState({ key: rosterKey, map: next });
  };

  const setStudentStatus = (id: number, status: LocalStatus) => {
    setEditState((prev) => ({
      key: rosterKey,
      map: { ...(prev.key === rosterKey ? prev.map : {}), [id]: status },
    }));
  };

  const onConfirmSubmit = async () => {
    if (!roster || subjectId === "") return;
    setShowConfirm(false);
    try {
      await saveMutation.mutateAsync({
        subjectId: Number(subjectId),
        date,
        period,
        records: roster.students.map((s) => ({
          studentId: s.id,
          status: statusMap[s.id] ?? "present",
        })),
      });
      setToast({ type: "success", text: "Attendance saved successfully." });
      setEditState({ key: "", map: {} });
      void refetchRoster();
    } catch (e) {
      setToast({ type: "error", text: getErrorMessage(e) });
    }
  };

  if (accessPending) {
    return (
      <Shell>
        <div className="animate-pulse space-y-6" aria-busy="true">
          <div className="h-8 w-52 rounded-md bg-border" />
          <div className="h-32 rounded-2xl bg-border/40" />
        </div>
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

  const rosterForbidden =
    isAxiosError(rosterErrorObj) && rosterErrorObj.response?.status === 403;

  const pct = (n: number) =>
    counts.total ? `${(n / counts.total) * 100}%` : "0%";

  return (
    <Shell>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      <PageHeader />

      {/* Session details */}
      <section
        aria-label="Session details"
        className="rounded-2xl border border-border bg-surface p-5"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Subject</span>
            <select
              value={subjectId}
              onChange={(e) => {
                const v = e.target.value;
                setSubjectOverride(v ? Number(v) : "");
                setStudentSearch("");
                setEditState({ key: "", map: {} });
              }}
              disabled={subjectsLoading}
              className={fieldClass}
            >
              <option value="">
                {subjectsLoading ? "Loading subjects..." : "Select a subject"}
              </option>
              {(subjects ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) · Sem {s.semester}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setEditState({ key: "", map: {} });
              }}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Period</span>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(Number(e.target.value));
                setEditState({ key: "", map: {} });
              }}
              className={fieldClass}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  Period {p}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Roster area */}
      {subjectId === "" ? (
        <StateCard
          icon={<ClipboardIcon />}
          title="Select a subject to begin"
          message="The class roster will appear here once you choose a subject."
        />
      ) : rosterLoading ? (
        <RosterSkeleton />
      ) : rosterError ? (
        <StateCard
          tone={rosterForbidden ? "neutral" : "error"}
          icon={<AlertIcon />}
          title={rosterForbidden ? "No access" : "Couldn't load the roster"}
          message={getErrorMessage(rosterErrorObj)}
        >
          {!rosterForbidden && (
            <Button onClick={() => void refetchRoster()}>Try again</Button>
          )}
        </StateCard>
      ) : !roster ? null : (
        <>
          {/* Summary */}
          <section aria-label="Attendance summary" className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total students", value: counts.total, dot: "bg-primary" },
                { label: "Present", value: counts.present, dot: "bg-green-600" },
                { label: "Late", value: counts.late, dot: "bg-amber-500" },
                { label: "Absent", value: counts.absent, dot: "bg-red-500" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    {item.label}
                  </div>
                  <p className="mt-2 text-2xl font-bold tabular-nums">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="flex h-2 w-full overflow-hidden rounded-full bg-border"
              role="img"
              aria-label={`${counts.present} present, ${counts.late} late, ${counts.absent} absent`}
            >
              <div
                className="bg-green-600 transition-all duration-300"
                style={{ width: pct(counts.present) }}
              />
              <div
                className="bg-amber-500 transition-all duration-300"
                style={{ width: pct(counts.late) }}
              />
              <div
                className="bg-red-500 transition-all duration-300"
                style={{ width: pct(counts.absent) }}
              />
            </div>
          </section>

          {!roster.editable && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Attendance can only be saved for today. This date is view-only.</p>
            </div>
          )}

          {/* Roster */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative sm:w-80">
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by name or admission number"
                  aria-label="Search students"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAll("present")}
                  disabled={!roster.editable}
                >
                  Mark all present
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAll("absent")}
                  disabled={!roster.editable}
                >
                  Mark all absent
                </Button>
              </div>
            </div>

            {roster.students.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-medium">No students in this class</p>
                <p className="mt-1 text-sm text-muted">
                  There are no students enrolled for this subject&apos;s class.
                </p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-medium">No matching students</p>
                <p className="mt-1 text-sm text-muted">
                  Try a different name or admission number.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {filteredStudents.map((s) => {
                  const st = statusMap[s.id] ?? "present";
                  return (
                    <li
                      key={s.id}
                      className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-background sm:flex-row sm:items-center sm:justify-between sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary">
                          {getInitials(s.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{s.name}</p>
                          <p className="font-mono text-xs text-muted">
                            {s.admissionNumber}
                          </p>
                        </div>
                      </div>

                      <div
                        className="inline-flex w-full rounded-lg border border-border bg-background p-1 sm:w-auto"
                        role="group"
                        aria-label={`Attendance status for ${s.name}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            aria-pressed={st === opt.value}
                            aria-label={`Mark ${s.name} as ${opt.value}`}
                            disabled={!roster.editable}
                            onClick={() => setStudentStatus(s.id, opt.value)}
                            className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${
                              st === opt.value
                                ? `${opt.active} shadow-sm`
                                : "text-muted hover:text-foreground"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Submit bar */}
          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-border bg-surface/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="font-medium">
                {counts.present} present · {counts.late} late · {counts.absent}{" "}
                absent
              </p>
              <p className="mt-0.5 text-muted">
                {roster.alreadyMarked
                  ? "Updating existing attendance for this session."
                  : "New attendance session."}
              </p>
            </div>
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={
                !roster.editable ||
                roster.students.length === 0 ||
                saveMutation.isPending
              }
            >
              {saveMutation.isPending ? "Saving..." : "Submit attendance"}
            </Button>
          </div>
        </>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl"
          >
            <h2 id="confirm-title" className="text-lg font-semibold">
              Submit attendance?
            </h2>
            <p className="mt-1 text-sm text-muted">
              This saves attendance for {counts.total} students for the
              selected date and period.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-green-50 py-3 text-green-800">
                <p className="text-xl font-bold tabular-nums">
                  {counts.present}
                </p>
                <p className="text-xs">Present</p>
              </div>
              <div className="rounded-xl bg-amber-50 py-3 text-amber-800">
                <p className="text-xl font-bold tabular-nums">{counts.late}</p>
                <p className="text-xs">Late</p>
              </div>
              <div className="rounded-xl bg-red-50 py-3 text-red-700">
                <p className="text-xl font-bold tabular-nums">
                  {counts.absent}
                </p>
                <p className="text-xs">Absent</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => void onConfirmSubmit()}>
                Confirm &amp; submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

export default function TakeAttendancePage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="animate-pulse space-y-6" aria-busy="true">
            <div className="h-8 w-52 rounded-md bg-border" />
            <div className="h-32 rounded-2xl bg-border/40" />
          </div>
        </Shell>
      }
    >
      <TakeAttendanceInner />
    </Suspense>
  );
}
