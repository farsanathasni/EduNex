
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useCoordinatorAssignments,
  useCreateCoordinator,
  useHodStudents,
  useClubs
} from "../../coordinatorsQuery";

import { authClient } from "@/lib/auth-client";


type CoordinatorFormInput = {
  studentId: number;
  clubId: number;
};

export default function CoordinatorPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session } = authClient.useSession();


  const {
    data: coordinatorAssignments = [],
    isPending,
    isError,
    error,
    refetch,
  } = useCoordinatorAssignments();

  const createCoordinatorMutation = useCreateCoordinator();

  const {
  data: students = [],
  isPending: studentsLoading,
  isError: studentsError,
} = useHodStudents();

const {
  data: clubs = [],
  isPending: clubsLoading,
  isError: clubsError,
} = useClubs();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoordinatorFormInput>();

  const onSubmit: SubmitHandler<CoordinatorFormInput> = async (values) => {
    setSuccessMessage("");

    try {
      await createCoordinatorMutation.mutateAsync({
        studentId: Number(values.studentId),
        clubId: Number(values.clubId),
      });

      setSuccessMessage("Coordinator appointed successfully.");
      reset();
      await refetch();
    } catch {
      // The mutation error is displayed below.
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            Coordinator Management
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Appoint students as club coordinators and manage assignments.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold">
            Appoint a Coordinator
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
<div>
  <label
    htmlFor="studentId"
    className="mb-2 block text-sm font-medium"
  >
    Student
  </label>

  <select 
    id="studentId"
    {...register("studentId", {
      required: "Please select a student",
      valueAsNumber: true,
      min: { value: 1, message: "Please select a student" },
    })}
    className="w-full p-3 pr-6 border rounded-lg border-border bg-background py-3 "
    defaultValue=""
    disabled={studentsLoading || studentsError}
  >
    <option value="" disabled>
      {studentsLoading
        ? "Loading students..."
        : studentsError
          ? "Failed to load students"
          : "Select a student"}
    </option>

    {students.map((student) => (
      <option key={student.id} value={student.id}>
        {student.name}
      </option>
    ))}
  </select>

  {errors.studentId && (
    <p className="mt-1 text-sm text-red-500">
      {errors.studentId.message}
    </p>
  )}
</div>

<div>
  <label
    htmlFor="clubId"
    className="mb-2 block text-sm font-medium"
  >
    Club
  </label>

  <select
    id="clubId"
    {...register("clubId", {
      required: "Please select a club",
      valueAsNumber: true,
      min: { value: 1, message: "Please select a club" },
    })}
    className="w-full rounded-lg border border-border bg-background px-4 py-3 "
    defaultValue=""
    disabled={clubsLoading || clubsError}
  >
    <option value="" disabled>
      {clubsLoading
        ? "Loading clubs..."
        : clubsError
          ? "Failed to load clubs"
          : "Select a club"}
    </option>

    {clubs.map((club) => (
      <option key={club.id} value={club.id}>
        {club.name}
      </option>
    ))}
  </select>

  {errors.clubId && (
    <p className="mt-1 text-sm text-red-500">
      {errors.clubId.message}
    </p>
  )}
</div>

            {createCoordinatorMutation.isError && (
              <p className="text-sm text-red-500 md:col-span-2">
                {createCoordinatorMutation.error instanceof Error
                  ? createCoordinatorMutation.error.message
                  : "Failed to appoint coordinator. Please try again."}
              </p>
            )}

            {successMessage && (
              <p className="text-sm text-green-600 md:col-span-2">
                {successMessage}
              </p>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={createCoordinatorMutation.isPending}
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createCoordinatorMutation.isPending
                  ? "Appointing..."
                  : "Appoint Coordinator"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Coordinator Assignments
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                View the students appointed to clubs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
            >
              Refresh
            </button>
          </div>

          {isPending ? (
            <p className="py-8 text-center text-text-muted">
              Loading coordinator assignments...
            </p>
          ) : isError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-500">
                {error instanceof Error
                  ? error.message
                  : "Failed to load coordinator assignments."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-white"
              >
                Try Again
              </button>
            </div>
          ) : coordinatorAssignments.length === 0 ? (
            <p className="py-8 text-center text-text-muted">
              No coordinators have been appointed yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Admission Number</th>
                    <th className="px-4 py-3">Club</th>
                    <th className="px-4 py-3">Appointed By</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {coordinatorAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-4 font-medium">
                        {assignment.studentName}
                      </td>

                      <td className="px-4 py-4">
                        {assignment.admissionNumber}
                      </td>

                      <td className="px-4 py-4">
                        {assignment.clubName}
                      </td>

                      <td className="px-4 py-4">
  Appointed by {session?.user?.name || assignment.appointedBy}
</td>

                      <td className="px-4 py-4">
                        {assignment.createdAt
                          ? new Date(
                              assignment.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
