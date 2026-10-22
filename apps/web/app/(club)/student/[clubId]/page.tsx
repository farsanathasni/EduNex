
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCreateStudentMembershipRequestMutation, useMyStudentMembershipRequestsQuery, useStudentClubByIdQuery } from "../../clubQuery";
// import {
//   useStudentClubByIdQuery,
//   useCreateStudentMembershipRequestMutation,
//   useMyStudentMembershipRequestsQuery,
// } from "../../../clubQuery";

export default function ClubDetailsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const { data: club, isLoading, isError } =
    useStudentClubByIdQuery(clubId);

  const { data: memberships = [] } =
    useMyStudentMembershipRequestsQuery();

  const membershipMutation =
    useCreateStudentMembershipRequestMutation();

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return <main className="p-8">Invalid club ID.</main>;
  }

  if (isLoading) {
    return <main className="p-8 text-slate-500">Loading club...</main>;
  }

  if (isError || !club) {
    return <main className="p-8 text-red-600">Unable to load club details.</main>;
  }

  const membership = memberships.find(
    (item) => item.clubId === clubId,
  );

  const status = membership?.status?.toLowerCase();
  const alreadyRequested = Boolean(membership);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/student/clubs"
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          ← Back to clubs
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-2xl text-teal-800">
            ✦
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            {club.name}
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {club.description || "No description is available yet."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/student/${clubId}/events`}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Club events
            </Link>

            <Link
              href={`/student/${clubId}/announcement`}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Announcements
            </Link>

            <Link
              href={`/student/${clubId}/coordinators`}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Coordinators
            </Link>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            {alreadyRequested ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                Membership status:{" "}
                <strong className="capitalize">{status}</strong>
              </p>
            ) : (
              <button
                type="button"
                disabled={membershipMutation.isPending}
                onClick={() => membershipMutation.mutate(clubId)}
                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {membershipMutation.isPending
                  ? "Sending request..."
                  : "Request to Join"}
              </button>
            )}

            {membershipMutation.isError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {membershipMutation.error instanceof Error
                  ? membershipMutation.error.message
                  : "Unable to submit your request."}
              </p>
            )}

            {membershipMutation.isSuccess && (
              <p role="status" className="mt-3 text-sm text-green-700">
                Membership request submitted.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
