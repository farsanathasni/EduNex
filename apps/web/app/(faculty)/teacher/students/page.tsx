
"use client";

import { useState } from "react";
import {
  useTeacherClassesQuery,
  useTeacherStudentsQuery,
} from "@/features/teacher/api/teacher-query";

export default function TeacherStudentsPage() {
  const [semester, setSemester] = useState("");

  const selectedSemester = semester
    ? Number(semester)
    : undefined;

  const {
    data: students,
    isLoading,
    isError,
    refetch,
  } = useTeacherStudentsQuery(selectedSemester);

  const { data: classes } = useTeacherClassesQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="mt-2 text-sm text-muted">
          View students in your department.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {students?.length ?? 0} students found
        </p>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">All Semesters</option>

          {classes?.map((item) => (
            <option key={item.semester} value={item.semester}>
              Semester {item.semester}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-muted">Loading students...</p>
      ) : isError ? (
        <div>
          <p className="text-red-500">Unable to load students.</p>
          <button onClick={() => refetch()} className="mt-3 text-primary">
            Try again
          </button>
        </div>
      ) : !students?.length ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="font-medium">No students found</p>
          <p className="mt-2 text-sm text-muted">
            Try selecting another semester.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Student</th>
                  <th className="px-5 py-4 font-medium">
                    Admission Number
                  </th>
                  <th className="px-5 py-4 font-medium">Semester</th>
                  <th className="px-5 py-4 font-medium">Phone</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-background">
                    <td className="px-5 py-4 font-medium">
                      {student.name}
                    </td>

                    <td className="px-5 py-4 text-muted">
                      {student.admissionNumber}
                    </td>

                    <td className="px-5 py-4">
                      Semester {student.semester}
                    </td>

                    <td className="px-5 py-4 text-muted">
                      {student.phone || "Not provided"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
