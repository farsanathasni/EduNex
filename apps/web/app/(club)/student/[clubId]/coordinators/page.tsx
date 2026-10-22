
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubCoordinatorsQuery } from "../../../clubQuery";

export default function ClubCoordinatorsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const { data: coordinators = [], isLoading, isError } =
    useStudentClubCoordinatorsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return <main className="p-8">Invalid club ID.</main>;
  }

  if (isLoading) {
    return <main className="p-8">Loading coordinators...</main>;
  }

  if (isError) {
    return (
      <main className="p-8 text-red-600">
        Unable to load coordinators.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/student/${clubId}`}
          className="text-teal-700 hover:underline"
        >
          ← Back to club
        </Link>

        <h1 className="my-6 text-3xl font-bold text-slate-900">
          Club Coordinators
        </h1>

        {coordinators.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-slate-600">
            No coordinators available yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {coordinators.map((coordinator) => (
              <article
                key={coordinator.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold">
                  {coordinator.name}
                </h2>
                {coordinator.email && (
                  <p className="mt-2 break-words text-slate-600">
                    {coordinator.email}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
