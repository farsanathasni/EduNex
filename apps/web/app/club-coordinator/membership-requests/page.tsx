
"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Mail,
  Phone,
  Users,
  XCircle,
  CalendarDays,
  Building2,
  Hash,
  ShieldCheck,
  Search,
} from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

import {
  useCoordinatorMembershipRequests,
  useReviewClubMembershipRequest,
} from "@/features/coordinator/api/coordinator-query";

import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import { useAccess } from "@/lib/navigation/access";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/features/coordinator/components/pagination";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatRequestedDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
/* Reusable components                                                        */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card
      padding="lg"
      className="flex items-center gap-4 border-border-subtle shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        {icon}
      </div>

      <div>
        <p className="text-caption font-medium text-text-muted">{label}</p>
        <p className="mt-1 text-heading-sm font-extrabold leading-none text-text">
          {value}
        </p>
      </div>
    </Card>
  );
}

function StudentDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) {
  const hasValue =
    value !== null && value !== undefined && value !== "";

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-text-muted">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-caption font-medium text-text-subtle">
          {label}
        </p>

        <p className="mt-1 break-words text-label font-semibold text-text">
          {hasValue ? value : "Not provided"}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 grid gap-5">
      {[1, 2].map((item) => (
        <Card
          key={item}
          padding="lg"
          className="overflow-hidden border-border-subtle"
        >
          {/* Student heading */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>

            <Skeleton className="h-7 w-28 rounded-full" />
          </div>

          {/* Student information */}
          <div className="mt-6 rounded-2xl bg-background p-4 sm:p-5">
            <div className="mb-5 flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((field) => (
                <div key={field} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-64" />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-10 w-full rounded-xl sm:w-24" />
              <Skeleton className="h-10 w-full rounded-xl sm:w-36" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      padding="lg"
      className="mt-6 flex flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
        {icon}
      </div>

      <h3 className="mt-5 text-subheading font-bold text-text">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-label leading-6 text-text-muted">
        {description}
      </p>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function MembershipRequestsPage() {
  const [selectedClubId, setSelectedClubId] =
    useState<number | "all">("all");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 6;

  const { me } = useAccess();

  const coordinatedClubs = me?.coordinatedClubs ?? [];

  const assignedClubIds = useMemo(
    () => new Set(coordinatedClubs.map((club) => club.id)),
    [coordinatedClubs],
  );

  const hasAssignedClubs = coordinatedClubs.length > 0;

  /* ---------------------------------------------------------------------- */
  /* Membership requests query                                              */
  /* ---------------------------------------------------------------------- */

  const {
    data,
    isPending,
    isError,
    refetch,
  } = useCoordinatorMembershipRequests(
    {
      search: search.trim(),
      page,
      limit,
    },
    hasAssignedClubs,
  );

  const requests = data?.requests ?? [];
  const pagination = data?.pagination;

  // Only show requests belonging to assigned clubs.
  const assignedRequests = requests.filter((request) =>
    assignedClubIds.has(request.clubId),
  );

  // Apply selected club filter.
  const visibleRequests = assignedRequests.filter(
    (request) =>
      selectedClubId === "all" || request.clubId === selectedClubId,
  );

  /* ---------------------------------------------------------------------- */
  /* Mutation                                                               */
  /* ---------------------------------------------------------------------- */

  const reviewMutation = useReviewClubMembershipRequest();

  const handleReview = (
    requestId: number,
    decision: "approved" | "rejected",
  ) => {
    reviewMutation.mutate({ requestId, decision });
  };

  /* ---------------------------------------------------------------------- */
  /* Handlers                                                               */
  /* ---------------------------------------------------------------------- */

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleClubChange = (value: string) => {
    setSelectedClubId(
      value === "all" ? "all" : Number(value),
    );
    setPage(1);
  };

  return (
    <CoordinatorLayout>
      <main className="space-y-8 pb-8">

        {/* Hero section */}
        <section className="relative overflow-hidden rounded-3xl bg-brand px-6 py-9 text-text-on-primary shadow-lg sm:px-10 sm:py-11">

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

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 right-[20%] h-56 w-56 rounded-full bg-white/[0.06]"
          />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
              <Users className="h-4 w-4" />
              CLUB MANAGEMENT · APPLICATIONS
            </span>

            <h1 className="mt-5 text-display-sm font-extrabold tracking-tight sm:text-display">
              Membership Requests
            </h1>

            <p className="mt-4 max-w-2xl text-body leading-relaxed text-white/80">
              Manage your club community by reviewing student applications.
              Check their details and decide who can become a member of your
              assigned clubs.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="min-w-36 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-heading font-extrabold leading-none">
                  {pagination?.total ?? 0}
                </p>

                <p className="mt-2 text-caption text-white/80">
                  Total matching requests
                </p>
              </div>

              <div className="min-w-36 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-heading font-extrabold leading-none">
                  {coordinatedClubs.length}
                </p>

                <p className="mt-2 text-caption text-white/80">
                  Assigned clubs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application section */}
        <section>
          <div>
            <p className="text-caption font-semibold uppercase tracking-wider text-primary">
              Review and manage
            </p>

            <h2 className="mt-2 text-heading-lg font-extrabold text-text">
              Student Applications
            </h2>

            <p className="mt-1.5 text-label text-text-muted">
              Review student information before making your decision.
            </p>
          </div>

          {/* Search */}
          <Card
            padding="md"
            className="mt-6 border-border-subtle shadow-subtle"
          >
            <label
              htmlFor="request-search"
              className="mb-2 block text-label font-semibold text-text"
            >
              Search applications
            </label>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

              <input
                id="request-search"
                type="search"
                value={search}
                onChange={(event) =>
                  handleSearch(event.target.value)
                }
                placeholder="Search by student name, admission number or email..."
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-label text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </Card>

          {/* Club filter */}
          {coordinatedClubs.length > 1 && (
            <div className="mt-5">
              <label className="block w-full sm:max-w-xs">
                <span className="mb-2 block text-caption font-semibold text-text-muted">
                  Filter by assigned club
                </span>

                <select
                  value={selectedClubId}
                  onChange={(event) =>
                    handleClubChange(event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-label font-medium text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="all">All assigned clubs</option>

                  {coordinatedClubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* No assigned clubs */}
          {!hasAssignedClubs ? (
            <EmptyState
              icon={<GraduationCap className="h-7 w-7" />}
              title="No clubs assigned"
              description="Membership applications will appear here after a club is assigned to your coordinator account. Contact your HOD for more information."
            />
          ) : isPending ? (
            <LoadingState />
          ) : isError ? (
            <>
              <Card
                padding="lg"
                role="alert"
                className="mt-6 border-dashed py-12 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent">
                  <AlertCircle className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-subheading font-bold text-text">
                  Unable to load membership requests
                </h3>

                <p className="mt-2 text-label text-text-muted">
                  Please check your connection and try again.
                </p>

                <Button
                  className="mt-5"
                  onClick={() => void refetch()}
                >
                  Try again
                </Button>
              </Card>
            </>
          ) : visibleRequests.length === 0 ? (
            <EmptyState
              icon={
                search.trim() ? (
                  <Search className="h-7 w-7" />
                ) : (
                  <Users className="h-7 w-7" />
                )
              }
              title={
                search.trim()
                  ? "No matching requests found"
                  : "No pending requests"
              }
              description={
                search.trim()
                  ? "Try another student name, admission number or email address."
                  : "There are no student membership applications to review for this selection. New applications will appear here when students apply."
              }
            />
          ) : (
            <div className="mt-6 space-y-5">
              {visibleRequests.map((request) => (
                <Card
                  key={request.requestId}
                  padding="lg"
                  className="overflow-hidden border-border-subtle shadow-subtle transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  {/* Student heading */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                        <GraduationCap className="h-7 w-7" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-subheading font-extrabold text-text">
                          {request.studentName}
                        </h3>

                        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-label text-text-muted">
                          Applied to
                          <span className="font-semibold text-primary">
                            {request.clubName}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-caption font-semibold text-amber-700">
                      <Clock3 className="h-3.5 w-3.5" />
                      Pending review
                    </span>
                  </div>

                  {/* Student details */}
                  <div className="mt-6 rounded-2xl bg-background p-4 sm:p-5">
                    <div className="mb-5 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                        <ShieldCheck className="h-4 w-4" />
                      </div>

                      <h4 className="text-label font-bold text-text">
                        Student information
                      </h4>
                    </div>

                    <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                      <StudentDetail
                        icon={<Hash className="h-4 w-4" />}
                        label="Admission number"
                        value={request.admissionNumber}
                      />

                      <StudentDetail
                        icon={<Mail className="h-4 w-4" />}
                        label="Email address"
                        value={request.email}
                      />

                      <StudentDetail
                        icon={<Phone className="h-4 w-4" />}
                        label="Phone number"
                        value={request.phone || "Not provided"}
                      />

                      <StudentDetail
                        icon={<Building2 className="h-4 w-4" />}
                        label="Department"
                        value={
                          request.departmentName
                            ? `${request.departmentName}${
                                request.departmentCode
                                  ? ` (${request.departmentCode})`
                                  : ""
                              }`
                            : "Not available"
                        }
                      />

                      <StudentDetail
                        icon={<GraduationCap className="h-4 w-4" />}
                        label="Semester"
                        value={request.semester}
                      />

                      <StudentDetail
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Requested date"
                        value={formatRequestedDate(request.requestedAt)}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-caption text-text-muted">
                      Review the application before confirming your decision.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          handleReview(request.requestId, "rejected")
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-red-600 hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>

                      <Button
                        type="button"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          handleReview(request.requestId, "approved")
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />

                        {reviewMutation.isPending
                          ? "Processing..."
                          : "Approve request"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {hasAssignedClubs &&
            !isPending &&
            !isError &&
            visibleRequests.length > 0 &&
            pagination &&
            pagination.totalPages > 1 && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            )}

          {/* Mutation error */}
          {reviewMutation.isError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <p>
                {reviewMutation.error.message ||
                  "Unable to update membership request. Please try again."}
              </p>
            </div>
          )}
        </section>
      </main>
    </CoordinatorLayout>
  );
}
