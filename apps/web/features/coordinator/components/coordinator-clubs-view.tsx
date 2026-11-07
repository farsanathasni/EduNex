"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useStudentClubsQuery } from "@/features/clubs/api/club-query";
import {
  ClubBrowseCard,
  ClubBrowseCardSkeleton,
} from "@/features/clubs/components/club-browse-card";
import type { Club } from "@/features/clubs/api/clubs";
import { useDepartment } from "@/features/departments/api/department-query";
import { useAccess } from "@/lib/navigation/access";

const SKELETON_COUNT = 3;

export default function CoordinatorClubsView() {
  const [search, setSearch] = useState("");
  const { me } = useAccess();
  const coordinatedClubs = me?.coordinatedClubs ?? [];
  const hasAssignedClubs = coordinatedClubs.length > 0;

  const clubsQuery = useStudentClubsQuery(hasAssignedClubs);
  const departmentsQuery = useDepartment();
  const departments = departmentsQuery.data ?? [];

  const departmentNames = useMemo(
    () =>
      new Map(
        departments.map((department) => [department.id, department.name]),
      ),
    [departments],
  );

  const clubs = useMemo<Club[]>(() => {
    const clubDetails = new Map(
      (clubsQuery.data ?? []).map((club) => [club.id, club]),
    );

    return coordinatedClubs.map(
      (assignedClub) =>
        clubDetails.get(assignedClub.id) ?? {
          id: assignedClub.id,
          name: assignedClub.name,
          description: null,
          departmentId: null,
        },
    );
  }, [clubsQuery.data, coordinatedClubs]);

  const filteredClubs = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return clubs;

    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(term) ||
        club.description?.toLowerCase().includes(term),
    );
  }, [clubs, search]);

  const trimmedSearch = search.trim();
  const totalClubs = coordinatedClubs.length;

  return (
    <div className="space-y-7 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#19396f] via-primary to-[#315eaa] px-6 py-8 text-white sm:px-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[36px] border-white/[0.07]"
        />
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-wider text-blue-100">
            CLUB COORDINATOR
          </p>

          <h1 className="mt-3 text-3xl font-bold">My Clubs</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            These are the clubs assigned to your coordinator account. Only
            assigned clubs are shown here; use the coordinator tools to manage
            their members, membership requests, and events.
          </p>

          <div className="mt-6 inline-block rounded-xl border border-white/20 bg-white/10 px-5 py-3">
            <p className="text-2xl font-bold">{totalClubs}</p>
            <p className="text-xs text-blue-100">
              {totalClubs === 1 ? "Assigned club" : "Assigned clubs"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-text">Assigned clubs</h2>
            <p className="mt-1 text-sm text-text-muted">
              Search the clubs you coordinate.
            </p>
          </div>

          <div className="w-full sm:max-w-sm">
            <label htmlFor="coordinator-club-search" className="sr-only">
              Search assigned clubs
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
              <Input
                id="coordinator-club-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your clubs..."
                className="h-11 pl-11"
              />
            </div>
          </div>
        </div>
      </section>

      {hasAssignedClubs && clubsQuery.isPending && (
        <div role="status">
          <span className="sr-only">Loading assigned clubs...</span>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <ClubBrowseCardSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {hasAssignedClubs && !clubsQuery.isPending && clubsQuery.isError && (
        <section className="rounded-3xl border border-red-200 bg-red-50/60 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-text">
            Unable to load your clubs
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
            We could not load details for your assigned clubs. Please try
            again.
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

      {!hasAssignedClubs && (
        <section className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-subtle text-primary">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-text">
            No clubs assigned
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
            Club information will appear here after a club is assigned to your
            coordinator account.
          </p>
        </section>
      )}

      {!clubsQuery.isPending &&
        !clubsQuery.isError &&
        clubs.length > 0 &&
        filteredClubs.length === 0 && (
          <section className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-text-muted">
              <Search className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-text">
              No assigned clubs found for “{trimmedSearch}”
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
              Try a different name or clear the search to see all your assigned
              clubs.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSearch("")}
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
            <p
              className="text-sm font-medium text-text-muted"
              aria-live="polite"
            >
              Showing {filteredClubs.length} of {clubs.length}{" "}
              {clubs.length === 1 ? "assigned club" : "assigned clubs"}
              {trimmedSearch ? ` matching “${trimmedSearch}”` : ""}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredClubs.map((club) => (
                <ClubBrowseCard
                  key={club.id}
                  club={club}
                  badge="Coordinator"
                  departmentLabel={
                    club.departmentId === null
                      ? null
                      : departmentNames.get(club.departmentId)
                  }
                  footer={
                    <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-text-muted">
                      <span>Assigned to you</span>
                      <span className="text-primary">Coordinator access</span>
                    </div>
                  }
                />
              ))}
            </div>
          </>
        )}
    </div>
  );
}
