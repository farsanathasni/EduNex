"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { useAccess } from "@/lib/navigation/access";
import { ModeSwitch } from "@/components/layout/mode-switch";

// One layout for every role. The sidebar is built from lib/nav.ts,
// filtered by the roles and permissions in /api/me.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { me, isPending, isError, error, refetch, unauthorized, navItems, mode, canSwitchMode } =
    useAccess();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (unauthorized) router.replace("/login");
  }, [unauthorized, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      queryClient.clear();
      router.replace("/login");
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending || unauthorized) {
    return <p className="p-10 text-text-muted">Checking session...</p>;
  }

  if (isError || !me) {
    return (
      <section className="m-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold">Unable to load your account</h2>
        <p className="mt-2 text-sm text-text-muted">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      </section>
    );
  }

  const portalLabel = canSwitchMode
    ? mode === "coordinator"
      ? "Coordinator view"
      : "Student view"
    : me.roles.map((r) => r.name ?? r.slug).join(", ");

  return (
    <div className="min-h-screen bg-background text-text md:flex">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold text-primary">EduNex</h1>
          <p className="mt-1 text-sm text-text-muted">{portalLabel}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition hover:bg-background disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg border border-border px-3 py-2 md:hidden"
          >
            ☰
          </button>

          <div className="flex-1">
            <p className="font-semibold">{me.user?.name ?? "User"}</p>
<p className="text-xs text-text-muted">{me.user?.email ?? ""}</p>
          </div>

          <ModeSwitch />
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}