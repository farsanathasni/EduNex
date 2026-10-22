
import type { CreateClubInput } from "@/validation/club-schema";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type Club = {
  id: number;
  name: string;
  description: string | null;
  departmentId: number | null;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result.data;
}

export const getClubs = () => request<Club[]>("/api/clubs");

export const createClub = (data: CreateClubInput) =>
  request<Club>("/api/clubs", {
    method: "POST",
    body: JSON.stringify(data),
  });
