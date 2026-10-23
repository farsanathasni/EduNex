"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCreateStudentMembershipRequestMutation,
  useMyStudentMembershipRequestsQuery,
  useStudentClubByIdQuery,
} from "../../clubQuery";

const quickLinks = [
  {
    title: "Club Events",
    description: "Discover activities, workshops, and upcoming events.",
    icon: "📅",
    href: "events",
    accent: "bg-blue-100 text-blue-700",
    number: "01",
  },
  {
    title: "Announcements",
    description: "Stay updated with the latest club news and notices.",
    icon: "📢",
    href: "announcement",
    accent: "bg-orange-100 text-orange-700",
    number: "02",
  },
  {
    title: "Coordinators",
    description: "Connect with the people leading your club.",
    icon: "👥",
    href: "coordinators",
    accent: "bg-emerald-100 text-emerald-700",
    number: "03",
  },
];

export default function ClubDetailsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: club,
    isLoading,
    isError,
    refetch,
  } = useStudentClubByIdQuery(clubId);

  const { data: memberships = [] } =
    useMyStudentMembershipRequestsQuery();

  const membershipMutation =
    useCreateStudentMembershipRequestMutation();

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-8 text-text">
        Invalid club ID.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-secondary" />
          <div className="h-64 rounded-3xl bg-secondary" />
          <div className="grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-48 rounded-2xl bg-secondary" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError || !club) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 text-text">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="text-4xl">🏫</div>
          <h1 className="mt-4 text-xl font-bold">Unable to load this club</h1>
          <p className="mt-2 text-sm text-text-muted">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const membership = memberships.find(
    (item) => item.clubId === clubId,
  );

  const status = membership?.status?.toLowerCase();
  const alreadyRequested = Boolean(membership);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/student"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">←</span>
          All clubs
        </Link>

        {/* Hero section */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-primary text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 right-1/4 h-56 w-56 rounded-full bg-white/5"
          />

          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                EDUNEX CAMPUS COMMUNITY
              </div>

              <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Welcome to
                <span className="mt-1 block break-words text-blue-100">
                  {club.name}
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                {club.description ||
                  "Find your community, discover new interests, and make your campus experience more meaningful."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {alreadyRequested ? (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-primary">
                    <span aria-hidden="true">✓</span>
                    {status === "approved"
                      ? "Membership approved"
                      : status === "rejected"
                        ? "Request rejected"
                        : "Request submitted"}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={membershipMutation.isPending}
                    onClick={() => membershipMutation.mutate(clubId)}
                    className="rounded-xl bg-white px-6 py-3.5 font-bold text-primary shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {membershipMutation.isPending
                      ? "Sending request..."
                      : "Join this club  →"}
                  </button>
                )}

                <Link
                  href={`/student/${clubId}/events`}
                  className="rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 font-semibold text-white transition hover:bg-white/20"
                >
                  Explore events
                </Link>
              </div>

              {membershipMutation.isError && (
                <p role="alert" className="mt-4 text-sm text-red-100">
                  {membershipMutation.error instanceof Error
                    ? membershipMutation.error.message
                    : "Unable to submit your request. Please try again."}
                </p>
              )}

              {membershipMutation.isSuccess && (
                <p role="status" className="mt-4 text-sm font-medium text-white">
                  ✓ Your membership request was submitted successfully.
                </p>
              )}
            </div>

            <div className="hidden lg:flex lg:justify-center">
              <div className="flex h-52 w-52 items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/10 text-8xl shadow-2xl backdrop-blur-sm">
                ✦
              </div>
            </div>
          </div>
        </section>

        {/* Section heading */}
        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Explore your community
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
                Everything in one place
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
                Find events, get important updates, and connect with your club team.
              </p>
            </div>

            <span className="mt-2 text-sm font-medium text-text-subtle sm:mt-0">
              Your campus, your community.
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={`/student/${clubId}/${item.href}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${item.accent}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold tracking-widest text-text-subtle">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-text transition group-hover:text-primary">
                  {item.title}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-text-muted">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
                  <span className="text-sm font-bold text-primary">
                    Explore
                  </span>
                  <span className="transition group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Membership callout */}
        <section className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-2xl">
              🎓
            </div>
            <div>
              <h2 className="font-bold text-text">
                Be part of something bigger
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-text-muted">
                Join the club to participate in its community and stay connected with campus activities.
              </p>
            </div>
          </div>

          {!alreadyRequested && (
            <button
              type="button"
              disabled={membershipMutation.isPending}
              onClick={() => membershipMutation.mutate(clubId)}
              className="shrink-0 rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {membershipMutation.isPending
                ? "Sending..."
                : "Request membership"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}