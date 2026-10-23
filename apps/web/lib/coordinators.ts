
import { api } from "./axios";

export type HodDashboard = {
  staffId: number;
  employeeId: string;
  role: string;
  departmentId: number | null;
  designation: string | null;
};

export type HodStudent = {
  id: number;
  name: string;
  admissionNumber: string;
  departmentId: number | null;
  departmentName: string;
  departmentCode: string;
  semester: number | null;
  phone: string | null;
  userId: string;
  email: string;
};

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

export const getHodDashboard = async () => {
  const { data } = await api.get<ApiResponse<HodDashboard>>(
    "/hod/dashboard",
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch HOD details.");
  }

  return data.data;
};

export const getHodStudents = async (
  departmentId?: number,
  semester?: number,
) => {
  const params: {
    departmentId?: number;
    semester?: number;
  } = {};

  if (departmentId !== undefined) params.departmentId = departmentId;
  if (semester !== undefined) params.semester = semester;

  const { data } = await api.get<ApiResponse<HodStudent[]>>(
    "/hod/students",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch students.");
  }

  return data.data;
};

export const getCoordinatorAssignments = async () => {
  const { data } = await api.get<
    ApiResponse<CoordinatorAssignment[]>
  >("/hod/coordinators");

  if (!data.success) {
    throw new Error(
      data.message || "Failed to fetch coordinator assignments.",
    );
  }

  return data.data;
};

export const createCoordinator = async (
  input: CreateCoordinatorInput,
) => {
  const { data } = await api.post<
    ApiResponse<CoordinatorAssignment>
  >("/hod/coordinators", input);

  if (!data.success) {
    throw new Error(data.message || "Failed to appoint coordinator.");
  }

  return data.data;
};

// Update the student or club in an existing assignment.
// Requires a PATCH endpoint in the Express backend.
export const updateCoordinator = async (
  assignmentId: number,
  input: UpdateCoordinatorInput,
) => {
  const { data } = await api.patch<
    ApiResponse<CoordinatorAssignment>
  >(`/hod/coordinators/${assignmentId}`, input);

  if (!data.success) {
    throw new Error(data.message || "Failed to update coordinator.");
  }

  return data.data;
};

// Soft-delete (deactivate) an assignment.
// Requires the backend DELETE handler to set an inactive/deleted flag,
// not permanently delete the database record.
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

  return data;
};
