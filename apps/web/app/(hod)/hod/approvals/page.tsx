"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/ui/page-header";
import EventApprovalCard from "@/features/hod/components/event-approval-card";
import type { PendingEvent } from "@/features/hod/api/hod-event-approvals";
import { useHodPendingEvents } from "@/features/hod/api/hod-event-approvals-query";

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

  if (!isPending && !session) {
    router.replace("/hod/login");
  }

  const handleRefresh = async () => {
    await refetch();
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
              EduNex / HOD / Events
            </p>

            <PageHeader
              title="Department Events"
              description="View event requests submitted by clubs in your department. Event approval and publishing are managed by the Principal."
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

        {isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>
              {fetchError instanceof Error
                ? fetchError.message
                : "Unable to load department events. Please try again."}
            </p>

            <button
              type="button"
              onClick={() => void handleRefresh()}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        <section>
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-surface p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-2xl">
              📋
            </div>

            <div>
              <p className="text-sm text-text-muted">
                Department event requests
              </p>

              <p className="mt-1 text-2xl font-bold">
                {isLoading ? "—" : events.length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
              <p className="text-text-muted">
                Loading department events...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
              <div className="text-4xl">📭</div>

              <h2 className="mt-4 text-xl font-bold">
                No department events
              </h2>

              <p className="mt-2 text-sm text-text-muted">
                There are currently no event requests from clubs in your department.
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