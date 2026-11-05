import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import {
  getCurrentUser,
  type CurrentUserData,
  type UserRole,
} from "./current-user";

export type Role = UserRole;

export type Me = CurrentUserData;

export const ME_KEY = ["me"] as const;

export async function fetchMe(): Promise<Me> {
  return getCurrentUser();
}

export const isUnauthorized = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 401;

export function getDashboardPath(me: Me): string | null {
  const roleSlugs = new Set(me.roles.map((role) => role.slug));

  if (me.isSuperAdmin || roleSlugs.has("super-admin")) {
    return "/principal";
  }

  if (roleSlugs.has("hod")) {
    return "/hod/dashboard";
  }

  if (roleSlugs.has("faculty")) {
    return "/teacher/dashboard";
  }

  // Students keep their normal dashboard, including students who are also
  // club coordinators. The existing mode switch handles their club workspace.
  if (roleSlugs.has("student")) {
    return "/studentDashboard";
  }

  if (roleSlugs.has("club-coordinator")) {
    return "/club-coordinator/events";
  }

  return null;
}

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: fetchMe,
    retry: false,
    staleTime: 60_000,
  });
}
