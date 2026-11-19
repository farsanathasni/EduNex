import { useQuery } from "@tanstack/react-query";

import {
  getAttendanceOverview,
  getAttendanceSubjects,
  getStudentAttendanceDetail,
  getStudentAttendanceReports,
  type OverviewParams,
  type StudentReportParams,
  type SubjectAverageParams,
} from "./attendance-reports";

export const attendanceReportKeys = {
  all: ["attendance-reports"] as const,
  overview: (params: OverviewParams) =>
    [...attendanceReportKeys.all, "overview", params] as const,
  students: (params: StudentReportParams) =>
    [...attendanceReportKeys.all, "students", params] as const,
  student: (studentId: number, params: OverviewParams) =>
    [...attendanceReportKeys.all, "student", studentId, params] as const,
  subjects: (params: SubjectAverageParams) =>
    [...attendanceReportKeys.all, "subjects", params] as const,
};

export const useAttendanceOverviewQuery = (
  params: OverviewParams,
  enabled = true,
) =>
  useQuery({
    queryKey: attendanceReportKeys.overview(params),
    queryFn: () => getAttendanceOverview(params),
    enabled,
    retry: false,
  });

export const useStudentAttendanceReportsQuery = (
  params: StudentReportParams,
  enabled = true,
) =>
  useQuery({
    queryKey: attendanceReportKeys.students(params),
    queryFn: () => getStudentAttendanceReports(params),
    enabled,
    retry: false,
    placeholderData: (prev) => prev,
  });

export const useStudentAttendanceDetailQuery = (
  studentId: number | null,
  params: OverviewParams,
  enabled = true,
) =>
  useQuery({
    queryKey:
      studentId === null
        ? [...attendanceReportKeys.all, "student", "idle"]
        : attendanceReportKeys.student(studentId, params),
    queryFn: () => getStudentAttendanceDetail(studentId!, params),
    enabled: enabled && studentId !== null,
    retry: false,
  });

export const useAttendanceSubjectsQuery = (
  params: SubjectAverageParams,
  enabled = true,
) =>
  useQuery({
    queryKey: attendanceReportKeys.subjects(params),
    queryFn: () => getAttendanceSubjects(params),
    enabled,
    retry: false,
  });
