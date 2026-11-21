import { api } from "@/lib/axios";

export type ClassAttendanceStatus = "present" | "absent" | "late";

export interface ClassSubject {
  id: number;
  name: string;
  code: string;
  semester: number;
}

export interface AttendanceRosterStudent {
  id: number;
  name: string;
  admissionNumber: string;
  status: ClassAttendanceStatus;
  remark: string | null;
}

export interface AttendanceRosterSubject {
  id: number;
  name: string;
  code: string;
  departmentId: number;
  semester: number;
}

export interface AttendanceRosterData {
  subject: AttendanceRosterSubject;
  date: string;
  period: number;
  alreadyMarked: boolean;
  editable: boolean;
  students: AttendanceRosterStudent[];
}

export interface SaveClassAttendanceInput {
  subjectId: number;
  date: string;
  period: number;
  records: {
    studentId: number;
    status: ClassAttendanceStatus;
    remark?: string | null;
  }[];
}

export interface SaveClassAttendanceData {
  sessionId: number;
  saved: number;
}

export interface StudentSubjectAttendance {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  total: number;
  attended: number;
  percentage: number;
  belowMinimum: boolean;
}

export interface StudentAttendanceSummaryData {
  minimumPercentage: number;
  overall: {
    total: number;
    attended: number;
    percentage: number;
  };
  subjects: StudentSubjectAttendance[];
}

interface ApiSuccess<T> {
  success: boolean;
  data: T;
  message?: string;
}

const BASE = "/class-attendance";

export const getMyTeachingSubjects = async (): Promise<ClassSubject[]> => {
  const { data } = await api.get<ApiSuccess<ClassSubject[]>>(
    `${BASE}/subjects`,
  );
  return data.data;
};

export const getAttendanceRoster = async (params: {
  subjectId: number;
  date: string;
  period: number;
}): Promise<AttendanceRosterData> => {
  const { data } = await api.get<ApiSuccess<AttendanceRosterData>>(
    `${BASE}/roster`,
    { params },
  );
  return data.data;
};

export const saveClassAttendance = async (
  input: SaveClassAttendanceInput,
): Promise<SaveClassAttendanceData> => {
  const { data } = await api.put<ApiSuccess<SaveClassAttendanceData>>(
    `${BASE}/sessions`,
    input,
  );
  return data.data;
};

export const getMyClassAttendanceSummary =
  async (): Promise<StudentAttendanceSummaryData> => {
    const { data } = await api.get<ApiSuccess<StudentAttendanceSummaryData>>(
      `${BASE}/my-summary`,
    );
    return data.data;
  };
