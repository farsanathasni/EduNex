"use client";

import { useForm } from "react-hook-form";
import type { PendingEvent } from "@/features/hod/api/hod-event-approvals";

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

export default function EventApprovalCard({
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
