
"use client";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { useCoordinatorMembershipRequests, useReviewClubMembershipRequest } from "@/features/coordinator/api/coordinator-query";
import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import { useMemo, useState } from "react";
import { useAccess } from "@/lib/navigation/access";





export default function MembershipRequestsPage() {
  const [selectedClubId, setSelectedClubId] = useState<number | "all">("all");
  const { me } = useAccess();
  const coordinatedClubs = me?.coordinatedClubs ?? [];
  const assignedClubIds = useMemo(() => new Set(coordinatedClubs.map((club) => club.id)), [coordinatedClubs]);
  const hasAssignedClubs = coordinatedClubs.length > 0;
  const {
    data: requests = [],
    isPending,
    isError,
    refetch,
  } = useCoordinatorMembershipRequests(hasAssignedClubs);
  const assignedRequests = requests.filter((request) => assignedClubIds.has(request.clubId));
  const visibleRequests = assignedRequests.filter((request) => selectedClubId === "all" || request.clubId === selectedClubId);

  const reviewMutation = useReviewClubMembershipRequest();

  const handleReview = (
    requestId: number,
    decision: "approved" | "rejected",
  ) => {
    reviewMutation.mutate({ requestId, decision });
  };

  return (
    <CoordinatorLayout>
      <div className="space-y-7 pb-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#19396f] via-primary to-[#315eaa] px-6 py-8 text-white sm:px-9">
          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-wider text-blue-100">
              CLUB MANAGEMENT
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Membership Requests
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
              Review student applications, view their details,
              and manage membership requests for your assigned clubs.
            </p>

            <div className="mt-6 inline-block rounded-xl border border-white/20 bg-white/10 px-5 py-3">
              <p className="text-2xl font-bold">
                {visibleRequests.length}
              </p>
              <p className="text-xs text-blue-100">
                Pending requests
              </p>
            </div>
          </div>
        </section>

        {/* Request list */}
        <section>
          <PageHeader
            title="Student Applications"
            description="Review the details before approving or rejecting a request."
          />

          {coordinatedClubs.length > 1 && (
            <label className="mt-5 block max-w-sm text-sm font-medium text-text-muted">
              Club
              <select value={selectedClubId} onChange={(event) => setSelectedClubId(event.target.value === "all" ? "all" : Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-text">
                <option value="all">All assigned clubs</option>
                {coordinatedClubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}
              </select>
            </label>
          )}

          {!hasAssignedClubs ? (
            <Card className="mt-5 border-dashed p-12 text-center">
              <h3 className="font-bold text-text">No clubs assigned</h3>
              <p className="mt-2 text-sm text-text-muted">Membership requests will appear here after a club is assigned to your coordinator account.</p>
            </Card>
          ) : isPending ? (
            <Card className="mt-5 p-8 text-center">
              <p className="text-sm text-text-muted">
                Loading membership requests...
              </p>
            </Card>
          ) : isError ? (
            <Card className="mt-5 p-8 text-center">
              <p className="font-semibold text-text">
                Unable to load membership requests.
              </p>
              <Button
                className="mt-4"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </Card>
          ) : visibleRequests.length === 0 ? (
            <Card className="mt-5 border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-2xl">
                👥
              </div>

              <h3 className="mt-4 font-bold text-text">
                No pending requests
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                Student membership applications will appear here.
              </p>
            </Card>
          ) : (
            <div className="mt-5 space-y-5">
              {visibleRequests.map((request) => (
                <Card
                  key={request.requestId}
                  className="border-border-subtle p-5 shadow-subtle sm:p-6"
                >
                  {/* Student and club */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-text">
                        {request.studentName}
                      </h2>

                      <p className="mt-1 text-sm text-text-muted">
                        Applied to {request.clubName}
                      </p>
                    </div>

                    <span className="rounded-full bg-accent-subtle px-3 py-1.5 text-xs font-semibold text-accent">
                      Pending
                    </span>
                  </div>

                  {/* Student details */}
                  <div className="mt-6 grid gap-5 border-t border-border-subtle pt-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-text-subtle">
                        Admission Number
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-text">
                        {request.admissionNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-subtle">
                        Email
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-text">
                        {request.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-subtle">
                        Phone
                      </p>
                      <p className="mt-1 text-sm font-semibold text-text">
                        {request.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-subtle">
                        Department
                      </p>
                      <p className="mt-1 text-sm font-semibold text-text">
                        {request.departmentName} ({request.departmentCode})
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-subtle">
                        Semester
                      </p>
                      <p className="mt-1 text-sm font-semibold text-text">
                        {request.semester}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-subtle">
                        Requested Date
                      </p>
                      <p className="mt-1 text-sm font-semibold text-text">
                        {new Date(request.requestedAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border-subtle pt-5">
                    <Button
                      type="button"
                      disabled={reviewMutation.isPending}
                      onClick={() =>
                        handleReview(request.requestId, "rejected")
                      }
                      className="rounded-xl border border-red-300 px-5 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Reject
                    </Button>

                    <Button
                      type="button"
                      disabled={reviewMutation.isPending}
                      onClick={() =>
                        handleReview(request.requestId, "approved")
                      }
                      className="rounded-xl bg-primary px-5 py-2 text-white hover:bg-primary-hover disabled:opacity-50"
                    >
                      Approve
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {reviewMutation.isError && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {reviewMutation.error.message ||
                "Unable to update membership request."}
            </p>
          )}
        </section>
      </div>
    </CoordinatorLayout>
  );
}
