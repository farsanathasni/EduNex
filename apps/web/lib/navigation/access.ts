import { useMe, isUnauthorized } from "@/features/auth/api/me";
import { useModeStore } from "@/stores/mode-store";
import { NAV, isNavVisible } from "./nav";

// Everything the UI needs to decide what to show.
export function useAccess() {
  const { data: me, isPending, isError, error, refetch } = useMe();
  const storedMode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);

  const roleSlugs = me?.roles.map((r) => r.slug) ?? [];
  const hasRole = (slug: string) => roleSlugs.includes(slug);
  const hasAnyRole = (slugs: string[]) => slugs.some(hasRole);
  const can = (resource: string, action: string) =>
    !!me?.permissions.includes(`${resource}:${action}`);

  // The switch exists only for students who are also club coordinators.
  const canSwitchMode = hasRole("student") && hasRole("club-coordinator");
  const mode = canSwitchMode ? storedMode : "student";

  const navItems = NAV.filter((item) =>
    isNavVisible(item, { mode, hasAnyRole, can }),
  );

  return {
    me,
    isPending,
    isError,
    error,
    refetch,
    unauthorized: isError && isUnauthorized(error),
    roleSlugs,
    hasRole,
    hasAnyRole,
    can,
    canSwitchMode,
    mode,
    setMode,
    navItems,
  };
}