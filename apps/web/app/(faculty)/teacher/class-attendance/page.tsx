"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { useAccess } from "@/lib/navigation/access";
import { useMyTeachingSubjectsQuery } from "@/features/class-attendance/api/class-attendance-query";
import type { ClassSubject } from "@/features/class-attendance/api/class-attendance";

function SubjectsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-48 rounded bg-border" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-border" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-10 w-full rounded-lg bg-border sm:max-w-sm" />
        <div className="h-10 w-full rounded-lg bg-border sm:w-44" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <div className="h-5 w-40 rounded bg-border" />
            <div className="mt-3 h-4 w-24 rounded bg-border" />
            <div className="mt-5 h-9 w-32 rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message;
    if (error.response?.status === 401) return "Please sign in to continue.";
    if (typeof msg === "string" && msg) return msg;
    if (error.response?.status === 403) return "You don't have access.";
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function MySubjectsPage() {
  const { can, isPending: accessPending } = useAccess();
  const allowed = can("class_attendance", "mark");

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");

  const { data, isLoading, isError, error, refetch } = useMyTeachingSubjectsQuery(
    allowed,
  );

  const subjects = useMemo(() => data ?? [], [data]);

  const semesterOptions = useMemo(() => {
    const set = new Set<number>();
    subjects.forEach((s) => set.add(s.semester));
    return Array.from(set).sort((a, b) => a - b);
  }, [subjects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sem = semester ? Number(semester) : undefined;
    return subjects.filter((s) => {
      if (sem !== undefined && s.semester !== sem) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    });
  }, [subjects, search, semester]);

  const takeHref = (subject: ClassSubject) =>
    `/teacher/class-attendance/take?subjectId=${subject.id}`;

  if (accessPending) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <p className="text-muted">Checking access...</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <Card className="border-border p-6">
          <h1 className="text-xl font-semibold">My Subjects</h1>
          <p className="mt-2 text-text-muted">You don&apos;t have access.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6">
        <SubjectsSkeleton />
      </div>
    );
  }

  if (isError) {
    const forbidden = isAxiosError(error) && error.response?.status === 403;
    return (
      <div className="mx-auto w-full max-w-5xl p-6 space-y-4">
        <Card className="border-border p-6">
          <h1 className="text-xl font-semibold">My Subjects</h1>
          <p className={`mt-2 ${forbidden ? "text-text" : "text-red-600"}`}>
            {getErrorMessage(error)}
          </p>
          {!forbidden && (
            <div className="mt-4">
              <Button onClick={() => void refetch()}>Try again</Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My Subjects</h1>
        <p className="mt-1 text-sm text-muted">
          Subjects assigned to you for taking class attendance.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or code"
          aria-label="Search subjects"
          className="sm:max-w-sm"
        />
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          aria-label="Filter by semester"
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary sm:w-44"
        >
          <option value="">All semesters</option>
          {semesterOptions.map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>
      </div>

      {subjects.length === 0 ? (
        <Card className="border-border p-8 text-center">
          <p className="font-medium">No subjects found</p>
          <p className="mt-2 text-sm text-muted">
            You don&apos;t have any subjects assigned yet.
          </p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-border p-8 text-center">
          <p className="font-medium">No matching subjects</p>
          <p className="mt-2 text-sm text-muted">
            Try a different search or semester filter.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((subject) => (
            <Card key={subject.id} className="border-border p-5 flex flex-col">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-text truncate" title={subject.name}>
                  {subject.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {subject.code} · Semester {subject.semester}
                </p>
              </div>
              <div className="mt-4">
                {allowed ? (
                  <Link href={takeHref(subject)}>
                    <Button size="sm">Take attendance</Button>
                  </Link>
                ) : (
                  <p className="text-sm text-muted">You don&apos;t have access.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
