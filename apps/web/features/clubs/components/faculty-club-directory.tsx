"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input"
import { useClubsQuery } from "@/features/clubs/api/club-query"
import {
  ClubBrowseCard,
  ClubBrowseCardSkeleton,
} from "@/features/clubs/components/club-browse-card";
import { useDepartment } from "@/features/departments/api/department-query";

const INITIAL_VISIBLE_CLUBS = 9;
const LOAD_MORE_COUNT = 6;

export default function FacultyClubDirectory() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CLUBS);

  const clubsQuery = useClubsQuery();
  const departmentsQuery = useDepartment();

  const clubs = clubsQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];

  const departmentNames = useMemo(
    () =>
      new Map(
        departments.map((department) => [department.id, department.name]),
      ),
    [departments],
  );

  const filteredClubs = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return clubs;

    return clubs.filter((club) =>
      club.name.toLowerCase().includes(term),
    );
  }, [clubs, search]);

  const visibleClubs = filteredClubs.slice(0, visibleCount);
  const hasMore = visibleClubs.length < filteredClubs.length;
  const trimmedSearch = search.trim();

  const updateSearch = (value: string) => {
    setSearch(value);
    setVisibleCount(INITIAL_VISIBLE_CLUBS);
  };

  const totalLabel = clubsQuery.isPending
    ? "Loading campus clubs"
    : clubsQuery.isError
      ? "Club directory unavailable"
      : `${clubs.length} ${clubs.length === 1 ? "club" : "clubs"} on campus`;

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-subtle transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">←</span>
          Back to Faculty Dashboard
        </Link>

        <section className="relative isolate mt-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[#2c5bab] to-[#4777c7] px-6 py-10 text-white shadow-xl shadow-primary/10 sm:px-10 sm:py-12 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full border-[48px] border-white/[0.07]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 right-[24%] -z-10 h-56 w-56 rounded-full bg-white/[0.06]"
          />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Faculty · Club directory
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Campus Clubs
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/90 sm:text-base">
              Browse the college&apos;s clubs and their departments. This
              directory is read-only; club management remains with the
              Principal and department Heads.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/85">
              <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2">
                {totalLabel}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2">
                View-only faculty access
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-surface p-4 shadow-subtle sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Discover campus communities
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                Browse all clubs
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Search by club name across every club on campus.
              </p>
            </div>

            <div className="w-full lg:max-w-md">
              <label htmlFor="faculty-club-search" className="sr-only">
                Search clubs by name
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                <Input
                  id="faculty-club-search"
                  type="text"
                  inputMode="search"
                  autoComplete="off"
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search clubs by name..."
                  className="h-12 rounded-2xl pl-11 pr-11 text-sm shadow-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => updateSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-lg text-text-subtle transition hover:bg-secondary hover:text-text"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {clubsQuery.isPending && (
          <div role="status" className="mt-8">
            <span className="sr-only">Loading clubs...</span>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: INITIAL_VISIBLE_CLUBS }, (_, index) => (
                <ClubBrowseCardSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {!clubsQuery.isPending && clubsQuery.isError && (
          <section className="mt-8 rounded-3xl border border-red-200 bg-red-50/60 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-text">
              Unable to load clubs
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
              The club directory could not be loaded. Please try again in a
              moment.
            </p>
            <Button
              type="button"
              onClick={() => void clubsQuery.refetch()}
              className="mt-6"
            >
              Try again
            </Button>
          </section>
        )}

        {!clubsQuery.isPending &&
          !clubsQuery.isError &&
          clubs.length === 0 && (
            <section className="mt-8 rounded-3xl border border-dashed border-border bg-surface p-10 text-center sm:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-subtle text-primary">
                <Search className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-text">
                No clubs available yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                Clubs will appear in this directory once they are added to
                campus.
              </p>
            </section>
          )}

        {!clubsQuery.isPending &&
          !clubsQuery.isError &&
          clubs.length > 0 &&
          filteredClubs.length === 0 && (
            <section className="mt-8 rounded-3xl border border-dashed border-border bg-surface p-10 text-center sm:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-text-muted">
                <Search className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-text">
                No clubs found for “{trimmedSearch}”
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                Try a shorter or different club name, or clear your search to
                see every club on campus.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => updateSearch("")}
                className="mt-6"
              >
                Clear search
              </Button>
            </section>
          )}

        {!clubsQuery.isPending &&
          !clubsQuery.isError &&
          filteredClubs.length > 0 && (
            <>
              <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
                <p
                  className="text-sm font-medium text-text-muted"
                  aria-live="polite"
                >
                  Showing {visibleClubs.length} of {filteredClubs.length}{" "}
                  {filteredClubs.length === 1 ? "club" : "clubs"}
                  {trimmedSearch ? ` matching “${trimmedSearch}”` : ""}
                </p>
                <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-subtle">
                  {filteredClubs.length === 1
                    ? "1 result"
                    : `${filteredClubs.length} results`}
                </span>
              </div>

              <div
                id="faculty-club-grid"
                className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleClubs.map((club) => (
                  <ClubBrowseCard
                    key={club.id}
                    club={club}
                    departmentLabel={
                      club.departmentId === null
                        ? undefined
                        : departmentNames.get(club.departmentId)
                    }
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-9 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setVisibleCount(
                        (current) => current + LOAD_MORE_COUNT,
                      )
                    }
                    aria-controls="faculty-club-grid"
                    className="rounded-2xl px-7"
                  >
                    Load more clubs
                    <span aria-hidden="true">↓</span>
                  </Button>
                </div>
              )}
            </>
          )}
      </div>
    </main>
  );
}
