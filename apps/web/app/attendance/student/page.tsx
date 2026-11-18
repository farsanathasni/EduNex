"use client";

import type { ReactNode } from "react";
import { useStudentAttendance } from "@/features/attendence/api/attendance-query";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
// Adjust these paths to wherever your shared components live.


const MIN_ATTENDANCE = 75;

export default function StudentAttendancePage() {
  const { data, isPending, isError, error } = useStudentAttendance();

  if (isPending) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-secondary-hover" />
        <div className="grid gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
          <div className="h-96 animate-pulse rounded-3xl bg-secondary-hover" />
          <div className="h-96 animate-pulse rounded-2xl bg-secondary-hover" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <Card padding="lg" className="border-red-200 bg-red-50">
          <p className="font-semibold text-red-700">
            Couldn&apos;t load your attendance
          </p>
          <p className="mt-1 text-label text-red-600">
            {error instanceof Error
              ? error.message
              : "Check your connection and try again."}
          </p>
        </Card>
      </div>
    );
  }

  const { student, summary, records } = data;
  const good = summary.percentage >= MIN_ATTENDANCE;

  const message =
    summary.total === 0
      ? "No events recorded yet."
      : good
        ? `You've attended ${summary.present} of ${summary.total} events. Keep it up.`
        : `You've attended ${summary.present} of ${summary.total} events, below the ${MIN_ATTENDANCE}% target.`;

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="My attendance"
        description="Your record across campus events."
        action={
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 shadow-subtle">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-label font-bold text-primary-foreground">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="text-label font-semibold capitalize text-text">
                {student.name}
              </p>
              <p className="text-caption text-text-muted">
                {student.admissionNumber}
              </p>
            </div>
          </div>
        }
      />

      {/* Desktop: summary on the left, history fills the rest. Mobile: stacked. */}
      <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        {/* Summary panel */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-hover p-6 text-primary-foreground shadow-lg sm:p-8 lg:sticky lg:top-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-white/5"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col items-center gap-6 text-center">
            <Ring percentage={summary.percentage} good={good} />

            <div>
              <p className="text-subheading font-bold">Overall attendance</p>
              <p className="mx-auto mt-1.5 max-w-xs text-label leading-relaxed text-white/75">
                {message}
              </p>
            </div>

            <div className="grid w-full grid-cols-3 gap-3 text-left">
              <StatTile
                label="Events"
                value={summary.total}
                icon={
                  <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                }
              />
              <StatTile
                label="Present"
                value={summary.present}
                tone="text-green-300"
                icon={<path d="m5 12 4 4L19 6" />}
              />
              <StatTile
                label="Absent"
                value={summary.absent}
                tone="text-orange-300"
                icon={<path d="m18 6-12 12M6 6l12 12" />}
              />
            </div>
          </div>
        </section>

        {/* History */}
        <Card padding="sm" className="overflow-hidden !p-0 lg:min-h-[70vh]">
          <div className="flex items-end justify-between gap-4 border-b border-border-subtle p-5 md:px-6">
            <div>
              <h2 className="text-subheading font-bold text-text">
                Event history
              </h2>
              <p className="mt-0.5 text-caption text-text-muted">
                Records appear once your club marks attendance.
              </p>
            </div>
            {records.length > 0 && (
              <span className="shrink-0 rounded-full bg-primary-subtle px-3 py-1 text-caption font-semibold text-primary">
                {records.length} {records.length === 1 ? "record" : "records"}
              </span>
            )}
          </div>

          {records.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <p className="mt-4 font-semibold text-text">No records yet</p>
              <p className="mt-1 text-label text-text-muted">
                Join a club event and your attendance will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {records.map((record) => {
                const date = new Date(record.eventDate);
                const present = record.status === "present";

                return (
                  <li
                    key={record.id}
                    className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary-subtle sm:gap-5 sm:px-6"
                  >
                    {/* Calendar-style date badge */}
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary">
                      <span className="text-caption font-semibold leading-none">
                        {date.toLocaleDateString(undefined, { month: "short" })}
                      </span>
                      <span className="mt-0.5 text-subheading font-extrabold leading-none tabular-nums">
                        {date.getDate()}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-snug text-text sm:truncate">
                        {record.eventTitle}
                      </p>
                      <p className="mt-0.5 text-label text-text-muted">
                        {record.clubName}
                      </p>
                      {/* Marked time: under the club on mobile */}
                      <p className="mt-1 text-caption tabular-nums text-text-subtle md:hidden">
                        Marked{" "}
                        {new Date(record.markedAt).toLocaleString(undefined, {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <p className="hidden shrink-0 text-caption tabular-nums text-text-subtle md:block">
                      Marked{" "}
                      {new Date(record.markedAt).toLocaleString(undefined, {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-caption font-semibold sm:px-3 ${
                        present
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
                        {present ? (
                          <path d="m5 12 4 4L19 6" />
                        ) : (
                          <path d="m18 6-12 12M6 6l12 12" />
                        )}
                      </svg>
                      <span className="hidden sm:inline">
                        {present ? "Present" : "Absent"}
                      </span>
                      <span className="sr-only sm:hidden">
                        {present ? "Present" : "Absent"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Ring({ percentage, good }: { percentage: number; good: boolean }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative h-40 w-40 shrink-0 sm:h-44 sm:w-44">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="7"
          className="stroke-white/15"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-700 ${
            good ? "stroke-green-400" : "stroke-accent"
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold tabular-nums leading-none">
            {clamped}
          </span>
          <span className="ml-0.5 text-subheading font-semibold text-white/70">
            %
          </span>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon,
  tone = "text-white",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ${tone}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          {icon}
        </svg>
      </div>
      <p className="mt-3 text-heading font-extrabold tabular-nums leading-none">
        {value}
      </p>
      <p className="mt-1.5 text-caption text-white/70">{label}</p>
    </div>
  );
}
