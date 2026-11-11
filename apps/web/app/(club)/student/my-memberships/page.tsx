
"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Inbox,
  XCircle,
} from "lucide-react";

import { useMyStudentMembershipRequestsQuery } from "@/features/clubs/api/club-query";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type StatusKey = "pending" | "approved" | "rejected";
type FilterKey = "all" | StatusKey;

type StatusStyle = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge: string;
  accentBar: string;
  iconTint: string;
  message: string;
};

const statusConfig: Record<StatusKey, StatusStyle> = {
  pending: {
    label: "Pending",
    icon: Clock3,
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    accentBar: "bg-amber-500",
    iconTint: "bg-amber-500/10 text-amber-600",
    message: "Your request is waiting for coordinator approval.",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badge: "border-green-500/30 bg-green-500/10 text-green-700",
    accentBar: "bg-green-500",
    iconTint: "bg-green-500/10 text-green-600",
    message: "You are now a member of this club.",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badge: "border-red-500/30 bg-red-500/10 text-red-700",
    accentBar: "bg-red-500",
    iconTint: "bg-red-500/10 text-red-600",
    message: "Your membership request was not approved.",
  },
};

function resolveStatus(status: string): StatusStyle {
  return statusConfig[status as StatusKey] ?? statusConfig.pending;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

type SummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  iconClassName?: string;
};

function SummaryCard({
  icon,
  label,
  value,
  iconClassName = "bg-primary-subtle text-primary",
}: SummaryCardProps) {
  return (
    <Card
      padding="lg"
      className="flex items-center gap-4 shadow-lg transition-shadow duration-200 hover:shadow-xl"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-caption font-medium text-text-muted">
          {label}
        </p>

        <p className="mt-0.5 text-heading-sm font-extrabold leading-tight text-text">
          {value}
        </p>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* My Memberships Loading Skeleton                                            */
/* -------------------------------------------------------------------------- */

function MyMembershipsPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-5 w-40" />

        {/* Header */}
        <section className="rounded-3xl bg-brand px-6 py-10 sm:px-10 sm:py-12">
          <Skeleton className="h-4 w-28 bg-white/20" />
          <Skeleton className="mt-4 h-10 w-64 max-w-full bg-white/20" />
          <Skeleton className="mt-4 h-4 w-full max-w-md bg-white/20" />
          <Skeleton className="mt-3 h-4 w-3/4 max-w-sm bg-white/20" />
          <Skeleton className="mt-8 h-11 w-36 rounded-lg bg-white/20" />
        </section>

        {/* Summary cards */}
        <section className="relative z-10 -mt-8 grid gap-4 px-3 sm:grid-cols-3 sm:px-8">
          {[1, 2, 3].map((item) => (
            <Card
              key={item}
              padding="lg"
              className="flex items-center gap-4"
            >
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
            </Card>
          ))}
        </section>

        {/* Membership list */}
        <div
          role="status"
          aria-label="Loading membership requests"
          className="mt-8 space-y-4"
        >
          {[1, 2, 3].map((item) => (
            <Card key={item} aria-hidden="true" padding="lg">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>

                <Skeleton className="h-7 w-24 rounded-full" />
              </div>

              <Skeleton className="mt-5 h-10 w-full rounded-lg" />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* State Panel                                                                */
/* -------------------------------------------------------------------------- */

function StatePanel({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  role = "status",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
  role?: "alert" | "status";
}) {
  return (
    <Card
      role={role}
      padding="lg"
      className="mx-auto flex max-w-xl flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
          tone === "error"
            ? "bg-accent-subtle text-accent"
            : "bg-primary-subtle text-primary"
        }`}
      >
        {icon}
      </div>

      <h2 className="mt-5 text-subheading font-bold text-text">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-label text-text-muted">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* My Memberships Page                                                        */
/* -------------------------------------------------------------------------- */

export default function MyMembershipsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const {
    data: memberships = [],
    isLoading,
    isError,
    refetch,
  } = useMyStudentMembershipRequestsQuery();

  /* Membership counts */

  const counts = useMemo(
    () => ({
      all: memberships.length,
      approved: memberships.filter(
        (item) => item.status === "approved"
      ).length,
      pending: memberships.filter(
        (item) => item.status === "pending"
      ).length,
      rejected: memberships.filter(
        (item) => item.status === "rejected"
      ).length,
    }),
    [memberships]
  );

  /* Filter membership requests */

  const visibleMemberships = useMemo(
    () =>
      filter === "all"
        ? memberships
        : memberships.filter(
            (item) => item.status === filter
          ),
    [memberships, filter]
  );

  const hasMemberships =
    !isLoading && !isError && memberships.length > 0;

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  /* Loading State */

  if (isLoading) {
    return <MyMembershipsPageSkeleton />;
  }

  /* Error State */

  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <StatePanel
          role="alert"
          tone="error"
          icon={<AlertCircle className="h-6 w-6" />}
          title="Unable to load membership requests"
          description="Something went wrong while fetching your requests. Check your connection and try again."
          action={
            <Button onClick={() => void refetch()}>
              Try again
            </Button>
          }
        />
      </main>
    );
  }

  /* Main Page */

  return (
    <main className="min-h-full bg-background text-text">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Hero section */}

        <section
          aria-labelledby="membership-hero-title"
          className={`relative overflow-hidden rounded-3xl bg-brand px-6 pt-12 text-text-on-primary shadow-lg sm:px-10 sm:pt-16 ${
            hasMemberships
              ? "pb-24 sm:pb-28"
              : "pb-12 sm:pb-16"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[40px] border-white/10"
          />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
                <FileText className="h-4 w-4" />
                Campus life · Club community
              </span>

              <h1
                id="membership-hero-title"
                className="mt-5 text-display-sm font-extrabold tracking-tight sm:text-display"
              >
                My memberships
              </h1>

              <p className="mt-4 max-w-xl text-body leading-relaxed text-white/80">
                Track your club applications, manage your
                membership requests and see where each
                application stands.
              </p>
            </div>

            <Link
              href="/student"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-label font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Browse clubs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Statistics cards */}

        {hasMemberships && (
          <section
            aria-label="Membership summary"
            className="relative z-10 -mt-12 grid gap-4 px-3 sm:grid-cols-3 sm:px-8"
          >
            <SummaryCard
              icon={<FileText className="h-6 w-6" />}
              label="Total requests"
              value={counts.all}
            />

            <SummaryCard
              icon={<CheckCircle2 className="h-6 w-6" />}
              label="Approved"
              value={counts.approved}
              iconClassName={statusConfig.approved.iconTint}
            />

            <SummaryCard
              icon={<Clock3 className="h-6 w-6" />}
              label="Pending"
              value={counts.pending}
              iconClassName={statusConfig.pending.iconTint}
            />
          </section>
        )}

        {/* Membership listing */}

        <section
          aria-labelledby="membership-list-heading"
          className={`${hasMemberships ? "mt-14" : "mt-10"}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="membership-list-heading"
                className="text-heading-lg font-extrabold tracking-tight text-text"
              >
                Your club applications
              </h2>

              <p className="mt-1.5 text-label text-text-muted">
                Check the latest status of your membership requests.
              </p>
            </div>

            {hasMemberships && (
              <p className="text-label text-text-muted">
                <span className="font-semibold text-text">
                  {memberships.length}
                </span>{" "}
                {memberships.length === 1
                  ? "request"
                  : "requests"}{" "}
                found
              </p>
            )}
          </div>

          {/* Empty state */}

          {memberships.length === 0 && (
            <div className="mt-7">
              <StatePanel
                icon={<Inbox className="h-6 w-6" />}
                title="No membership requests yet"
                description="Browse campus clubs and send a request to join the ones that interest you."
                action={
                  <Link
                    href="/student"
                    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-label font-semibold text-primary-foreground transition-colors hover:bg-primary-hover ${focusRing}`}
                  >
                    Explore clubs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            </div>
          )}

          {/* Filters */}

          {hasMemberships && (
            <>
              <div
                role="group"
                aria-label="Filter requests by status"
                className="mt-7 flex flex-wrap items-center gap-2"
              >
                {filters.map(({ key, label }) => {
                  const active = filter === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(key)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-label font-semibold transition-colors ${focusRing} ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-surface text-text-muted hover:bg-secondary hover:text-text"
                      }`}
                    >
                      {label}

                      <span
                        className={`rounded-full px-2 py-0.5 text-caption ${
                          active
                            ? "bg-white/20 text-primary-foreground"
                            : "bg-secondary text-text-muted"
                        }`}
                      >
                        {counts[key]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filter empty state */}

              {visibleMemberships.length === 0 && (
                <div className="mt-7">
                  <StatePanel
                    icon={<Inbox className="h-6 w-6" />}
                    title={`No ${filter} requests`}
                    description={`You don't have any ${filter} membership requests right now.`}
                    action={
                      <Button
                        variant="outline"
                        onClick={() => setFilter("all")}
                      >
                        Show all requests
                      </Button>
                    }
                  />
                </div>
              )}

              {/* Membership cards */}

              {visibleMemberships.length > 0 && (
                <ul className="mt-7 grid gap-5 lg:grid-cols-2">
                  {visibleMemberships.map((membership) => {
                    const status = resolveStatus(membership.status);
                    const StatusIcon = status.icon;

                    const clubName =
                      membership.clubName ||
                      `Club #${membership.clubId}`;

                    return (
                      <li key={membership.id}>
                        <Card
                          padding="lg"
                          className="relative h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                          <span
                            aria-hidden="true"
                            className={`absolute inset-y-0 left-0 w-1 ${status.accentBar}`}
                          />

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                              <div
                                aria-hidden="true"
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-heading-sm font-extrabold text-primary"
                              >
                                {clubName.trim().charAt(0).toUpperCase() || "#"}
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate text-body-lg font-bold text-text">
                                  {clubName}
                                </h3>

                                <p className="mt-1 text-caption text-text-muted">
                                  Request ID: #{membership.id}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption font-semibold ${status.badge}`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {status.label}
                            </span>
                          </div>

                          <div className="mt-5 rounded-xl bg-secondary px-4 py-3">
                            <p className="flex items-start gap-2.5 text-label leading-relaxed text-text-muted">
                              <StatusIcon
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                  status.badge
                                    .split(" ")
                                    .filter((c) => c.startsWith("text-"))
                                    .join(" ")
                                }`}
                              />

                              {status.message}
                            </p>
                          </div>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
