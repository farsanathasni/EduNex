"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/app/ui/pageHeader";
import {
  useHodPendingEvents,
  useReviewHodEvent,
} from "../../eventQuery";

type PendingEvent = {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  clubId: number;
  clubName: string;
};

type ReviewFormData = {
  comments: string;
};

type EventApprovalCardProps = {
  event: PendingEvent;
  processing: boolean;
  onReview: (
    eventId: number,
    decision: "approved" | "rejected",
    comments?: string,
  ) => Promise<void>;
};

function EventApprovalCard({
  event,
  processing,
  onReview,
}: EventApprovalCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      comments: "",
    },
  });

  const submitReview = async (
    decision: "approved" | "rejected",
    formData: ReviewFormData,
  ) => {
    await onReview(
      event.id,
      decision,
      formData.comments.trim() || undefined,
    );
  };

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{event.title}</h2>

          <p className="mt-1 text-sm font-medium text-primary">
            {event.clubName}
          </p>
        </div>

        <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent">
          Pending review
        </span>
      </div>

      {event.description && (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-text-muted">
          {event.description}
        </p>
      )}

      <div className="mt-5 grid gap-4 rounded-xl bg-secondary p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-text-muted">Location</p>
          <p className="mt-1 font-medium">
            {event.location || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-text-muted">Club ID</p>
          <p className="mt-1 font-medium">{event.clubId}</p>
        </div>

        <div>
          <p className="text-text-muted">Start date and time</p>
          <p className="mt-1 font-medium">
            {new Date(event.startTime).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-text-muted">End date and time</p>
          <p className="mt-1 font-medium">
            {new Date(event.endTime).toLocaleString()}
          </p>
        </div>
      </div>

      <form className="mt-5 space-y-4">
        <div>
          <label
            htmlFor={`comments-${event.id}`}
            className="mb-2 block text-sm font-semibold"
          >
            Review comments
            <span className="ml-1 font-normal text-text-muted">
              (optional)
            </span>
          </label>

          <textarea
            id={`comments-${event.id}`}
            rows={3}
            placeholder="Add feedback for the club..."
            aria-invalid={Boolean(errors.comments)}
            {...register("comments", {
              maxLength: {
                value: 1000,
                message: "Comments cannot exceed 1000 characters.",
              },
            })}
            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {errors.comments && (
            <p className="mt-1 text-sm text-red-600">
              {errors.comments.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={processing}
            onClick={handleSubmit((data) =>
              submitReview("rejected", data),
            )}
            className="rounded-xl border border-red-500 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Processing..." : "Reject event"}
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={handleSubmit((data) =>
              submitReview("approved", data),
            )}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Processing..." : "Approve event"}
          </button>
        </div>
      </form>
    </article>
  );
}

export default function EventApprovalsPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const {
    data: events = [],
    isLoading,
    isFetching,
    isError,
    error: fetchError,
    refetch,
  } = useHodPendingEvents();

  const reviewMutation = useReviewHodEvent();

  const [message, setMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(
    null,
  );

  // Redirect users who are not logged in.
  if (!isPending && !session) {
    router.replace("/hod/login");
  }

  const handleRefresh = async () => {
    await refetch();
  };

  const handleReview = async (
    eventId: number,
    decision: "approved" | "rejected",
    comments?: string,
  ) => {
    setProcessingId(eventId);
    setReviewError("");
    setMessage("");

    try {
      const response = await reviewMutation.mutateAsync({
        eventId,
        decision,
        comments,
      });

      setMessage(
        response?.message ??
          `Event ${
            decision === "approved" ? "approved" : "rejected"
          } successfully.`,
      );
    } catch (error) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      setReviewError(
        errorMessage ??
          `Unable to ${
            decision === "approved" ? "approve" : "reject"
          } this event. Please try again.`,
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-text-muted">
          Checking your session...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-text-muted">
          Redirecting to HOD login...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm text-text-muted">
              EduNex / HOD / Event Approvals
            </p>

            <PageHeader
              title="Event Approvals"
              description="Review events submitted by campus clubs and approve or reject them."
            />
          </div>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <span>↻</span>
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {message && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </div>
        )}

        {(reviewError || isError) && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>
              {reviewError ||
                (fetchError instanceof Error
                  ? fetchError.message
                  : "Unable to load pending events. Please try again.")}
            </p>

            {isError && (
              <button
                type="button"
                onClick={() => void handleRefresh()}
                className="font-semibold underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        <section>
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-surface p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-2xl">
              📋
            </div>

            <div>
              <p className="text-sm text-text-muted">
                Events awaiting your decision
              </p>

              <p className="mt-1 text-2xl font-bold">
                {isLoading ? "—" : events.length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
              <p className="text-text-muted">
                Loading pending events...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
              <div className="text-4xl">🎉</div>

              <h2 className="mt-4 text-xl font-bold">
                No pending events
              </h2>

              <p className="mt-2 text-sm text-text-muted">
                There are no events waiting for your review right now.
              </p>

              <button
                type="button"
                onClick={() => void handleRefresh()}
                disabled={isFetching}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {isFetching ? "Refreshing..." : "Check again"}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {events.map((event: PendingEvent) => (
                <EventApprovalCard
                  key={event.id}
                  event={event}
                  processing={processingId === event.id}
                  onReview={handleReview}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-border pt-5 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} EduNex · HOD Event Management
        </footer>
      </div>
    </main>
  );
}