

import { api } from "../../../lib/axios";
import { isAxiosError } from "axios";

export interface StudentProfileInput {
  admissionNumber: string;
  departmentId: string;   // ✅ number → string
  semester: string;       // ✅ number → string
  phone?: string;
};

export interface StudentProfile {
  id: number;
  name: string;
  userId: string;
  email: string;
  admissionNumber: string;
  departmentId: number;
  departmentName: string;
  semester: number;
  phone: string | null;
}

export interface StudentListItem {
  id: number;
  userId: string;
  name: string;
  email: string;
  admissionNumber: string;
  departmentId: number;
  departmentName: string;
  semester: number;
  phone: string | null;
}

export interface StudentListParams {
  search: string;
  departmentId?: number;
  semester?: number;
  page: number;
  limit: number;
}

export interface StudentListResult {
  students: StudentListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateStudentInput {
  name: string;
  admissionNumber: string;
  departmentId?: number;
  semester: number;
  phone: string | null;
}

export interface CreateManagedStudentInput {
  name: string;
  email: string;
  admissionNumber: string;
  departmentId: number;
  semester: number;
  phone?: string;
}

export interface CreatedManagedStudent {
  id: number;
  name: string;
  email: string;
  admissionNumber: string;
  departmentId: number;
  semester: number;
  phone: string | null;
}

export interface StudentResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface StudentListResponse {
  success: boolean;
  message: string;
  data: StudentListItem[];
  pagination: StudentListResult["pagination"];
}

const getStudentApiError = (error: unknown, fallback: string) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return new Error(error.response?.data?.message || fallback);
  }
  return error instanceof Error ? error : new Error(fallback);
};

export const getStudents = async (
  params: StudentListParams,
): Promise<StudentListResult> => {
  const response = await api.get<StudentListResponse>("/students", { params });
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to load students.");
  }
  return {
    students: response.data.data,
    pagination: response.data.pagination,
  };
};

export const getStudentById = async (studentId: number): Promise<StudentListItem> => {
  try {
    const response = await api.get<StudentResponse<StudentListItem>>(
      `/students/${encodeURIComponent(studentId)}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to load student details.");
    }
    return response.data.data;
  } catch (error) {
    throw getStudentApiError(error, "Failed to load student details.");
  }
};

export const updateStudent = async (
  studentId: number,
  input: UpdateStudentInput,
): Promise<void> => {
  try {
    const response = await api.patch<StudentResponse<unknown>>(
      `/students/${encodeURIComponent(studentId)}`,
      input,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update student.");
    }
  } catch (error) {
    throw getStudentApiError(error, "Failed to update student.");
  }
};

export const deleteStudent = async (studentId: number): Promise<void> => {
  try {
    const response = await api.delete<StudentResponse<null>>(
      `/students/${encodeURIComponent(studentId)}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete student.");
    }
  } catch (error) {
    throw getStudentApiError(error, "Failed to delete student.");
  }
};

export const createManagedStudent = async (
  input: CreateManagedStudentInput,
): Promise<CreatedManagedStudent> => {
  try {
    const response = await api.post<StudentResponse<CreatedManagedStudent>>("/principal/students", input);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create student.");
    }
    return response.data.data;
  } catch (error) {
    throw getStudentApiError(error, "Failed to create student.");
  }
};

export const getStudentProfile = async () => {
   const { data } = await api.get<StudentResponse<StudentProfile>>("/students/profile");
  return data;
};

export const CreateStudentProfile = async (
  input: StudentProfileInput
) => {
const { data } = await api.post("/students/profile", input);
  return data;
};
