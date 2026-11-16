
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Users, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { useEventAttendance } from "@/features/attendence/api/attendance-query";

export default function HodEventAttendancePage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useEventAttendance(eventId);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Attendance Reports
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          Failed to load attendance: {error?.message || "Event not found"}
        </div>
      </div>
    );
  }

  const { event, summary, members } = data;

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
      <button
        onClick={() => router.push("/attendance/hod")}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Attendance Reports
      </button>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {event.title}
        </h1>

        <p className="mt-2 text-blue-600 font-medium">
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.label}</p>
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
            style={{ width: `${summary.percentage}%` }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Student Attendance
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Attendance records for approved club members
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">Student Name</th>
                <th className="px-5 py-4 font-semibold">Admission Number</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Marked At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {members.map((member, index) => (
                <tr key={member.studentId} className="hover:bg-gray-50">
                  <td className="px-5 py-4">{index + 1}</td>

                  <td className="px-5 py-4 font-medium text-gray-900">
                    {member.name}
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {member.admissionNumber}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        member.status === "present"
                          ? "bg-green-50 text-green-700"
                          : member.status === "absent"
                            ? "bg-red-50 text-red-700"
                            : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {member.status || "Unmarked"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {member.markedAt
                      ? new Date(member.markedAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}

              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    No approved members found for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
