"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStudentClubsQuery } from "../clubQuery";
import ClubCard from "./clubCard";
import PageHeader from "@/app/ui/pageHeader";
import Input from "@/app/ui/input";
import Card from "@/app/ui/card";


export default function StudentClubsPage() {
  const [search, setSearch] = useState("");
  const {
    data: clubs = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubsQuery();

  const filteredClubs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(term) ||
        (club.description ?? "").toLowerCase().includes(term),
    );
  }, [clubs, search]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
  href="/studentDashboard"
  className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-muted shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
>
  <span aria-hidden="true">←</span>
  Back to Dashboard
</Link>
        <header className="mt-2 overflow-hidden rounded-3xl bg-brand p-8 text-text-inverse sm:p-10">          <p className="text-label font-semibold uppercase tracking-[0.2em] text-white/75">
            EduNex · Campus Life
          </p>

          <h1 className="mt-3 text-display-sm font-extrabold tracking-tight">
            Discover Your Clubs
          </h1>

          <p className="mt-3 max-w-xl text-body leading-relaxed text-white/85">
            Explore your interests, meet new people, and find your campus
            community.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              title="Explore clubs"
              description={`${clubs.length} clubs available`}
            />

            <div className="w-full sm:max-w-sm">
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search clubs..."
                aria-label="Search clubs"
              />
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-5 w-2/3 rounded bg-secondary" />
                <div className="mt-4 h-4 rounded bg-secondary" />
                <div className="mt-2 h-4 w-4/5 rounded bg-secondary" />
                <div className="mt-6 h-10 rounded-lg bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Card className="mt-8 text-center">
            <p className="text-text">
              Unable to load clubs.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 font-semibold text-primary hover:text-primary-hover"
            >
              Try again
            </button>
          </Card>
        )}

        {!isLoading && !isError && (
          filteredClubs.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <Card className="mt-8 border-dashed py-12 text-center">
              <h2 className="text-subheading font-bold text-text">
                No clubs found
              </h2>
              <p className="mt-2 text-label text-text-muted">
                {search.trim()
                  ? "Try a different search term."
                  : "There are no clubs available yet."}
              </p>
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-label font-semibold text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </Card>
          )
        )}

        <div className="mt-8 flex justify-end">
          <Link
            href="/student/my-memberships"
            className="text-label font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            View my membership requests →
          </Link>
        </div>
      </div>
    </main>
  );
}