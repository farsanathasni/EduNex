

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAccess } from "@/lib/navigation/access";
import { NAV } from "@/lib/navigation/nav";

type RouteGuardProps = {
  children: React.ReactNode;
  roles?: string[];
  coordinatorOnly?: boolean;
};

export function RouteGuard({
  children,
  roles,
  coordinatorOnly = false,
}: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    me,
    isPending,
    isError,
    error,
    refetch,
    unauthorized,
    isSuperAdmin,
    hasAnyRole,
    can,
    canSwitchMode,
    mode,
  } = useAccess();

  const matchedNavItem = NAV
    .filter(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  const loginRequired =
    unauthorized || (!isPending && !isError && !me?.user);

  const roleAllowed =
    !roles || roles.length === 0 || hasAnyRole(roles);

  const permissionAllowed =
    !matchedNavItem?.permission ||
    can(
      matchedNavItem.permission[0],
      matchedNavItem.permission[1],
    );

  const coordinatorAllowed =
    !coordinatorOnly ||
    (canSwitchMode && mode === "coordinator");

  const routeAllowed =
    isSuperAdmin ||
    (roleAllowed && permissionAllowed && coordinatorAllowed);

  const isPrincipalAdmin =
    isSuperAdmin || hasAnyRole(["super-admin"]);

  const deniedAccessDestination = isPrincipalAdmin
    ? "/principal"
    : coordinatorOnly
      ? "/studentDashboard"
      : "/dashboard";

  const redirectTo = loginRequired
    ? "/login"
    : !isPending && !isError && me && !routeAllowed
      ? deniedAccessDestination
      : null;

  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  if (isPending || loginRequired || redirectTo) {
    return (
      <p className="p-10 text-text-muted">
        Checking access...
      </p>
    );
  }

  if (isError || !me) {
    return (
      <section className="m-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold">
          Unable to verify your access
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          {error instanceof Error
            ? error.message
            : "Please try again."}
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!routeAllowed) return null;

  return <>{children}</>;
}
