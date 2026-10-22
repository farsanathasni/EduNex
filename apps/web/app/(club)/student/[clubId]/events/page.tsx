
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubEventsQuery } from "../../../clubQuery";

export default function ClubEventsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const { data: events = [], isLoading, isError } =
    useStudentClubEventsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return <main className="p-8">Invalid club ID.</main>;
  }

  if (isLoading) return <main className="p-8">Loading events...</main>;

  if (isError) {
    return <main className="p-8 text-red-600">Unable to load events.</main>;
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
          Club Events
        </h1>

        {events.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-slate-600">
            No events available for this club yet.
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="mt-2 text-slate-600">
                  {event.description || "No description available."}
                </p>
                {(event.startDate || event.date) && (
                  <p className="mt-3 text-sm text-slate-500">
                    Date: {event.startDate || event.date}
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
