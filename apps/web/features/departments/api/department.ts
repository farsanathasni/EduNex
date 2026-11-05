import axios from "axios";
import { api } from "../../../lib/axios";

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface DepartmentInput {
  name: string;
  code: string;
  description: string;
}

export interface DepartmentListParams {
  search: string;
  page: number;
  limit: number;
}

export interface DepartmentListResult {
  departments: Department[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DepartmentResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: DepartmentListResult["pagination"];
}

const getApiError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return new Error(error.response?.data?.message || fallback);
  }
  return error instanceof Error ? error : new Error(fallback);
};

export function getDepartment(): Promise<Department[]>;
export function getDepartment(
  params: DepartmentListParams,
): Promise<DepartmentListResult>;
export async function getDepartment(
  params?: DepartmentListParams,
): Promise<Department[] | DepartmentListResult> {
  try {
    const response = await api.get<DepartmentResponse<Department[]>>(
      "/department",
      { params: params ?? { page: 1, limit: 100, search: "" } },
    );

    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error(response.data.message || "Invalid departments API response.");
    }

    if (params) {
      if (!response.data.pagination) {
        throw new Error("Department pagination information is missing.");
      }
      return {
        departments: response.data.data,
        pagination: response.data.pagination,
      };
    }

    return response.data.data;
  } catch (error) {
    throw getApiError(error, "Unable to load departments.");
  }
}

export const createDepartments = async (
  input: DepartmentInput[],
): Promise<Department[]> => {
  try {
    const response = await api.post<DepartmentResponse<Department[]>>(
      "/department/add",
      input,
    );
    if (!response.data.success || !Array.isArray(response.data.data)) {
      throw new Error(response.data.message || "Failed to create departments.");
    }
    return response.data.data;
  } catch (error) {
    throw getApiError(error, "Failed to create departments.");
  }
};

export const updateDepartment = async (
  id: number,
  input: DepartmentInput,
): Promise<Department> => {
  try {
    const response = await api.patch<DepartmentResponse<Department>>(
      `/department/${id}`,
      input,
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to update department.");
    }
    return response.data.data;
  } catch (error) {
    throw getApiError(error, "Failed to update department.");
  }
};

export const deleteDepartment = async (id: number): Promise<void> => {
  try {
    const response = await api.delete<DepartmentResponse<Department>>(
      `/department/${id}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete department.");
    }
  } catch (error) {
    throw getApiError(error, "Failed to delete department.");
  }
};
