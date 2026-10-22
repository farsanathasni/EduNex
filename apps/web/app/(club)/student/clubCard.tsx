
import Link from "next/link";
import type { Club } from "@/lib/clubs";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-xl text-teal-800">
        ✦
      </div>

      <h2 className="text-lg font-bold text-slate-900">
        {club.name}
      </h2>

      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
        {club.description || "Explore activities and connect with students."}
      </p>

      <Link
        href={`/student/${club.id}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800"
      >
        View Club
      </Link>
    </article>
  );
}
