import { api } from "@/lib/axios";
import type { Club } from "@/features/clubs/api/clubs";
import type { CreateHodClubInput } from "@/features/clubs/validation/club-schema";

export interface HodDashboard {
  departmentId: number;

  department: {
    id: number;
    name: string;
    code: string;
  } | null;

  totalStudents: number;
  totalStaff: number;
  totalCoordinators: number;
  pendingApprovals: number;
}

export interface HodDashboardResponse {
  success: boolean;
  message?: string;
  data: HodDashboard;
}

export interface HodStudent {
  id: number;
  name: string;
  admissionNumber: string;
  departmentId: number;
  departmentName: string;
  departmentCode?: string;
  semester: number;
  phone: string | null;
  userId: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getHodDashboard = async (): Promise<HodDashboard> => {
  const response = await api.get<HodDashboardResponse>(
    "/hod/dashboard",
  );

  return response.data.data;
};

export const getHodClubs = async (): Promise<Club[]> => {
  const limit = 100;
  const clubs: Club[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await api.get<{
      data: Club[];
      pagination?: { totalPages: number };
    }>("/hod/clubs", { params: { page, limit } });

    clubs.push(...response.data.data);
    totalPages =
      response.data.pagination?.totalPages ??
      (response.data.data.length === limit ? page + 1 : page);
    page += 1;
  } while (page <= totalPages);

  return clubs;
};

export const createHodClub = async (
  data: CreateHodClubInput,
): Promise<Club> => {
  const response = await api.post("/hod/clubs", data);
  return response.data.data;
};

export const getHodStudents = async (
  departmentId?: number,
  semester?: number,
): Promise<HodStudent[]> => {
  const response = await api.get<ApiResponse<HodStudent[]>>(
    "/hod/students",
    {
      params: {
        ...(departmentId !== undefined && { departmentId }),
        ...(semester !== undefined && { semester }),
      },
    },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to fetch students.",
    );
  }

  return response.data.data;
};