"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, ShieldCheck, Search, Tag, X } from "lucide-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
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

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

function StatePanel({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  role = "status",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
  role?: "alert" | "status";
}) {
  return (
    <Card
      role={role}
      padding="lg"
      className="mx-auto flex max-w-xl flex-col items-center border-dashed px-6 py-14 text-center shadow-none"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
          tone === "error"
            ? "bg-accent-subtle text-accent"
            : "bg-primary-subtle text-primary"
        }`}
      >
        {icon}
      </div>
      <h2 className="mt-5 text-subheading font-bold text-text">{title}</h2>
      <p className="mt-2 max-w-md text-label text-text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

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
  const hasSearch = trimmedSearch.length > 0;
  const totalClubs = coordinatedClubs.length;

  return (
    <div className="space-y-8 pb-8">
      {/* Banner */}
      <section
        aria-labelledby="my-clubs-title"
        className="relative overflow-hidden rounded-3xl bg-brand px-6 py-9 text-text-on-primary shadow-lg sm:px-10 sm:py-11"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[36px] border-white/10"
        />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
              <ShieldCheck className="h-4 w-4" />
              Club coordinator
            </p>

            <h1
              id="my-clubs-title"
              className="mt-4 text-display-sm font-extrabold tracking-tight"
            >
              My clubs
            </h1>

            <p className="mt-3 text-body leading-relaxed text-white/80">
              The clubs assigned to your coordinator account. Use the
              coordinator tools to manage their members, membership requests
              and events.
            </p>
          </div>

          <div className="w-fit shrink-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
            <p className="text-heading font-extrabold leading-none">
              {totalClubs}
            </p>
            <p className="mt-1 text-caption text-white/80">
              {totalClubs === 1 ? "Assigned club" : "Assigned clubs"}
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section
        aria-labelledby="assigned-clubs-heading"
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h2
            id="assigned-clubs-heading"
            className="text-heading font-extrabold tracking-tight text-text"
          >
            Assigned clubs
          </h2>
          <p className="mt-1 text-label text-text-muted">
            Search the clubs you coordinate.
          </p>
        </div>

        <div className="w-full sm:max-w-sm">
          <label htmlFor="coordinator-club-search" className="sr-only">
            Search assigned clubs
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
            />
            <Input
              id="coordinator-club-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your clubs"
              className="rounded-xl py-3 pl-10 pr-10 shadow-sm [&::-webkit-search-cancel-button]:hidden"
            />
            {hasSearch && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className={`absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-text-subtle transition-colors hover:bg-secondary hover:text-text ${focusRing}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Loading */}
      {hasAssignedClubs && clubsQuery.isPending && (
        <div role="status" aria-label="Loading assigned clubs">
          <span className="sr-only">Loading assigned clubs...</span>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <ClubBrowseCardSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {hasAssignedClubs && !clubsQuery.isPending && clubsQuery.isError && (
        <StatePanel
          role="alert"
          tone="error"
          icon={<AlertCircle className="h-6 w-6" />}
          title="Unable to load your clubs"
          description="We couldn't load details for your assigned clubs. Please try again."
          action={
            <Button type="button" onClick={() => void clubsQuery.refetch()}>
              Try again
            </Button>
          }
        />
      )}

      {/* No assigned clubs */}
      {!hasAssignedClubs && (
        <StatePanel
          icon={<Tag className="h-6 w-6" />}
          title="No clubs assigned"
          description="Club information will appear here after a club is assigned to your coordinator account."
        />
      )}

      {/* No search results */}
      {!clubsQuery.isPending &&
        !clubsQuery.isError &&
        clubs.length > 0 &&
        filteredClubs.length === 0 && (
          <StatePanel
            icon={<Search className="h-6 w-6" />}
            title={`No assigned clubs found for \u201C${trimmedSearch}\u201D`}
            description="Try a different name or clear the search to see all your assigned clubs."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => setSearch("")}
              >
                Clear search
              </Button>
            }
          />
        )}

      {/* Club grid */}
      {!clubsQuery.isPending &&
        !clubsQuery.isError &&
        filteredClubs.length > 0 && (
          <>
            <p className="text-label text-text-muted" aria-live="polite">
              Showing {filteredClubs.length} of {clubs.length}{" "}
              {clubs.length === 1 ? "assigned club" : "assigned clubs"}
              {hasSearch ? ` matching \u201C${trimmedSearch}\u201D` : ""}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-primary-subtle px-4 py-2.5 text-caption font-semibold">
                      <span className="text-text-muted">Assigned to you</span>
                      <span className="inline-flex items-center gap-1.5 text-primary">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Coordinator access
                      </span>
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
