
"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, ClipboardList, ChevronRight, Loader2 } from "lucide-react";
import { useHodAttendanceEvents } from "@/features/attendence/api/attendance-query";

export default function HodAttendancePage() {
  const router = useRouter();

  const { data: events, isLoading, isError, error } =
    useHodAttendanceEvents();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        Failed to load attendance reports: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Attendance Reports
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          View event attendance reports for your department.
        </p>
      </div>

      {!events || events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-3 font-semibold text-gray-800">
            No events found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No events are available for attendance reports.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-blue-600">
                    {event.clubName}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                  {event.status}
                </span>
              </div>

              {event.description && (
                <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                  {event.description}
                </p>
              )}

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {new Date(event.startTime).toLocaleDateString()}
                  </span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(`/attendance/hod/${event.id}`)
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                View Attendance
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
