"use client";

import Link from "next/link";
import { useMyStudentMembershipRequestsQuery } from "../../clubQuery";
import PageHeader from "@/app/ui/pageHeader";
import Card from "@/app/ui/card";
import Button from "@/app/ui/button";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import PageHeader from "@/components/ui/PageHeader";

export default function MyMembershipsPage() {
  const {
    data: memberships = [],
    isLoading,
    isError,
    refetch,
  } = useMyStudentMembershipRequestsQuery();

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/clubs"
          className="text-label font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          ← Back to clubs
        </Link>

        <div className="mt-6">
          <PageHeader
            eyebrow="Campus Life"
            title="My Membership Requests"
            description="Track the status of your club applications."
          />
        </div>

        {isLoading && (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-5 w-1/3 rounded bg-secondary" />
                <div className="mt-3 h-4 w-1/4 rounded bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Card className="mt-6">
            <p className="text-text">
              Unable to load membership requests.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-label font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </Card>
        )}

        {!isLoading && !isError && (
          <div className="mt-6 space-y-4">
            {memberships.length === 0 ? (
              <Card className="border-dashed py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-xl text-primary">
                  ✦
                </div>

                <h2 className="mt-4 text-subheading font-bold text-text">
                  No membership requests yet
                </h2>

                <p className="mt-2 text-label text-text-muted">
                  Explore clubs and send your first membership request.
                </p>

                <div className="mt-5 flex justify-center">
                  <Link href="/clubs">
                    <Button>Explore clubs</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              memberships.map((membership) => (
                <Card
                  key={membership.id}
                  className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h2 className="text-body font-bold text-text">
                      {membership.club?.name ??
                        `Club #${membership.clubId}`}
                    </h2>

                    <p className="mt-1 text-caption text-text-muted">
                      Request ID: {membership.id}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-border bg-secondary px-4 py-2 text-caption font-semibold capitalize text-secondary-foreground">
                    {membership.status}
                  </span>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}