
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useEventAttendance,
  useSaveEventAttendance,
} from "@/features/attendence/api/attendance-query";

import type { AttendanceStatus } from "@/features/attendence/api/attendance";

export default function PrincipalEventAttendancePage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >({});

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useEventAttendance(eventId, {
    page,
    limit,
    search,
  });

  const saveMutation = useSaveEventAttendance(eventId);

  // Load existing attendance for the current page
  useEffect(() => {
    if (!data) return;

    const existingAttendance: Record<number, AttendanceStatus> = {};

    data.members.forEach((member) => {
      if (member.status) {
        existingAttendance[member.studentId] = member.status;
      }
    });

    setAttendance(existingAttendance);
  }, [data]);

  const handleStatusChange = (
    studentId: number,
    status: AttendanceStatus,
  ) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

  const handleSave = async () => {
    const attendanceData = Object.entries(attendance).map(
      ([studentId, status]) => ({
        studentId: Number(studentId),
        status,
      }),
    );

    if (attendanceData.length === 0) return;

    try {
      await saveMutation.mutateAsync({
        attendance: attendanceData,
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
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4 p-6">
        <button
          onClick={() => router.push("/attendance/principal")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Attendance Reports
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          Failed to load attendance:{" "}
          {error instanceof Error ? error.message : "Event not found"}
        </div>
      </div>
    );
  }

  const { event, members, summary, pagination } = data;

  const cards = [
    {
      label: "Total Members",
      value: summary.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Present",
      value: summary.present,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Absent",
      value: summary.absent,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Unmarked",
      value: summary.unmarked,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button and heading */}
      <div>
        <button
          onClick={() => router.push("/attendance/principal")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Attendance Reports
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Event Attendance
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage attendance across all departments.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={
              saveMutation.isPending ||
              Object.keys(attendance).length === 0
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveMutation.isPending ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      {/* Event details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          {event.title}
        </h2>

        <p className="mt-2 font-medium text-blue-600">
          {event.clubName}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {new Date(event.startTime).toLocaleDateString()}
          </span>

          <span>
            {new Date(event.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Attendance summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {card.label}
                </p>

                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Attendance percentage */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance Percentage
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Present members out of total approved members
            </p>
          </div>

          <span className="text-2xl font-bold text-blue-600">
            {summary.percentage}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${summary.percentage}%`,
            }}
          />
        </div>
      </div>

      {/* Student list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Student Attendance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Mark or update attendance for approved club members.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search student..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">Student Name</th>
                <th className="px-5 py-4 font-semibold">
                  Admission Number
                </th>
                <th className="px-5 py-4 font-semibold">
                  Attendance Status
                </th>
                <th className="px-5 py-4 font-semibold">Marked At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {members.map((member, index) => (
                <tr
                  key={member.studentId}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td className="px-5 py-4 font-medium text-gray-900">
                    {member.name}
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {member.admissionNumber}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(member.studentId, "present")
                        }
                        aria-pressed={
                          attendance[member.studentId] === "present"
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                          attendance[member.studentId] === "present"
                            ? "bg-green-600 text-white"
                            : "border border-green-600 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(member.studentId, "absent")
                        }
                        aria-pressed={
                          attendance[member.studentId] === "absent"
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                          attendance[member.studentId] === "absent"
                            ? "bg-red-600 text-white"
                            : "border border-red-600 text-red-700 hover:bg-red-50"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {member.markedAt
                      ? new Date(member.markedAt).toLocaleString()
                      : "Not marked"}
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No approved members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} students
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((previous) => previous - 1)}
              disabled={!pagination.hasPreviousPage || isFetching}
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={() => setPage((previous) => previous + 1)}
              disabled={!pagination.hasNextPage || isFetching}
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isFetching && (
          <p className="px-5 pb-3 text-xs text-gray-400">
            Updating student list...
          </p>
        )}

        {/* Save feedback */}
        {saveMutation.isSuccess && (
          <p className="px-5 pb-4 text-sm font-medium text-green-600">
            Attendance saved successfully!
          </p>
        )}

        {saveMutation.isError && (
          <p className="px-5 pb-4 text-sm text-red-600">
            {saveMutation.error instanceof Error
              ? saveMutation.error.message
              : "Unable to save attendance."}
          </p>
        )}
      </div>
    </div>
  );
}
