"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { useAccess } from "@/lib/navigation/access";
import {
  useAttendanceRosterQuery,
  useMyTeachingSubjectsQuery,
  useSaveClassAttendanceMutation,
} from "@/features/class-attendance/api/class-attendance-query";

type LocalStatus = "present" | "late" | "absent";

type StatusMap = Record<number, LocalStatus>;

function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message;
    if (error.response?.status === 401) return "Please sign in to continue.";
    if (typeof msg === "string" && msg) return msg;
    if (error.response?.status === 403) return "You don't have access.";
  }
  return error instanceof Error ? error.message : "Failed to save attendance.";
}

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
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

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
      <div className="mx-auto w-full max-w-5xl p-6">
        <p className="text-muted">Checking access...</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <Card className="border-border p-6">
          <h1 className="text-xl font-semibold">Take Attendance</h1>
          <p className="mt-2 text-text-muted">You don&apos;t have access.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-4">
      {toast && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.text}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">Take Attendance</h1>
        <p className="mt-1 text-sm text-muted">
          Select a subject, date and period, then mark each student.
        </p>
      </div>

      <Card className="border-border p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-text">Subject</span>
            <select
              value={subjectId}
              onChange={(e) => {
                const v = e.target.value;
                setSubjectOverride(v ? Number(v) : "");
                setStudentSearch("");
                setEditState({ key: "", map: {} });
              }}
              disabled={subjectsLoading}
              className="h-10 rounded-lg border border-border bg-surface px-3 outline-none focus:border-primary"
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

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-text">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setEditState({ key: "", map: {} });
              }}
              className="h-10 rounded-lg border border-border bg-surface px-3 outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-text">Period</span>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(Number(e.target.value));
                setEditState({ key: "", map: {} });
              }}
              className="h-10 rounded-lg border border-border bg-surface px-3 outline-none focus:border-primary"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  Period {p}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {subjectId === "" ? (
        <Card className="border-border p-8 text-center">
          <p className="font-medium">Select a subject to load the roster</p>
          <p className="mt-2 text-sm text-muted">
            Choose subject, date and period above.
          </p>
        </Card>
      ) : rosterLoading ? (
        <Card className="border-border p-8 text-center text-muted">
          Loading roster...
        </Card>
      ) : rosterError ? (
        <Card className="border-border p-6">
          <p
            className={
              isAxiosError(rosterErrorObj) && rosterErrorObj.response?.status === 403
                ? "text-text"
                : "text-red-600"
            }
          >
            {getErrorMessage(rosterErrorObj)}
          </p>
          {!(isAxiosError(rosterErrorObj) && rosterErrorObj.response?.status === 403) && (
            <div className="mt-4">
              <Button onClick={() => void refetchRoster()}>Try again</Button>
            </div>
          )}
        </Card>
      ) : !roster ? null : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="border-border p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Total</p>
              <p className="mt-1 text-2xl font-bold text-text">{counts.total}</p>
            </Card>
            <Card className="border-border p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Present</p>
              <p className="mt-1 text-2xl font-bold text-green-700">{counts.present}</p>
            </Card>
            <Card className="border-border p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Late</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{counts.late}</p>
            </Card>
            <Card className="border-border p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Absent</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{counts.absent}</p>
            </Card>
          </div>

          {!roster.editable && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Attendance can only be saved for today. This date is view-only.
            </div>
          )}

          <Card className="border-border overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <Input
                type="search"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name or admission number"
                aria-label="Search students"
                className="sm:max-w-sm"
              />
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
              <div className="p-8 text-center">
                <p className="font-medium">No students in this class</p>
                <p className="mt-2 text-sm text-muted">
                  There are no students enrolled for this subject&apos;s class.
                </p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-medium">No matching students</p>
                <p className="mt-2 text-sm text-muted">
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
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-text truncate">{s.name}</p>
                        <p className="text-sm text-muted">{s.admissionNumber}</p>
                      </div>
                      <div
                        className="flex items-center gap-2 self-start sm:self-auto"
                        role="group"
                        aria-label={`Attendance status for ${s.name}`}
                      >
                        {(["present", "late", "absent"] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            aria-pressed={st === status}
                            aria-label={`Mark ${s.name} as ${status}`}
                            disabled={!roster.editable}
                            onClick={() => setStudentStatus(s.id, status)}
                            className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              st === status
                                ? status === "present"
                                  ? "border-green-300 bg-green-500 text-white"
                                  : status === "late"
                                    ? "border-amber-300 bg-amber-500 text-white"
                                    : "border-red-300 bg-red-500 text-white"
                                : "border-border bg-surface text-muted"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              {roster.alreadyMarked ? "Updating existing attendance for this session." : "New attendance session."}
            </p>
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

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-lg"
          >
            <h2 id="confirm-title" className="text-lg font-semibold">
              Submit attendance?
            </h2>
            <p className="mt-2 text-sm text-muted">
              This will save attendance for {counts.total} students ({counts.present} present, {counts.late} late, {counts.absent} absent) for the selected date and period.
            </p>
            <div className="mt-5 flex justify-end gap-3">
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
    </div>
  );
}

export default function TakeAttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl p-6">
          <p className="text-muted">Loading...</p>
        </div>
      }
    >
      <TakeAttendanceInner />
    </Suspense>
  );
}
