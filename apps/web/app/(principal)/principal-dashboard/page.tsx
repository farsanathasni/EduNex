"use client";

import { useEffect, useState } from "react";

type PrincipalData = {
  staffId: string;
  employeeId: string;
  role: string;
  designation: string | null;
};

export default function PrincipalDashboardPage() {
  const [principal, setPrincipal] = useState<PrincipalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrincipal = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/principal/dashboard",
          { credentials: "include" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          setError(result.message || "Failed to load dashboard");
          return;
        }

        setPrincipal(result.data);
      } catch {
        setError("Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrincipal();
  }, []);

  if (loading) return <main className="p-8">Loading dashboard...</main>;

  if (error) {
    return <main className="p-8 text-red-600">{error}</main>;
  }

  if (!principal) return null;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">EduNex Principal Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome to the college administration portal.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Role</p>
          <h2 className="mt-2 text-xl font-semibold capitalize">
            {principal.role}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Employee ID</p>
          <h2 className="mt-2 text-xl font-semibold">
            {principal.employeeId}
          </h2>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Designation</p>
          <h2 className="mt-2 text-xl font-semibold">
            {principal.designation || "Principal"}
          </h2>
        </div>
      </section>
    </main>
  );
}