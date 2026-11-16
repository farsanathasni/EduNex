
import { api } from "@/lib/axios";

export type AttendanceStatus = "present" | "absent";

export interface AttendanceQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AttendancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AttendanceEvent {
  id: number;
  clubId: number;
  clubName: string;
  departmentId: number;
  title: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  unmarked: number;
  percentage: number;
}

export interface EventAttendanceMember {
  studentId: number;
  name: string;
  admissionNumber: string;
  status: AttendanceStatus | null;
  markedAt: string | null;
}

export interface EventAttendanceResult {
  event: AttendanceEvent;
  summary: AttendanceSummary;
  members: EventAttendanceMember[];
  pagination: AttendancePagination;
}

export interface SaveAttendanceInput {
  attendance: {
    studentId: number;
    status: AttendanceStatus;
  }[];
}

export interface AttendanceRecord {
  id: number;
  eventId: number;
  studentId: number;
  status: AttendanceStatus;
  markedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MyAttendanceSummary {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface MyAttendanceRecord {
  id: number;
  eventId: number;
  eventTitle: string;
  clubName: string;
  eventDate: string;
  status: AttendanceStatus;
  markedAt: string;
}

export interface MyAttendanceResult {
  student: {
    id: number;
    name: string;
    admissionNumber: string;
  };
  summary: MyAttendanceSummary;
  records: MyAttendanceRecord[];
}

export interface HodAttendanceEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  clubId: number;
  clubName: string;
  departmentId: number;
}

export interface AttendanceEventsResult {
  events: HodAttendanceEvent[];
  pagination: AttendancePagination;
}

// GET EVENT ATTENDANCE
export const getEventAttendance = async (
  eventId: number,
  query: AttendanceQuery = {},
): Promise<EventAttendanceResult> => {
  const { data } = await api.get<ApiResponse<EventAttendanceResult>>(
    `/attendance/event/${eventId}`,
    { params: query },
  );

  return data.data;
};

// SAVE / UPDATE EVENT ATTENDANCE
export const saveEventAttendance = async (
  eventId: number,
  input: SaveAttendanceInput,
): Promise<AttendanceRecord[]> => {
  const { data } = await api.post<ApiResponse<AttendanceRecord[]>>(
    `/attendance/event/${eventId}`,
    input,
  );

  return data.data;
};

// GET STUDENT OWN ATTENDANCE
export const getStudentAttendance = async (): Promise<MyAttendanceResult> => {
  const { data } = await api.get<ApiResponse<MyAttendanceResult>>(
    "/attendance/student",
  );

  return data.data;
};

// GET ATTENDANCE EVENTS
// Principal: all departments
// HOD: own department
export const getHodAttendanceEvents = async (
  query: AttendanceQuery = {},
): Promise<AttendanceEventsResult> => {
  const { data } = await api.get<ApiResponse<AttendanceEventsResult>>(
    "/attendance/events",
    { params: query },
  );

  return data.data;
};
