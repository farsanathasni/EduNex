
import { isAxiosError } from "axios";
import { api } from "@/lib/axios";

export type CoordinatorAssignment = {
  id: number;
  studentId: number;
  departmentId: number;
  studentName: string;
  admissionNumber: string;
  departmentName: string;
  clubId: number;
  clubName: string;
  appointedBy: string;
  createdAt: string | Date;
};

export type CreateCoordinatorInput = {
  studentId: number;
  clubId: number;
};

export type CoordinatorAssignmentsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type UpdateCoordinatorInput = {
  studentId: number;
  clubId: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  pagination?: { total: number; page: number; limit: number; totalPages: number };
};

export type CoordinatorAssignmentsResult = {
  assignments: CoordinatorAssignment[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};

export type StudentCoordinatorAssignment = {
  id: number;
  studentId: number;
  clubId: number;
  appointedBy: string;
  createdAt: string;
};

export type CoordinatorStatus = {
  isCoordinator: boolean;
  assignments: StudentCoordinatorAssignment[];
};

// Get coordinator assignments
export const getCoordinatorAssignments = async (
  params?: CoordinatorAssignmentsParams,
): Promise<CoordinatorAssignmentsResult> => {
  const { data } = await api.get<ApiResponse<CoordinatorAssignment[]>>(
    "/students/coordinators",
    { params },
  );

  if (!data.success) {
    throw new Error(
      data.message || "Failed to fetch coordinator assignments.",
    );
  }

  return {
    assignments: data.data,
    pagination: data.pagination ?? { total: data.data.length, page: 1, limit: data.data.length, totalPages: 1 },
  };
};

// Create coordinator
export const createCoordinator = async (
  input: CreateCoordinatorInput,
) => {
  let data: ApiResponse<{ assignment: CoordinatorAssignment; emailSent: boolean }>;
  try {
    ({ data } = await api.post<ApiResponse<{ assignment: CoordinatorAssignment; emailSent: boolean }>>(
      "/students/coordinators",
      input,
    ));
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message || "Failed to appoint coordinator.");
    }
    throw error;
  }

  if (!data.success) {
    throw new Error(data.message || "Failed to appoint coordinator.");
  }

  return data.data.assignment;
};

// Update coordinator
export const updateCoordinator = async (
  assignmentId: number,
  input: UpdateCoordinatorInput,
) => {
  const { data } = await api.patch<ApiResponse<CoordinatorAssignment>>(
    `/students/coordinators/${assignmentId}`,
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update coordinator.");
  }

  return data.data;
};

// Deactivate coordinator
export const deactivateCoordinator = async (
  assignmentId: number,
) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/students/coordinators/${assignmentId}`,
  );

  if (!data.success) {
    throw new Error(
      data.message || "Failed to deactivate coordinator assignment.",
    );
  }

  return data.data;
};

// Get logged-in student's coordinator status
export const getCoordinatorStatus = async (): Promise<CoordinatorStatus> => {
  const { data } = await api.get<ApiResponse<CoordinatorStatus>>(
    "/coordinator/",
  );

  if (!data.success) {
    throw new Error(
      data.message || "Failed to fetch coordinator status.",
    );
  }

  return data.data;
};
