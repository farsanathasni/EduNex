
"use client";

import { useMemo, useState } from "react";
import { useStudentClubsQuery } from "../clubQuery";
import ClubCard from "./clubCard";
// import ClubCard from "@/components/clubs/ClubCard";
// import { useStudentClubsQuery } from "../../clubQuery";

export default function StudentClubsPage() {
  const [search, setSearch] = useState("");
  const { data: clubs = [], isLoading, isError, refetch } =
    useStudentClubsQuery();

  const filteredClubs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(term) ||
        (club.description ?? "").toLowerCase().includes(term),
    );
  }, [clubs, search]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl bg-gradient-to-r from-cyan-800 to-teal-600 p-8 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-100">
            EduNex · Campus Life
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Discover Your Clubs
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cyan-50">
            Explore your interests, meet new people, and find your
            campus community.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Explore clubs
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {clubs.length} clubs available
            </p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clubs..."
            aria-label="Search clubs"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:max-w-sm"
          />
        </div>

        {isLoading && (
          <p className="py-12 text-center text-slate-500">
            Loading clubs...
          </p>
        )}

        {isError && (
          <div className="mt-8 rounded-xl bg-white p-6 text-center">
            <p className="text-red-600">Unable to load clubs.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 font-semibold text-teal-700"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          filteredClubs.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="font-semibold text-slate-800">
                No clubs found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try a different search.
              </p>
            </div>
          )
        )}

        <div className="mt-8 text-right">
          <a
            href="/student/clubs/my-memberships"
            className="text-sm font-semibold text-teal-700 hover:underline"
          >
            View my membership requests →
          </a>
        </div>
      </div>
    </main>
  );
}
