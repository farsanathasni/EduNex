
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  Users,
  Sparkles,
  CalendarDays,
  PartyPopper,
} from "lucide-react";

import { useMyStudentMembershipRequestsQuery } from "@/features/clubs/api/club-query";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
    message: "Your request is waiting for coordinator approval.",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-200",
    message: "Congratulations! You are now a member of this club.",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
    message: "Your membership request was not approved.",
  },
};

export default function MyMembershipsPage() {
  const {
    data: memberships = [],
    isLoading,
    isError,
    refetch,
  } = useMyStudentMembershipRequestsQuery();

  const approvedCount = memberships.filter(
    (item) => item.status === "approved"
  ).length;

  const pendingCount = memberships.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/studentDashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mt-6">
          <PageHeader
            eyebrow="Campus Life"
            title="My Memberships"
            description="Keep track of your club applications and memberships."
          />
        </div>

        {/* Summary */}
        {!isLoading && !isError && memberships.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <Card className="border border-border">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-caption text-text-muted">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-text">
                    {memberships.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-caption text-text-muted">
                    Approved
                  </p>
                  <p className="text-2xl font-bold text-text">
                    {approvedCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                  <Clock3 size={22} />
                </div>
                <div>
                  <p className="text-caption text-text-muted">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-text">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </Card>

          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-5 w-1/3 rounded bg-secondary" />
                <div className="mt-3 h-4 w-2/3 rounded bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card className="mt-6 border border-border">
            <p className="font-semibold text-text">
              Unable to load membership requests.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Membership List */}
        {!isLoading && !isError && (
          <div className="mt-6 space-y-4">

            {memberships.length === 0 ? (
              <Card className="border border-dashed border-border py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles size={27} />
                </div>

                <h2 className="mt-4 text-lg font-bold text-text">
                  No membership requests yet
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
                  Discover campus clubs, explore your interests,
                  and become part of a community.
                </p>

                <div className="mt-5 flex justify-center">
                  <Link href="/clubs">
                    <Button>Explore clubs</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              memberships.map((membership) => {
                const status =
                  statusConfig[
                    membership.status as keyof typeof statusConfig
                  ] ?? statusConfig.pending;

                const StatusIcon = status.icon;

                return (
                  <Card
                    key={membership.id}
                    className="group border border-border transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      {/* Club Details */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Users size={23} />
                        </div>

                        <div>
                          <h2 className="text-base font-bold text-text">
                            {membership.clubName ||
                              `Club #${membership.clubId}`}
                          </h2>

                          <p className="mt-1 text-sm text-text-muted">
                            Request ID: #{membership.id}
                          </p>

                          <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                            <CalendarDays size={14} />
                            Membership application
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                        >
                          <StatusIcon size={15} />
                          {status.label}
                        </span>
                      </div>

                    </div>

                    {/* Status Message */}
                    <div className="mt-5 flex items-start gap-2 rounded-xl bg-secondary/60 p-3">
                      {membership.status === "approved" ? (
                        <PartyPopper
                          size={18}
                          className="mt-0.5 shrink-0 text-green-600"
                        />
                      ) : membership.status === "rejected" ? (
                        <XCircle
                          size={18}
                          className="mt-0.5 shrink-0 text-red-500"
                        />
                      ) : (
                        <Clock3
                          size={18}
                          className="mt-0.5 shrink-0 text-amber-600"
                        />
                      )}

                      <p className="text-sm text-text-muted">
                        {status.message}
                      </p>
                    </div>

                  </Card>
                );
              })
            )}
          </div>
        )}

      </div>
    </main>
  );
}
