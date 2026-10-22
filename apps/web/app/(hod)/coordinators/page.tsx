"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getClubs } from "@/lib/clubs";
import { useQuery } from "@tanstack/react-query";
import {
  useHodStudents,
  useCoordinatorAssignments,
  useCreateCoordinator,
} from "../coordinatorsQuery";
import { getHodDashboard } from "@/lib/coordinators";

export default function CoordinatorsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [studentId, setStudentId] = useState("");
  const [clubId, setClubId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch HOD details
  const dashboardQuery = useQuery({
    queryKey: ["hod-dashboard"],
    queryFn: getHodDashboard,
    enabled: !!session?.user,
  });

  // Fetch all students across departments
  const studentsQuery = useHodStudents();

  // Fetch all clubs
  const clubsQuery = useQuery({
    queryKey: ["clubs"],
    queryFn: getClubs,
    enabled: !!session?.user,
  });

  // Fetch existing coordinator assignments
  const assignmentsQuery = useCoordinatorAssignments();

  // Appointment mutation
  const appointmentMutation = useCreateCoordinator();

  const students = studentsQuery.data ?? [];
  const clubs = clubsQuery.data ?? [];
  const assignments = assignmentsQuery.data ?? [];

  // Find the selected student's details
  const selectedStudent = students.find(
    (student) => student.id === Number(studentId),
  );

  // Search students by name or admission number
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(searchText) ||
      student.admissionNumber.toLowerCase().includes(searchText) ||
      (student.departmentName ?? "").toLowerCase().includes(searchText)
    );
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!studentId || !clubId) {
      setErrorMessage("Please select a student and a club.");
      return;
    }

    appointmentMutation.mutate(
      {
        studentId: Number(studentId),
        clubId: Number(clubId),
      },
      {
        onSuccess: () => {
          setMessage("Coordinator appointed successfully.");
          setErrorMessage("");
          setStudentId("");
          setClubId("");
          setSearch("");
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  }

  if (sessionLoading) {
    return <main className="p-8">Checking your session...</main>;
  }

  if (!session?.user) {
    return (
      <main className="p-8">
        Please log in to access coordinator management.
      </main>
    );
  }

  if (dashboardQuery.isLoading) {
    return <main className="p-8">Loading HOD details...</main>;
  }

  if (dashboardQuery.isError) {
    return (
      <main className="p-8">
        <p className="text-red-600">{dashboardQuery.error.message}</p>
        <button
          onClick={() => dashboardQuery.refetch()}
          className="mt-3 rounded-lg bg-[#234c96] px-4 py-2 text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-[#234c96] sm:text-3xl">
            Coordinator Management
          </h1>
          <p className="mt-2 text-gray-600">
            Select a student, review their details, and appoint them to manage
            a club.
          </p>
        </header>

        {/* Appoint Coordinator */}
        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-semibold text-[#234c96]">
            Appoint a Coordinator
          </h2>

          {/* Student search */}
          <div className="mt-5">
            <label
              htmlFor="student-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search Students
            </label>

            <input
              id="student-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, admission number, or department"
              className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#234c96]"
            />

            {studentsQuery.isLoading && (
              <p className="mt-2 text-sm text-gray-500">
                Loading students...
              </p>
            )}

            {studentsQuery.isError && (
              <p className="mt-2 text-sm text-red-600">
                {studentsQuery.error.message}
              </p>
            )}

            {!studentsQuery.isLoading &&
              !studentsQuery.isError &&
              filteredStudents.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  No students found.
                </p>
              )}

            {/* Student list */}
            {filteredStudents.length > 0 && (
              <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                {filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setStudentId(String(student.id));
                      setMessage("");
                      setErrorMessage("");
                    }}
                    className={`block w-full border-b px-4 py-3 text-left last:border-0 hover:bg-[#f5f7fc] ${
                      studentId === String(student.id)
                        ? "bg-blue-50 ring-1 ring-inset ring-[#234c96]"
                        : ""
                    }`}
                  >
                    <span className="block font-medium text-gray-900">
                      {student.name}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      {student.admissionNumber} ·{" "}
                      {student.departmentName || "Department not assigned"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected student details */}
          {selectedStudent && (
            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-semibold text-[#234c96]">
                Selected Student Details
              </h3>

              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedStudent.name}
                </p>
                <p>
                  <span className="font-medium">Admission Number:</span>{" "}
                  {selectedStudent.admissionNumber}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedStudent.email || "Not available"}
                </p>
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {selectedStudent.departmentName || "Not assigned"}
                </p>
                <p>
                  <span className="font-medium">Department Code:</span>{" "}
                  {selectedStudent.departmentCode || "Not available"}
                </p>
                <p>
                  <span className="font-medium">Semester:</span>{" "}
                  {selectedStudent.semester ?? "Not assigned"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedStudent.phone || "Not available"}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Club selection */}
            <div>
              <label
                htmlFor="club"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Select Club
              </label>

              <select
                id="club"
                value={clubId}
                onChange={(event) => setClubId(event.target.value)}
                disabled={clubsQuery.isLoading || clubsQuery.isError}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-[#234c96]"
              >
                <option value="">Choose a club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>

              {clubsQuery.isLoading && (
                <p className="mt-2 text-sm text-gray-500">
                  Loading clubs...
                </p>
              )}

              {clubsQuery.isError && (
                <p className="mt-2 text-sm text-red-600">
                  {clubsQuery.error.message}
                </p>
              )}

              {!clubsQuery.isLoading &&
                !clubsQuery.isError &&
                clubs.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    No clubs found.
                  </p>
                )}
            </div>

            {message && (
              <p role="status" className="text-sm text-green-700">
                {message}
              </p>
            )}

            {errorMessage && (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={
                !selectedStudent ||
                !clubId ||
                appointmentMutation.isPending ||
                studentsQuery.isLoading ||
                clubsQuery.isLoading ||
                clubs.length === 0
              }
              className="rounded-lg bg-[#234c96] px-5 py-3 font-medium text-white transition hover:bg-[#193a76] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {appointmentMutation.isPending
                ? "Appointing..."
                : "Appoint Coordinator"}
            </button>
          </form>
        </section>

        {/* Existing assignments */}
        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#234c96]">
                Existing Coordinator Assignments
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {assignments.length} assignment(s)
              </p>
            </div>

            <button
              type="button"
              onClick={() => assignmentsQuery.refetch()}
              disabled={assignmentsQuery.isFetching}
              className="rounded-lg border border-[#234c96] px-4 py-2 text-sm font-medium text-[#234c96] disabled:opacity-60"
            >
              {assignmentsQuery.isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {assignmentsQuery.isLoading && (
            <p className="py-6 text-gray-500">
              Loading coordinator assignments...
            </p>
          )}

          {assignmentsQuery.isError && (
            <div className="py-6">
              <p className="text-red-600">
                {assignmentsQuery.error.message}
              </p>
              <button
                type="button"
                onClick={() => assignmentsQuery.refetch()}
                className="mt-3 rounded-lg bg-[#234c96] px-4 py-2 text-white"
              >
                Try again
              </button>
            </div>
          )}

          {assignmentsQuery.isSuccess && assignments.length === 0 && (
            <p className="py-6 text-gray-500">
              No coordinator assignments have been made yet.
            </p>
          )}

          {assignmentsQuery.isSuccess && assignments.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-[#f5f7fc] text-gray-700">
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">
                      Admission Number
                    </th>
                    <th className="px-4 py-3 font-semibold">Club</th>
                    <th className="px-4 py-3 font-semibold">Appointed On</th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {assignment.studentName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {assignment.admissionNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {assignment.clubName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(
                          assignment.createdAt,
                        ).toLocaleDateString()}
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