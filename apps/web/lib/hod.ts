
import { api } from "@/lib/axios";

export interface HodDashboard {
  staffId: number | string;
  employeeId: string;
  role: "hod";
  departmentId: number | string | null;
  designation: string | null;
}

interface HodDashboardResponse {
  success: boolean;
  message: string;
  data: HodDashboard;
}

export interface HodStudent {
  id: number;
  name: string;
  admissionNumber: string;
  departmentId: number;
  departmentName: string;
  semester: number;
  phone: string | null;
  userId: string;
  email: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export const getHodDashboard = async (): Promise<HodDashboard> => {
  const response = await api.get<HodDashboardResponse>(
    "/hod/dashboard"
  );

  return response.data.data;
};

export const getHodStudents = async (
  departmentId?: number,
): Promise<HodStudent[]> => {
  const response = await api.get<ApiResponse<HodStudent[]>>(
    "/hod/students",
    {
      params:
        departmentId !== undefined
          ? { departmentId }
          : undefined,
    },
  );

  return response.data.data;
};



export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get("/department");
  const result = response.data;

  // Supports either an array or { success, data: [...] }.
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  throw new Error("Invalid departments API response.");
};
