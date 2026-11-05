import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

export type Role = { id?: number; slug: string; name?: string };

// export type Me = {
//   user: { id: string; name: string; email: string; image?: string | null };
//   roles: Role[];
//   /** "resource:action", e.g. "event:approve" */
//   permissions: string[];
//   coordinatedClubs: { id: number; name: string }[];
//   profile: Record<string, unknown>;
// };
export type Me = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "student" | "teacher";
  };
  roles: Role[];
  permissions: string[];
  coordinatedClubs: { id: number; name: string }[];
  profile: Record<string, unknown>;
};


// Tolerant of small differences in the /api/me response.
// Tighten once the real JSON is known.
const normalize = (raw: any): Me => {
  const data = raw?.data ?? raw;

  return {
    user: data.user,
    roles: (data.roles ?? []).map((r: any) =>
      typeof r === "string" ? { slug: r } : r,
    ),
    permissions: (data.permissions ?? []).map((p: any) =>
      typeof p === "string" ? p : `${p.resource}:${p.action}`,
    ),
    coordinatedClubs: data.coordinatedClubs ?? data.clubs ?? [],
    profile: data.profile ?? {},
  };
};

export const ME_KEY = ["me"] as const;

export async function fetchMe(): Promise<Me> {
  // If your axios baseURL already ends with "/api", use "/me" instead.
  const res = await api.get("/me");
  return normalize(res.data);
}

export const isUnauthorized = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 401;

export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: fetchMe,
    retry: false,
    staleTime: 60_000,
  });
}