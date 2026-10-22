
"use client";

import Link from "next/link";
import { useMyStudentMembershipRequestsQuery } from "../../clubQuery";
// import { useMyStudentMembershipRequestsQuery } from "../../../clubQuery";

export default function MyMembershipsPage() {
  const { data: memberships = [], isLoading, isError, refetch } =
    useMyStudentMembershipRequestsQuery();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/student/clubs"
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          ← Back to clubs
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          My Membership Requests
        </h1>
        <p className="mt-2 text-slate-500">
          Track the status of your club applications.
        </p>

        {isLoading && (
          <p className="py-10 text-slate-500">Loading requests...</p>
        )}

        {isError && (
          <div className="mt-6 rounded-xl bg-white p-6">
            <p className="text-red-600">Unable to load membership requests.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 font-semibold text-teal-700"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mt-6 space-y-4">
            {memberships.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="font-semibold text-slate-800">
                  No membership requests yet
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Explore clubs and send your first request.
                </p>
                <Link
                  href="/student/clubs"
                  className="mt-5 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
                >
                  Explore clubs
                </Link>
              </div>
            ) : (
              memberships.map((membership) => (
                <article
                  key={membership.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {membership.club?.name ??
                        `Club #${membership.clubId}`}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Request ID: {membership.id}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold capitalize text-slate-700">
                    {membership.status}
                  </span>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
