
import { isAxiosError } from "axios";
import { useCurrentUser } from "@/features/auth/api/auth-query";
import { useModeStore, type Mode } from "@/stores/mode-store";
import { NAV, isNavVisible } from "./nav";

export function useAccess() {
  const {
    data: me,
    isPending,
    isError,
    error,
    refetch,
  } = useCurrentUser();

  const storedMode = useModeStore((s) => s.mode);
  const setStoredMode = useModeStore((s) => s.setMode);

  const roleSlugs = me?.roles.map((r) => r.slug) ?? [];

  const isSuperAdmin = me?.isSuperAdmin === true;

  const hasRole = (slug: string) => roleSlugs.includes(slug);

  const hasAnyRole = (slugs: string[]) =>
    slugs.some(hasRole);

  // Super Admin has access to every permission.
  const can = (resource: string, action: string) =>
    isSuperAdmin ||
    !!me?.permissions.includes(`${resource}:${action}`);

  const canSwitchMode =
    !isSuperAdmin &&
    !hasRole("hod") &&
    !hasRole("faculty") &&
    hasRole("student") &&
    hasRole("club-coordinator");

  const mode: Mode = canSwitchMode
    ? storedMode
    : !isSuperAdmin &&
        !hasRole("hod") &&
        !hasRole("faculty") &&
        hasRole("club-coordinator") &&
        !hasRole("student")
      ? "coordinator"
      : "student";

  const setMode = (nextMode: Mode) => {
    if (canSwitchMode) setStoredMode(nextMode);
  };

  const getNavItems = (targetMode: Mode = mode) =>
    NAV.filter((item) =>
      isNavVisible(item, {
        mode: targetMode,
        hasAnyRole,
        can,
      }),
    );

  const navItems = getNavItems();

  return {
    me,
    isPending,
    isError,
    error,
    refetch,
    unauthorized:
      isError &&
      isAxiosError(error) &&
      error.response?.status === 401,
    roleSlugs,
    isSuperAdmin,
    hasRole,
    hasAnyRole,
    can,
    canSwitchMode,
    mode,
    setMode,
    navItems,
    getNavItems,
  };
}
