import type { AuditEventItem } from "../api/lost-found-query";
import {
  auditActionLabel,
  formatLostFoundDateTime,
} from "../utils/lost-found-ui";

export default function AuditTimeline({
  events,
}: {
  events: AuditEventItem[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-semibold text-text">Audit trail</h3>
      {events.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">
          No activity has been recorded yet.
        </p>
      ) : (
        <ol className="mt-4 space-y-4 border-l border-border pl-4">
          {events.map((event) => (
            <li key={event.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <p className="text-sm font-medium text-text">
                {auditActionLabel(event.action)}
              </p>
              <p className="text-xs text-text-muted">
                {event.actorName ?? "System"} ·{" "}
                {formatLostFoundDateTime(event.createdAt)}
              </p>
              {event.itemTitle && (
                <p className="mt-1 text-xs text-text-muted">
                  {event.itemTitle}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
