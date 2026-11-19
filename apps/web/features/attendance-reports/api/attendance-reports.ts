import { api } from "@/lib/axios";

export interface AttendanceOverview {
  departmentId: number | null;
  departmentName: string | null;
  students: number;
  attended: number;
  total: number;
  averagePercentage: number;
  belowThreshold: number;
}

export interface StudentReportRow {
  studentId: number;
  name: string;
  admissionNumber: string;
  departmentId: number;
  departmentName: string;
  semester: number;
  attended: number;
  total: number;
  percentage: number;
  belowThreshold: boolean;
}

export interface SubjectAverage {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  semester: number;
  departmentId: number;
  departmentName: string;
  students: number;
  attended: number;
  total: number;
  percentage: number;
  belowThreshold: boolean;
}

export interface SubjectBreakdown {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  semester: number;
  attended: number;
  total: number;
  percentage: number;
  belowThreshold: boolean;
}

export interface StudentReportDetail {
  student: {
    studentId: number;
    name: string;
    admissionNumber: string;
    departmentId: number;
    departmentName: string;
    semester: number;
  };
  overall: {
    attended: number;
    total: number;
    percentage: number;
  };
  subjects: SubjectBreakdown[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentReportListResult {
  students: StudentReportRow[];
  pagination: Pagination;
}

export interface OverviewParams {
  semester?: number;
}

export interface StudentReportParams extends OverviewParams {
  search?: string;
  subjectId?: number;
  from?: string;
  to?: string;
  belowThreshold?: boolean;
  sort?: "percentage" | "name" | "admissionNumber";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SubjectAverageParams extends OverviewParams {
  from?: string;
  to?: string;
}

interface ApiSuccess<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

const BASE = "/attendance-reports";

export const getAttendanceOverview = async (
  params: OverviewParams,
): Promise<AttendanceOverview> => {
  const { data } = await api.get<ApiSuccess<AttendanceOverview>>(
    `${BASE}/overview`,
    { params },
  );
  return data.data;
};

export const getStudentAttendanceReports = async (
  params: StudentReportParams,
): Promise<StudentReportListResult> => {
  const { data } = await api.get<ApiSuccess<StudentReportRow[]>>(
    `${BASE}/students`,
    { params },
  );
  return {
    students: data.data,
    pagination: data.pagination!,
  };
};

export const getStudentAttendanceDetail = async (
  studentId: number,
  params: OverviewParams,
): Promise<StudentReportDetail> => {
  const { data } = await api.get<ApiSuccess<StudentReportDetail>>(
    `${BASE}/students/${studentId}`,
    { params },
  );
  return data.data;
};

export const getAttendanceSubjects = async (
  params: SubjectAverageParams,
): Promise<SubjectAverage[]> => {
  const { data } = await api.get<ApiSuccess<SubjectAverage[]>>(
    `${BASE}/subjects`,
    { params },
  );
  return data.data;
};
