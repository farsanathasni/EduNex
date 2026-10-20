import { api } from "./axios";

export interface HodDashboard {
  staffId: string;
  employeeId: string;
  role: "hod";
  departmentId: string | null;
  designation: string | null;
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
  semester: number;
  phone: string | null;
}

export interface HodStudentsResponse {
  success: boolean;
  message: string;
  data: HodStudent[];
}

export const getHodDashboard = async (): Promise<HodDashboardResponse> => {
  const response = await api.get<HodDashboardResponse>("/hod/dashboard");
  return response.data;
};

export const getHodStudents = async (
  semester?: number
): Promise<HodStudentsResponse> => {
  const response = await api.get<HodStudentsResponse>(
    "/hod/students",
    {
      params: semester !== undefined ? { semester } : {},
    }
  );

  return response.data;
};