import { api } from "@/lib/axios";

export interface Subject {
  id: number;
  name: string;
  code: string;
  semester: number;
  departmentId: number;
  departmentName: string;
  departmentCode: string;
  facultyCount: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubjectFaculty {
  staffId: string;
  name: string;
  email: string;
  employeeId: string;
  designation: string | null;
  assignedAt?: string;
}

interface ApiSuccess<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface SubjectListResult {
  subjects: Subject[];
  pagination: Pagination;
}

export interface FacultyListResult {
  faculty: SubjectFaculty[];
  pagination: Pagination;
}

export interface SubjectInput {
  name: string;
  code: string;
  semester: number;
  departmentId?: number;
}

export interface SubjectListParams {
  search?: string;
  semester?: number;
  departmentId?: number;
  page?: number;
  limit?: number;
}

export interface FacultyListParams {
  search?: string;
  page?: number;
  limit?: number;
}

const BASE = "/subjects";

export const getSubjects = async (
  params: SubjectListParams,
): Promise<SubjectListResult> => {
  const { data } = await api.get<ApiSuccess<Subject[]>>(BASE, { params });
  return {
    subjects: data.data,
    pagination: data.pagination!,
  };
};

export const createSubject = async (input: SubjectInput): Promise<Subject> => {
  const { data } = await api.post<ApiSuccess<Subject>>(BASE, input);
  return data.data;
};

export const updateSubject = async (
  id: number,
  input: Partial<SubjectInput>,
): Promise<Subject> => {
  const { data } = await api.patch<ApiSuccess<Subject>>(`${BASE}/${id}`, input);
  return data.data;
};

export const deleteSubject = async (id: number): Promise<{ id: number }> => {
  const { data } = await api.delete<ApiSuccess<{ id: number }>>(`${BASE}/${id}`);
  return data.data;
};

export const getSubjectFaculty = async (
  subjectId: number,
  params: FacultyListParams,
): Promise<FacultyListResult> => {
  const { data } = await api.get<ApiSuccess<SubjectFaculty[]>>(
    `${BASE}/${subjectId}/faculty`,
    { params },
  );
  return {
    faculty: data.data,
    pagination: data.pagination!,
  };
};

export const getAvailableFaculty = async (
  subjectId: number,
  params: FacultyListParams,
): Promise<FacultyListResult> => {
  const { data } = await api.get<ApiSuccess<SubjectFaculty[]>>(
    `${BASE}/${subjectId}/faculty/available`,
    { params },
  );
  return {
    faculty: data.data,
    pagination: data.pagination!,
  };
};

export const assignSubjectFaculty = async (
  subjectId: number,
  staffId: string,
): Promise<unknown> => {
  const { data } = await api.post<ApiSuccess<unknown>>(
    `${BASE}/${subjectId}/faculty`,
    { staffId },
  );
  return data.data;
};

export const removeSubjectFaculty = async (
  subjectId: number,
  staffId: string,
): Promise<unknown> => {
  const { data } = await api.delete<ApiSuccess<unknown>>(
    `${BASE}/${subjectId}/faculty/${encodeURIComponent(staffId)}`,
  );
  return data.data;
};
