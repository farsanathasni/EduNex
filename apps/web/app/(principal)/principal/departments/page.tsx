"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrincipalDepartments } from "@/lib/principal";

type Department = {
  id: number;
  name: string;
  code: string;
};

type DepartmentResponse = {
  success: boolean;
  data: Department[];
  message?: string;
};

export default function DepartmentsPage() {
  const { data, isPending, isError, error, refetch } =
    useQuery<DepartmentResponse>({
      queryKey: ["principal", "departments"],
      queryFn: getPrincipalDepartments,
      retry: false,
    });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="mt-2 text-sm text-text-muted">
          View the departments registered in EduNex.
        </p>
      </header>

      {isPending ? (
        <p className="text-text-muted">Loading departments...</p>
      ) : isError ? (
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Unable to load departments."}
          </p>
          <button
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="p-4">Department</th>
                <th className="p-4">Code</th>
                <th className="p-4">ID</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((department) => (
                <tr key={department.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{department.name}</td>
                  <td className="p-4">{department.code}</td>
                  <td className="p-4">{department.id}</td>
                </tr>
              ))}
              {data?.data?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-text-muted">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}