import type { PendingEvent } from "@/features/hod/api/hod-event-approvals";

type EventApprovalCardProps = {
  event: PendingEvent;
};

export default function EventApprovalCard({
  event,
}: EventApprovalCardProps) {
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
          {event.status}
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

      <div className="mt-5 rounded-xl border border-border p-4">
        <p className="text-sm font-semibold">Approval information</p>
        <p className="mt-1 text-sm text-text-muted">
          Event decisions and publishing are handled by the Principal.
        </p>
      </div>
    </article>
  );
}