"use client";

import { useAccess } from "@/lib/navigation/access";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



// One dashboard for every role: the cards are the sidebar pages the
// current user is allowed to open (same source: lib/nav.ts).
export default function DashboardPage() {
  const router = useRouter();
  const {
    me,
    navItems,
    mode,
    hasRole,
    isSuperAdmin,
  } = useAccess();

  const isPrincipalAdmin = isSuperAdmin || hasRole("super-admin");

  useEffect(() => {
    if (me && isPrincipalAdmin) router.replace("/principal");
  }, [me, isPrincipalAdmin, router]);

  if (!me) return null;
  if (isPrincipalAdmin) {
    return <p className="py-10 text-text-muted">Opening Principal dashboard...</p>;
  }

  const cards = navItems.filter((item) => item.href !== "/dashboard");
  const isStudentCoordinatorWorkspace =
    !isSuperAdmin &&
    !hasRole("hod") &&
    !hasRole("faculty") &&
    (hasRole("student") || hasRole("club-coordinator"));

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          {isStudentCoordinatorWorkspace
            ? mode === "coordinator"
              ? "Coordinator workspace"
              : "Student workspace"
            : "Your workspace"}
        </p>

        <h1 className="mt-2 text-3xl font-bold">Welcome, {me.user?.name ?? "User"}</h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {me.roles.map((role) => (
            <span
              key={role.slug}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted"
            >
              {role.name ?? role.slug}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Quick access</h2>

        {cards.length === 0 ? (
          <p className="text-sm text-text-muted">
            No pages are available for your account yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">{item.label}</h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {item.description}
                  </p>
                )}
                <p className="mt-4 text-sm font-semibold text-primary">
                  Open page →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
