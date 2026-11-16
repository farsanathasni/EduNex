
import { api } from "@/lib/axios";

export type AttendanceStatus = "present" | "absent";

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


// Fetch event attendance
export const getEventAttendance = async (
  eventId: number,
): Promise<EventAttendanceResult> => {
  const { data } = await api.get<ApiResponse<EventAttendanceResult>>(
    `/attendance/event/${eventId}`,
  );

  return data.data;
};

// Save or update event attendance
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



export const getStudentAttendance = async (): Promise<MyAttendanceResult> => {
  const { data } = await api.get<ApiResponse<MyAttendanceResult>>(
    "/attendance/student",
  );

  return data.data;
};


export const getHodAttendanceEvents = async (): Promise<
  HodAttendanceEvent[]
> => {
  const { data } = await api.get<ApiResponse<HodAttendanceEvent[]>>(
    "/attendance/events",
  );

  return data.data;
};