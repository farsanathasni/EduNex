import { api } from "@/lib/axios";

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