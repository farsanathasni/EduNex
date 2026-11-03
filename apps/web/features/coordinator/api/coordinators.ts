
import { api } from "@/lib/axios";

export type CoordinatorAssignment = {
  id: number;
  studentId: number;
  studentName: string;
  admissionNumber: string;
  clubId: number;
  clubName: string;
  appointedBy: string;
  createdAt: string | Date;
};

export type CreateCoordinatorInput = {
  studentId: number;
  clubId: number;
};

export type UpdateCoordinatorInput = {
  studentId: number;
  clubId: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
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

// Get existing coordinator assignments
export const getCoordinatorAssignments = async () => {
  const { data } = await api.get<ApiResponse<CoordinatorAssignment[]>>(
    "/hod/coordinators",
  );

  if (!data.success) {
    throw new Error(
      data.message || "Failed to fetch coordinator assignments.",
    );
  }

  return data.data;
};

// Appoint a student as a club coordinator
export const createCoordinator = async (
  input: CreateCoordinatorInput,
) => {
  const { data } = await api.post<ApiResponse<CoordinatorAssignment>>(
    "/hod/coordinators",
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to appoint coordinator.");
  }

  return data.data;
};

// Update a coordinator assignment
export const updateCoordinator = async (
  assignmentId: number,
  input: UpdateCoordinatorInput,
) => {
  const { data } = await api.patch<ApiResponse<CoordinatorAssignment>>(
    `/hod/coordinators/${assignmentId}`,
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update coordinator.");
  }

  return data.data;
};

// Deactivate a coordinator assignment
export const deactivateCoordinator = async (
  assignmentId: number,
) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/hod/coordinators/${assignmentId}`,
  );

  if (!data.success) {
    throw new Error(
      data.message || "Failed to deactivate coordinator assignment.",
    );
  }

  return data.data;
};

// Get coordinator status for the logged-in student
export const getCoordinatorStatus =
  async (): Promise<CoordinatorStatus> => {
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
