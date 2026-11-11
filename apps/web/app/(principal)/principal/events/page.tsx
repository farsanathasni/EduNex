
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPrincipalAllEvents,
  type PrincipalEvent,
} from "@/features/principal/api/principal";
import { usePublishPrincipalEvent } from "@/features/principal/api/principal-event-query";
import EventsTableSkeleton from "@/features/events/components/events-table-skeleton";

const statusStyles: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700",
  approved: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  published: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  completed: "bg-purple-100 text-purple-700",
  draft: "bg-gray-100 text-gray-700",
};

export default function PrincipalEventsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const publishMutation = usePublishPrincipalEvent();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["principal-all-events", page, search],
    queryFn: () => getPrincipalAllEvents(page, 10, search),
  });

  const events: PrincipalEvent[] = data?.data ?? [];
  const pagination = data?.pagination;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  const handlePublish = (event: PrincipalEvent) => {
    const confirmed = window.confirm(
      `Are you sure you want to publish "${event.title}"? Students will be able to see this event.`,
    );

    if (!confirmed) return;

    publishMutation.mutate(event.id);
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">College Events</h1>
        <p className="mt-1 text-sm text-text-muted">
          View all events from every department and track their status.
        </p>
      </div>

      {/* Search and refresh */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            publishMutation.reset();
          }}
          placeholder="Search by event name, description or location..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none"
        />

        <button
          onClick={() => refetch()}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-secondary"
        >
          Refresh
        </button>
      </div>

      {/* Publish feedback */}
      {publishMutation.isSuccess && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Event published successfully.
        </p>
      )}

      {publishMutation.isError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {publishMutation.error instanceof Error
            ? publishMutation.error.message
            : "Unable to publish event. Please try again."}
        </p>
      )}

      {/* Events table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="border-b border-border bg-surface-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">Club</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Start Date</th>
                <th className="px-4 py-3 font-semibold">End Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading && (
  <EventsTableSkeleton
    columns={[
      { width: "w-32", secondaryWidth: "w-44" },
      { width: "w-24" },
      { width: "w-28" },
      { width: "w-32" },
      { width: "w-32" },
      { width: "w-20", shape: "badge" },
      { width: "w-16", shape: "button" },
    ]}
  />
)}

              {isError && !isLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-red-600"
                  >
                    Unable to load college events.
                    <button
                      onClick={() => refetch()}
                      className="ml-2 underline"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              )}

              {!isLoading && !isError && events.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-text-muted"
                  >
                    No college events found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-surface-secondary/50"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium">{event.title}</p>
                      <p className="mt-1 max-w-[220px] truncate text-xs text-text-muted">
                        {event.description || "No description"}
                      </p>
                    </td>

                    <td className="px-4 py-4">{event.clubName}</td>

                    <td className="px-4 py-4">
                      {event.location || "Not specified"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {formatDate(event.startTime)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {formatDate(event.endTime)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[event.status] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {event.status === "approved" ? (
                        <button
                          onClick={() => handlePublish(event)}
                          disabled={publishMutation.isPending}
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {publishMutation.isPending &&
                          publishMutation.variables === event.id
                            ? "Publishing..."
                            : "Publish"}
                        </button>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-text-muted">
            Showing {events.length} of {pagination.total} events
          </p>

          <div className="flex items-center gap-3">
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-text-muted">
              Page {pagination.page} of{" "}
              {Math.max(pagination.totalPages, 1)}
            </span>

            <button
              disabled={page >= pagination.totalPages || isLoading}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
