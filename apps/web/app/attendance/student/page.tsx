
"use client";

import { useStudentAttendance } from "@/features/attendence/api/attendance-query";


export default function StudentAttendancePage() {
  const { data, isPending, isError, error } = useStudentAttendance();

  if (isPending) {
    return (
      <div className="p-6 text-center text-text-muted">
        Loading your attendance...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        Failed to load attendance. Please try again.
        <p className="mt-2 text-sm">
          {error instanceof Error ? error.message : "Something went wrong"}
        </p>
      </div>
    );
  }

  const { student, summary, records } = data;

  const stats = [
    { label: "Total Events", value: summary.total },
    { label: "Present", value: summary.present },
    { label: "Absent", value: summary.absent },
    { label: "Attendance", value: `${summary.percentage}%` },
  ];

  return (
    <div className="space-y-6 p-5 md:p-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-text">
          My Attendance
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Track your attendance in campus events.
        </p>
        <p className="mt-2 text-sm font-medium text-text">
          {student.name} · {student.admissionNumber}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
          >
            <p className="text-sm text-text-muted">
              {item.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-text">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Attendance records */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-bold text-text">
            Event Attendance History
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Your attendance records for campus events.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-text">
              No attendance records yet
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Your attendance will appear here after it is marked.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-secondary/50 text-xs uppercase text-text-muted">
                <tr>
                  <th className="px-5 py-4">Event</th>
                  <th className="px-5 py-4">Club</th>
                  <th className="px-5 py-4">Event Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Marked At</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-5 py-4 font-medium text-text">
                      {record.eventTitle}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">
                      {record.clubName}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">
                      {new Date(record.eventDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          record.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">
                      {new Date(record.markedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
