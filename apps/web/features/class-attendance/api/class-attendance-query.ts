import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAttendanceRoster,
  getMyClassAttendanceSummary,
  getMyTeachingSubjects,
  saveClassAttendance,
  type SaveClassAttendanceInput,
} from "./class-attendance";

export const classAttendanceKeys = {
  all: ["class-attendance"] as const,
  subjects: () => [...classAttendanceKeys.all, "subjects"] as const,
  roster: (subjectId: number, date: string, period: number) =>
    [...classAttendanceKeys.all, "roster", subjectId, date, period] as const,
  mySummary: () => [...classAttendanceKeys.all, "my-summary"] as const,
};

export const useMyTeachingSubjectsQuery = (enabled = true) =>
  useQuery({
    queryKey: classAttendanceKeys.subjects(),
    queryFn: getMyTeachingSubjects,
    enabled,
    retry: false,
  });

export const useAttendanceRosterQuery = (
  params: { subjectId: number; date: string; period: number } | null,
) =>
  useQuery({
    queryKey: params
      ? classAttendanceKeys.roster(params.subjectId, params.date, params.period)
      : [...classAttendanceKeys.all, "roster", "idle"],
    queryFn: () => getAttendanceRoster(params!),
    enabled: !!params && params.subjectId > 0 && !!params.date,
    retry: false,
  });

export const useSaveClassAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveClassAttendanceInput) =>
      saveClassAttendance(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: classAttendanceKeys.roster(
          variables.subjectId,
          variables.date,
          variables.period,
        ),
      });
    },
  });
};

export const useMyClassAttendanceSummaryQuery = (enabled = true) =>
  useQuery({
    queryKey: classAttendanceKeys.mySummary(),
    queryFn: getMyClassAttendanceSummary,
    enabled,
    retry: false,
  });
