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

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Get HOD dashboard details
export const getHodDashboard = async () => {
  const { data } = await api.get<ApiResponse<HodDashboard>>(
    "/hod/dashboard",
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch HOD details.");
  }

  return data.data;
};

// Get students, optionally filtered by department and semester
export const getHodStudents = async (
  departmentId?: number,
  semester?: number,
) => {
  const params: {
    departmentId?: number;
    semester?: number;
  } = {};

  if (departmentId !== undefined) {
    params.departmentId = departmentId;
  }

  if (semester !== undefined) {
    params.semester = semester;
  }

  const { data } = await api.get<ApiResponse<HodStudent[]>>(
    "/hod/students",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch students.");
  }

  return data.data;
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