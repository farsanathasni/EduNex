
"use client";

import { useState } from "react";

import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import Card from "@/components/ui/card";
import { useAccess } from "@/lib/navigation/access";

import {
  useCreateEventRequest,
  useMyEventRequestsQuery,
} from "@/features/events/api/event-query";

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "published":
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "published":
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function RequestEventPage() {
  const { me } = useAccess();

  const createMutation = useCreateEventRequest();

  const {
    data: myRequests = [],
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useMyEventRequestsQuery();

  const coordinatedClubs = me?.coordinatedClubs ?? [];

  const [clubId, setClubId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const resetForm = () => {
    setClubId("");
    setTitle("");
    setDescription("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    createMutation.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clubId) return;

    if (
      !startTime ||
      !endTime ||
      new Date(endTime) <= new Date(startTime)
    ) {
      return;
    }

    createMutation.mutate(
      {
        clubId: Number(clubId),
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      },
      {
        onSuccess: () => {
          resetForm();
          refetchRequests();
        },
      },
    );
  };

  return (
    <CoordinatorLayout>
      <div className="mx-auto max-w-4xl space-y-7 pb-10">
        {/* Header */}
        <section className="rounded-3xl bg-gradient-to-br from-[#19396f] via-[#234c96] to-[#315eaa] p-8 text-white shadow-lg">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
            CLUB COORDINATOR · EVENTS
          </span>

          <h1 className="mt-5 text-3xl font-bold">
            Request a New Event
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
            Submit your club event proposal for Principal approval.
            Once approved, the event will be published for students.
          </p>
        </section>

        {/* Event Request Form */}
        <Card className="border-border-subtle p-6 shadow-subtle sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-text">
              Event Information
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Provide the details of your proposed event.
            </p>
          </div>

          {coordinatedClubs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <h3 className="font-semibold text-text">
                No assigned clubs
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                You need a club coordinator assignment before submitting
                an event request.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Club */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Select Club *
                </label>

                <select
                  value={clubId}
                  onChange={(e) => setClubId(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                >
                  <option value="">Choose your assigned club</option>

                  {coordinatedClubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Event Title *
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  maxLength={200}
                  placeholder="Enter event title"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                  rows={4}
                  placeholder="Describe your event..."
                  className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-text">
                  Venue
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={255}
                  placeholder="Enter event venue"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Start Date & Time *
                  </label>

                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    End Date & Time *
                  </label>

                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    min={startTime || undefined}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Validation Message */}
              {startTime &&
                endTime &&
                new Date(endTime) <= new Date(startTime) && (
                  <p className="text-sm text-red-600">
                    End date and time must be after the start date and time.
                  </p>
                )}

              {/* Error */}
              {createMutation.isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {createMutation.error.message}
                </div>
              )}

              {/* Success */}
              {createMutation.isSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  Event request submitted successfully.
                  Waiting for Principal approval.
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-border-subtle pt-5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text transition hover:bg-background"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    !clubId ||
                    !title.trim() ||
                    !startTime ||
                    !endTime ||
                    new Date(endTime) <= new Date(startTime)
                  }
                  className="rounded-xl bg-[#234c96] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#19396f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createMutation.isPending
                    ? "Submitting..."
                    : "Submit Event Request"}
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* My Event Requests */}
        <Card className="border-border-subtle p-6 shadow-subtle sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-text">
                My Event Requests
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Track the approval status of your submitted event requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetchRequests()}
              disabled={requestsLoading}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text transition hover:bg-background disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {requestsLoading ? (
            <div className="py-8 text-center text-sm text-text-muted">
              Loading your event requests...
            </div>
          ) : requestsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Failed to load event requests. Please try again.
              <button
                type="button"
                onClick={() => refetchRequests()}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <h3 className="font-semibold text-text">
                No event requests yet
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                Your submitted event requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-border p-5 transition hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-text">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-text-muted">
                        {event.clubName}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        event.status,
                      )}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                  </div>

                  {event.description && (
                    <p className="mt-3 text-sm leading-6 text-text-muted">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-4 grid gap-3 border-t border-border-subtle pt-4 text-sm text-text-muted sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-text">Venue:</span>{" "}
                      {event.location || "Not specified"}
                    </p>

                    <p>
                      <span className="font-medium text-text">Start:</span>{" "}
                      {formatDateTime(event.startTime)}
                    </p>

                    <p>
                      <span className="font-medium text-text">End:</span>{" "}
                      {formatDateTime(event.endTime)}
                    </p>

                    <p>
                      <span className="font-medium text-text">Submitted:</span>{" "}
                      {new Date(event.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {event.status.toLowerCase() === "pending" && (
                    <p className="mt-3 text-xs font-medium text-amber-700">
                      Your request is waiting for Principal approval.
                    </p>
                  )}

                  {(event.status.toLowerCase() === "published" ||
                    event.status.toLowerCase() === "approved") && (
                    <p className="mt-3 text-xs font-medium text-green-700">
                      Your event has been approved and published.
                    </p>
                  )}

                  {event.status.toLowerCase() === "rejected" && (
                    <p className="mt-3 text-xs font-medium text-red-700">
                      Your event request was rejected.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </CoordinatorLayout>
  );
}
