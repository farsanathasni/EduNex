
"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import StudentDirectory from "@/features/students/components/student-directory";

export default function HODStudentsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">Checking your session...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-text-muted">Please sign in to view the HOD student directory.</p>
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Go to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold">EduNex</h1>
            <p className="text-sm text-text-muted">Head of Department Portal</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/hod/dashboard")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
          >
            Back to Dashboard
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StudentDirectory
          showDepartmentFilter={false}
          canEdit
        />
      </div>
    </main>
  );
}
