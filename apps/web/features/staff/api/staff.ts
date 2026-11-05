import { api } from "@/lib/axios";

export type StaffType = "all" | "hod" | "faculty";

export interface StaffListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  employeeId: string;
  role: "hod" | "faculty";
  departmentId: number | null;
  departmentName: string | null;
  departmentCode: string | null;
  designation: string | null;
  phone: string | null;
  isActive: boolean;
}

export interface StaffListParams {
  type: StaffType;
  departmentId?: number;
  search: string;
  page: number;
  limit: number;
}

export interface CreateStaffInput {
  name: string;
  email: string;
  employeeId: string;
  role: "hod" | "faculty";
  departmentId: number;
  designation: string;
  phone?: string;
}

export interface CreateStaffResult {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: "hod" | "faculty";
  departmentId: number;
  designation: string;
  phone: string | null;
}

export interface UpdateStaffInput {
  name: string;
  email: string;
  employeeId: string;
  designation: string | null;
  phone: string | null;
  departmentId?: number;
}

export interface StaffListResult {
  staff: StaffListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface StaffListResponse {
  success: boolean;
  message: string;
  data: StaffListItem[];
  pagination: StaffListResult["pagination"];
}

interface CreateStaffResponse {
  success: boolean;
  message: string;
  data: CreateStaffResult;
}

interface UpdateStaffResponse {
  success: boolean;
  message: string;
  data: StaffListItem;
}

interface DeactivateStaffResponse {
  success: boolean;
  message: string;
  data: { id: string; isActive: false };
}

export const deactivateStaff = async (staffId: string): Promise<void> => {
  const response = await api.delete<DeactivateStaffResponse>(
    `/staff/${encodeURIComponent(staffId)}`,
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to deactivate staff account.");
  }
};

export const updateStaff = async (
  staffId: string,
  input: UpdateStaffInput,
): Promise<StaffListItem> => {
  const response = await api.patch<UpdateStaffResponse>(
    `/staff/${encodeURIComponent(staffId)}`,
    input,
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update staff member.");
  }

  return response.data.data;
};

export const createStaff = async (
  input: CreateStaffInput,
): Promise<CreateStaffResult> => {
  const response = await api.post<CreateStaffResponse>(
    "/principal/staff",
    input,
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create staff account.");
  }

  return response.data.data;
};

export const getStaff = async (
  params: StaffListParams,
): Promise<StaffListResult> => {
  const response = await api.get<StaffListResponse>("/staff", { params });

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to load staff.");
  }

  return {
    staff: response.data.data,
    pagination: response.data.pagination,
  };
};
