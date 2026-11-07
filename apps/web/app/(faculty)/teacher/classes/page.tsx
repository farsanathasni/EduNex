
"use client";

import { useTeacherClassesQuery } from "@/features/teacher/api/teacher-query";

export default function TeacherClassesPage() {
  const { data, isLoading, isError, refetch } =
    useTeacherClassesQuery();

  if (isLoading) {
    return <p className="text-muted">Loading classes...</p>;
  }

  if (isError) {
    return (
      <div>
        <p className="text-red-500">Unable to load classes.</p>
        <button onClick={() => refetch()} className="mt-3 text-primary">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Classes</h1>
        <p className="mt-2 text-sm text-muted">
          View the semesters available in your department.
        </p>
      </div>

      {!data?.length ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="font-medium">No semesters found</p>
          <p className="mt-2 text-sm text-muted">
            There are currently no student semesters available.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div
              key={item.semester}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-subtle font-bold text-primary">
                {item.semester}
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                Semester {item.semester}
              </h2>

              <p className="mt-2 text-sm text-muted">
                Department semester
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
