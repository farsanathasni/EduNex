
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPrincipalEvents,
  type PrincipalEvent,
} from "@/features/principal/api/principal";
import { useReviewPrincipalEvent } from "@/features/principal/api/principal-event-query";

export default function PrincipalApprovalsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["principal-events", page, search],
    queryFn: () => getPrincipalEvents(page, 10, search),
  });

  const reviewMutation = useReviewPrincipalEvent();

  const events = data?.data ?? [];
  const pagination = data?.pagination;

  const handleReview = async (
    event: PrincipalEvent,
    decision: "approved" | "rejected",
  ) => {
    const action = decision === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${event.title}"?`,
    );

    if (!confirmed) return;

    try {
      await reviewMutation.mutateAsync({
        eventId: event.id,
        decision,
      });
    } catch (error) {
      const message =
        (error as {
          response?: { data?: { message?: string } };
        })?.response?.data?.message ?? "Unable to review this event.";

      window.alert(message);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="mt-1 text-sm text-text-muted">
          Review event requests that require Principal authorization.
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

      {/* Events table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="border-b border-border bg-surface-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">Club</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Start Date</th>
                <th className="px-4 py-3 font-semibold">End Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                    Loading event requests...
                  </td>
                </tr>
              )}

              {isError && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-red-600">
                    Unable to load event requests.
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
                  <td colSpan={7} className="px-4 py-10 text-center text-text-muted">
                    No pending event requests found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-secondary/50">
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
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        {event.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleReview(event, "approved")}
                          disabled={reviewMutation.isPending}
                          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReview(event, "rejected")}
                          disabled={reviewMutation.isPending}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
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
            Showing {events.length} of {pagination.total} requests
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
              Page {pagination.page} of {pagination.totalPages || 1}
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
