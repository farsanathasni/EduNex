
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubAnnouncementsQuery } from "../../../clubQuery";

export default function ClubAnnouncementsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const { data: announcements = [], isLoading, isError } =
    useStudentClubAnnouncementsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return <main className="p-8">Invalid club ID.</main>;
  }

  if (isLoading) {
    return <main className="p-8">Loading announcements...</main>;
  }

  if (isError) {
    return (
      <main className="p-8 text-red-600">
        Unable to load announcements.
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
          Club Announcements
        </h1>

        {announcements.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-slate-600">
            No announcements available yet.
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <h2 className="text-xl font-semibold">
                  {announcement.title}
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-slate-600">
                  {announcement.content ||
                    announcement.message ||
                    "No content available."}
                </p>
                {announcement.createdAt && (
                  <p className="mt-3 text-sm text-slate-500">
                    {announcement.createdAt}
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
