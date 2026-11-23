"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Building2,
  Compass,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ClubBrowseCard, ClubBrowseCardSkeleton } from "@/features/clubs/components/club-browse-card";
import { useStudentClubsQuery } from "@/features/clubs/api/club-query";
import { useDepartment } from "@/features/departments/api/department-query";

const INITIAL_VISIBLE_CLUBS = 6;
const LOAD_MORE_COUNT = 6;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";
const onBrandFocusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60";

/* -------------------------------------------------------------------------- */
/* Presentational pieces                                                      */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card
      padding="lg"
      className="flex items-center gap-4 shadow-lg transition-shadow duration-200 hover:shadow-xl"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-caption font-medium text-text-muted">{label}</p>
        <p className="mt-0.5 text-heading-sm font-extrabold leading-tight text-text">
          {value}
        </p>
        {hint && <p className="mt-0.5 text-caption text-text-subtle">{hint}</p>}
      </div>
    </Card>
  );
}

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
      <h3 className="mt-5 text-subheading font-bold text-text">{title}</h3>
      <p className="mt-2 max-w-md text-label text-text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */


function StudentClubDiscoverySkeleton() {
  return (
    <PageContainer className="space-y-8 py-6 sm:py-8">
      <PageHeader eyebrow="Student life" title="Explore Clubs" description="Find a community that fits your interests." />
      <div className="rounded-3xl bg-surface p-8 sm:p-10" aria-hidden="true">
        <Skeleton className="h-7 w-48 rounded-full" />
        <Skeleton className="mt-6 h-10 w-64 max-w-full" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <div className="mt-8 flex gap-3"><Skeleton className="h-11 w-36 rounded-lg" /><Skeleton className="h-11 w-40 rounded-lg" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item} padding="lg" className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2"><Skeleton className="h-3 w-28" /><Skeleton className="h-6 w-36" /></div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: INITIAL_VISIBLE_CLUBS }, (_, index) => <ClubBrowseCardSkeleton key={index} />)}
      </div>
    </PageContainer>
  );
}


export default function StudentClubDiscovery() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CLUBS);

  useRegisterHeaderSearch({
    value: search,
    onChange: (value) => {
      setSearch(value);
      setVisibleCount(INITIAL_VISIBLE_CLUBS);
    },
    placeholder: "Search clubs by name or description",
  });

  const clubsQuery = useStudentClubsQuery();
  const departmentsQuery = useDepartment();

  const clubs = clubsQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];

  const departmentNames = useMemo(
    () => new Map(departments.map((department) => [department.id, department.name])),
    [departments],
  );

  const departmentsRepresented = useMemo(
    () =>
      new Set(
        clubs.map((club) => club.departmentId).filter((id) => id !== null && id !== undefined),
      ).size,
    [clubs],
  );

  const filteredClubs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clubs;
    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(term) ||
        (club.description ?? "").toLowerCase().includes(term),
    );
  }, [clubs, search]);

  const visibleClubs = filteredClubs.slice(0, visibleCount);
  const hasMore = visibleClubs.length < filteredClubs.length;
  const trimmedSearch = search.trim();
  const clearSearch = () => {
    setSearch("");
    setVisibleCount(INITIAL_VISIBLE_CLUBS);
  };
  const showResults = !clubsQuery.isLoading && !clubsQuery.isError;

  if (clubsQuery.isLoading) {
    return <StudentClubDiscoverySkeleton />;
  }

  return (
    <PageContainer className="space-y-8 py-6 sm:py-8">
      <PageHeader
        eyebrow="Student life"
        title="Explore Clubs"
        description="Find a community that fits your interests, meet new people and make the most of your campus journey."
        action={
          showResults ? (
            <p className="text-label text-text-muted" aria-live="polite">
              <span className="font-semibold text-text">{filteredClubs.length}</span> of {clubs.length} clubs
            </p>
          ) : null
        }
      />

      <section aria-labelledby="discovery-title" className="relative overflow-hidden rounded-3xl bg-brand px-6 pb-24 pt-10 text-text-on-primary shadow-lg sm:px-10 sm:pb-28 sm:pt-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[40px] border-white/10" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-caption font-semibold text-white/90">
            <GraduationCap className="h-4 w-4" />
            Campus communities
          </span>
          <h2 id="discovery-title" className="mt-5 text-display-sm font-extrabold tracking-tight sm:text-display">
            Find your people
          </h2>
          <p className="mt-4 max-w-xl text-body leading-relaxed text-white/80">
            Explore campus clubs, discover new interests, and join communities that make college feel like home.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#clubs" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-label font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover ${onBrandFocusRing}`}>
              Browse clubs <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/student/my-memberships" className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-label font-semibold text-white transition-colors hover:bg-white/20 ${onBrandFocusRing}`}>
              My memberships
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Club overview" className="relative z-10 -mt-12 grid gap-4 px-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <StatCard icon={<Users className="h-6 w-6" />} label="Clubs available" value={showResults ? clubs.length : "–"} hint="Open for membership requests" />
        <StatCard icon={<Building2 className="h-6 w-6" />} label="Departments represented" value={showResults ? departmentsRepresented : "–"} hint="Clubs across campus" />
        <Link href="/student/my-memberships" className={`group block rounded-2xl sm:col-span-2 lg:col-span-1 ${focusRing}`}>
          <Card padding="lg" className="flex h-full items-center gap-4 shadow-lg transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent"><BadgeCheck className="h-6 w-6" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-caption font-medium text-text-muted">Your activity</p>
              <p className="mt-0.5 text-label font-semibold text-text">View membership requests</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Card>
        </Link>
      </section>

      <section id="clubs" aria-labelledby="clubs-heading" className="scroll-mt-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="clubs-heading" className="text-heading-lg font-extrabold tracking-tight text-text">Browse all clubs</h2>
            <p className="mt-1.5 text-label text-text-muted">Discover student communities and find your interests.</p>
          </div>
          {search && <Button variant="outline" size="sm" onClick={clearSearch}>Clear search</Button>}
        </div>

        {!clubsQuery.isLoading && clubsQuery.isError && (
          <StatePanel role="alert" tone="error" icon={<AlertCircle className="h-6 w-6" />} title="Unable to load clubs" description="Something went wrong while fetching the club directory. Please try again in a moment." action={<Button type="button" onClick={() => void clubsQuery.refetch()}>Try again</Button>} />
        )}
        {showResults && clubs.length === 0 && (
          <StatePanel icon={<Compass className="h-6 w-6" />} title="No clubs to explore yet" description="Clubs will appear here as soon as they are added to campus. Check back soon to discover your community." />
        )}
        {showResults && clubs.length > 0 && filteredClubs.length === 0 && (
          <StatePanel icon={<Search className="h-6 w-6" />} title={`No clubs found for “${trimmedSearch}”`} description="Try a different keyword or clear your search to see every club on campus." action={<Button type="button" variant="outline" onClick={clearSearch}>Clear search</Button>} />
        )}
        {showResults && filteredClubs.length > 0 && (
          <>
            <p className="text-label text-text-muted" aria-live="polite">
              Showing {visibleClubs.length} of {filteredClubs.length} {filteredClubs.length === 1 ? "club" : "clubs"}
              {trimmedSearch ? ` matching “${trimmedSearch}”` : ""}
            </p>
            <div id="student-club-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleClubs.map((club) => (
                <ClubBrowseCard
                  key={club.id}
                  club={club}
                  departmentLabel={club.departmentId === null ? undefined : departmentNames.get(club.departmentId)}
                  href={`/student/${club.id}`}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center">
                <Button type="button" variant="outline" size="lg" onClick={() => setVisibleCount((current) => current + LOAD_MORE_COUNT)} aria-controls="student-club-grid" className="w-full sm:w-auto sm:px-8">
                  Load more clubs <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-border bg-primary-subtle px-6 py-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-subheading font-bold text-text">Already applied to a club?</h2>
          <p className="mt-1 text-label text-text-muted">Track your membership requests and check their status.</p>
        </div>
        <Link href="/student/my-memberships" className={`inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-label font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto ${focusRing}`}>
          View my requests <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </PageContainer>
  );
}
