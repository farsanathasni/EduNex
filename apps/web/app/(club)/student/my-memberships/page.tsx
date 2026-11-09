"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
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
/* Presentational pieces                                                      */
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
        <p className="text-caption font-medium text-text-muted">{label}</p>
        <p className="mt-0.5 text-heading-sm font-extrabold leading-tight text-text">
          {value}
        </p>
      </div>
    </Card>
  );
}

function MembershipSkeleton() {
  return (
    <Card aria-hidden="true" padding="lg" className="animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-secondary-hover" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-secondary-hover" />
          <div className="h-3 w-1/4 rounded bg-secondary-hover" />
        </div>
        <div className="h-7 w-24 rounded-full bg-secondary-hover" />
      </div>
      <div className="mt-5 h-10 rounded-lg bg-secondary-hover" />
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function MyMembershipsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const {
    data: memberships = [],
    isLoading,
    isError,
    refetch,
  } = useMyStudentMembershipRequestsQuery();

  const counts = useMemo(
    () => ({
      all: memberships.length,
      approved: memberships.filter((item) => item.status === "approved").length,
      pending: memberships.filter((item) => item.status === "pending").length,
      rejected: memberships.filter((item) => item.status === "rejected").length,
    }),
    [memberships],
  );

  const visibleMemberships = useMemo(
    () =>
      filter === "all"
        ? memberships
        : memberships.filter((item) => item.status === filter),
    [memberships, filter],
  );

  const showResults = !isLoading && !isError;
  const hasMemberships = showResults && memberships.length > 0;

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/studentDashboard"
          className={`group mb-6 inline-flex items-center gap-2 rounded-lg text-label font-semibold text-text-muted transition-colors hover:text-primary ${focusRing}`}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>

        {/* Banner header */}
        <header
          className={`relative overflow-hidden rounded-3xl bg-brand px-6 pt-10 text-text-on-primary shadow-lg sm:px-10 sm:pt-12 ${
            hasMemberships ? "pb-20 sm:pb-24" : "pb-10 sm:pb-12"
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
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[36px] border-white/10"
          />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-label font-semibold text-white/80">
                Campus life
              </p>
              <h1 className="mt-2 text-display-sm font-extrabold tracking-tight">
                My memberships
              </h1>
              <p className="mt-3 text-body leading-relaxed text-white/80">
                Track your club applications and see where each one stands.
              </p>
            </div>

            <Link
              href="/clubs"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-label font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Browse clubs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Summary overlapping the banner edge */}
        {hasMemberships && (
          <section
            aria-label="Membership summary"
            className="relative z-10 -mt-12 grid grid-cols-1 gap-4 px-3 sm:grid-cols-3 sm:px-8"
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

        {/* Filters */}
        {hasMemberships && (
          <div
            role="group"
            aria-label="Filter requests by status"
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            {filters.map(({ key, label }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-label font-semibold transition-colors ${focusRing} ${
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
        )}

        <div className="mt-6">
          {/* Loading */}
          {isLoading && (
            <div
              role="status"
              aria-label="Loading membership requests"
              className="space-y-4"
            >
              {[1, 2, 3].map((item) => (
                <MembershipSkeleton key={item} />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <Card
              role="alert"
              padding="lg"
              className="flex flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-subheading font-bold text-text">
                Unable to load membership requests
              </h2>
              <p className="mt-2 max-w-md text-label text-text-muted">
                Something went wrong while fetching your requests. Check your
                connection and try again.
              </p>
              <Button className="mt-6" onClick={() => refetch()}>
                Try again
              </Button>
            </Card>
          )}

          {/* Empty */}
          {showResults && memberships.length === 0 && (
            <Card
              role="status"
              padding="lg"
              className="flex flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <Inbox className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-subheading font-bold text-text">
                No membership requests yet
              </h2>
              <p className="mt-2 max-w-sm text-label text-text-muted">
                Browse campus clubs and send a request to join the ones that
                interest you.
              </p>
              <Link
                href="/clubs"
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-label font-semibold text-primary-foreground transition-colors hover:bg-primary-hover ${focusRing}`}
              >
                Explore clubs
              </Link>
            </Card>
          )}

          {/* Filter has no matches */}
          {hasMemberships && visibleMemberships.length === 0 && (
            <Card
              role="status"
              padding="lg"
              className="flex flex-col items-center border-dashed px-6 py-12 text-center shadow-none"
            >
              <p className="text-label text-text-muted">
                No {filter} requests right now.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                Show all requests
              </Button>
            </Card>
          )}

          {/* List */}
          {hasMemberships && visibleMemberships.length > 0 && (
            <ul className="space-y-4">
              {visibleMemberships.map((membership) => {
                const status = resolveStatus(membership.status);
                const StatusIcon = status.icon;
                const clubName =
                  membership.clubName || `Club #${membership.clubId}`;

                return (
                  <li key={membership.id}>
                    <Card
                      padding="lg"
                      className="relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-0 left-0 w-1 ${status.accentBar}`}
                      />

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            aria-hidden="true"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-body-lg font-extrabold text-primary"
                          >
                            {clubName.trim().charAt(0).toUpperCase() || "#"}
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-body font-bold text-text">
                              {clubName}
                            </h2>
                            <p className="mt-0.5 text-caption text-text-muted">
                              Request ID: #{membership.id}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-semibold ${status.badge}`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-4 flex items-start gap-2.5 rounded-lg bg-secondary px-3.5 py-3 text-label text-text-muted">
                        <StatusIcon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${status.badge
                            .split(" ")
                            .filter((c) => c.startsWith("text-"))
                            .join(" ")}`}
                        />
                        {status.message}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
