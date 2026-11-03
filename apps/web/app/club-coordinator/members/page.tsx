
"use client";

import { useState } from "react";
import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import { useCoordinatorClubMembers } from "@/features/coordinator/api/coordinator-query";

// import CoordinatorLayout from "@/components/club-coordinator/CoordinatorLayout";
// import Card from "@/app/ui/card";
// import PageHeader from "@/app/ui/pageHeader";
// import { useCoordinatorClubMembers } from "../coordinatorquery";


type MembershipStatus = "approved" | "rejected";

export default function ClubMembersPage() {
  const [activeFilter, setActiveFilter] =
    useState<MembershipStatus>("approved");

  const {
    data: members = [],
    isPending,
    isError,
    refetch,
  } = useCoordinatorClubMembers();

  const filteredMembers = members.filter(
    (member) => member.status === activeFilter,
  );

  const approvedCount = members.filter(
    (member) => member.status === "approved",
  ).length;

  const rejectedCount = members.filter(
    (member) => member.status === "rejected",
  ).length;

  const clubName = members[0]?.clubName ?? "Club Members";

  return (
    <CoordinatorLayout>
      <div className="space-y-7 pb-8">

        {/* Header */}
        <section className="rounded-3xl bg-gradient-to-br from-[#19396f] via-primary to-[#315eaa] px-6 py-8 text-white sm:px-9">
          <p className="text-xs font-semibold tracking-wider text-blue-100">
            CLUB MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {clubName}
          </h1>

          <p className="mt-3 text-sm text-blue-100">
            Manage and view students who applied for your club membership.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3">
              <p className="text-2xl font-bold">
                {approvedCount}
              </p>
              <p className="text-xs text-blue-100">
                Approved Members
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-3">
              <p className="text-2xl font-bold">
                {rejectedCount}
              </p>
              <p className="text-xs text-blue-100">
                Rejected Requests
              </p>
            </div>
          </div>
        </section>

        {/* Members Section */}
        <section>
          <PageHeader
            title="Club Members"
            description="View approved and rejected student membership applications."
          />

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveFilter("approved")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeFilter === "approved"
                  ? "bg-primary text-white"
                  : "border border-border bg-white text-text-muted hover:bg-primary-subtle"
              }`}
            >
              Approved ({approvedCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("rejected")}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                activeFilter === "rejected"
                  ? "bg-primary text-white"
                  : "border border-border bg-white text-text-muted hover:bg-primary-subtle"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Loading */}
          {isPending && (
            <Card className="mt-5 p-8 text-center">
              <p className="text-sm text-text-muted">
                Loading club members...
              </p>
            </Card>
          )}

          {/* Error */}
          {isError && (
            <Card className="mt-5 p-8 text-center">
              <p className="font-semibold text-text">
                Unable to load club members.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-primary px-5 py-2 text-white hover:bg-primary-hover"
              >
                Try again
              </button>
            </Card>
          )}

          {/* Empty State */}
          {!isPending && !isError && filteredMembers.length === 0 && (
            <Card className="mt-5 border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-2xl">
                {activeFilter === "approved" ? "👥" : "📋"}
              </div>

              <h3 className="mt-4 font-bold text-text">
                {activeFilter === "approved"
                  ? "No approved members yet"
                  : "No rejected requests"}
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                {activeFilter === "approved"
                  ? "Approved students will appear here."
                  : "Rejected membership applications will appear here."}
              </p>
            </Card>
          )}

          {/* Member Cards */}
          {!isPending && !isError && filteredMembers.length > 0 && (
            <div className="mt-5 space-y-4">
              {filteredMembers.map((member) => (
                <Card
                  key={member.studentId}
                  className="border-border-subtle p-5 shadow-subtle sm:p-6"
                >
                  {/* Student Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-text">
                        {member.studentName}
                      </h2>

                      <p className="mt-1 text-sm text-text-muted">
                        {member.admissionNumber}
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        {member.clubName}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        member.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {member.status === "approved"
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="mt-5 grid gap-5 border-t border-border-subtle pt-5 sm:grid-cols-2 lg:grid-cols-3">

                    <div>
                      <p className="text-xs text-text-muted">
                        Email
                      </p>
                      <p className="mt-1 break-all text-sm font-medium text-text">
                        {member.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-muted">
                        Phone
                      </p>
                      <p className="mt-1 text-sm font-medium text-text">
                        {member.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-muted">
                        Department
                      </p>
                      <p className="mt-1 text-sm font-medium text-text">
                        {member.departmentName} ({member.departmentCode})
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-muted">
                        Semester
                      </p>
                      <p className="mt-1 text-sm font-medium text-text">
                        {member.semester}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-text-muted">
                        {member.status === "approved"
                          ? "Approved Date"
                          : "Reviewed Date"}
                      </p>

                      <p className="mt-1 text-sm font-medium text-text">
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString(
                              "en-IN",
                            )
                          : "Not available"}
                      </p>
                    </div>

                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </CoordinatorLayout>
  );
}
