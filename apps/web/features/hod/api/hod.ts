import { api } from "@/lib/axios";
import type {
  Club,
  ClubListParams,
  ClubListResult,
} from "@/features/clubs/api/clubs";
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

interface ClubListResponse {
  success: boolean;
  message?: string;
  data: Club[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getHodDashboard = async (): Promise<HodDashboard> => {
  const response = await api.get<HodDashboardResponse>(
    "/hod/dashboard",
  );

  return response.data.data;
};

export function getHodClubs(): Promise<Club[]>;
export function getHodClubs(params: ClubListParams): Promise<ClubListResult>;
export async function getHodClubs(
  params?: ClubListParams,
): Promise<Club[] | ClubListResult> {
  if (params) {
    const response = await api.get<ClubListResponse>("/hod/clubs", {
      params,
    });

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error(
        response.data.message || "Invalid clubs API response.",
      );
    }

    if (!response.data.pagination) {
      throw new Error("Club pagination information is missing.");
    }

    return {
      clubs: response.data.data,
      pagination: response.data.pagination,
    };
  }

  const limit = 100;
  const clubs: Club[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await api.get<ClubListResponse>("/hod/clubs", {
      params: { page, limit },
    });

    if (
      !response.data.success ||
      !Array.isArray(response.data.data)
    ) {
      throw new Error(
        response.data.message || "Invalid clubs API response.",
      );
    }

    clubs.push(...response.data.data);
    totalPages =
      response.data.pagination?.totalPages ??
      (response.data.data.length === limit ? page + 1 : page);
    page += 1;
  } while (page <= totalPages);

  return clubs;
}

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