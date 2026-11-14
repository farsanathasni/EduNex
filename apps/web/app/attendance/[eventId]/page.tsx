
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventAttendance, useSaveEventAttendance } from "@/features/attendence/api/attendance-query";
import { AttendanceStatus } from "@/features/attendence/api/attendance";




export default function AttendancePage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const { data, isLoading, isError, error } =
    useEventAttendance(eventId);

  const saveMutation = useSaveEventAttendance(eventId);

  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >({});

  // Load existing attendance statuses
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
      // Mutation error is displayed below.
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading attendance...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          {error?.message || "Unable to load attendance."}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-lg border px-4 py-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { event, members, summary } = data;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-3 text-sm text-blue-600 hover:underline"
          >
            ← Back to Events
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Event Attendance
          </h1>

          <p className="mt-1 text-gray-500">{event.title}</p>
          <p className="text-sm text-gray-500">{event.clubName}</p>
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

      {/* Attendance Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="Total Students" value={summary.total} />
        <SummaryCard
          label="Present"
          value={summary.present}
          color="text-green-600"
        />
        <SummaryCard
          label="Absent"
          value={summary.absent}
          color="text-red-600"
        />
        <SummaryCard
          label="Unmarked"
          value={summary.unmarked}
          color="text-orange-600"
        />
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Student List
          </h2>

          <p className="text-sm text-gray-500">
            Attendance: {summary.percentage}%
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-sm text-gray-600">
                <th className="p-3">#</th>
                <th className="p-3">Student</th>
                <th className="p-3">Admission Number</th>
                <th className="p-3">Attendance Status</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member, index) => (
                <tr
                  key={member.studentId}
                  className="border-b last:border-0"
                >
                  <td className="p-3 text-sm">{index + 1}</td>

                  <td className="p-3 font-medium text-gray-900">
                    {member.name}
                  </td>

                  <td className="p-3 text-sm text-gray-500">
                    {member.admissionNumber}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            member.studentId,
                            "present",
                          )
                        }
                        aria-pressed={
                          attendance[member.studentId] === "present"
                        }
                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
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
                          handleStatusChange(
                            member.studentId,
                            "absent",
                          )
                        }
                        aria-pressed={
                          attendance[member.studentId] === "absent"
                        }
                        className={`rounded-lg px-3 py-2 text-sm font-medium ${
                          attendance[member.studentId] === "absent"
                            ? "bg-red-600 text-white"
                            : "border border-red-600 text-red-700 hover:bg-red-50"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-gray-500"
                  >
                    No approved members found for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {saveMutation.isSuccess && (
          <p className="mt-4 text-sm font-medium text-green-600">
            Attendance saved successfully!
          </p>
        )}

        {saveMutation.isError && (
          <p className="mt-4 text-sm text-red-600">
            {saveMutation.error.message ||
              "Unable to save attendance."}
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
