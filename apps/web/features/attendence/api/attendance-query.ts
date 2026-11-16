
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getEventAttendance,
  getHodAttendanceEvents,
  getStudentAttendance,
  saveEventAttendance,
  type AttendanceQuery,
  type SaveAttendanceInput,
} from "./attendance";

export const attendanceKeys = {
  all: ["attendance"] as const,

  events: (query: AttendanceQuery) =>
    [...attendanceKeys.all, "events", query] as const,

  event: (eventId: number, query: AttendanceQuery) =>
    [...attendanceKeys.all, "event", eventId, query] as const,

  student: () =>
    [...attendanceKeys.all, "student"] as const,
};

// STUDENT ATTENDANCE
export const useStudentAttendance = () => {
  return useQuery({
    queryKey: attendanceKeys.student(),
    queryFn: getStudentAttendance,
  });
};

// PRINCIPAL / HOD ATTENDANCE EVENTS
export const useHodAttendanceEvents = (
  query: AttendanceQuery = {},
) => {
  return useQuery({
    queryKey: attendanceKeys.events(query),
    queryFn: () => getHodAttendanceEvents(query),
  });
};

// EVENT ATTENDANCE MEMBERS
export const useEventAttendance = (
  eventId: number,
  query: AttendanceQuery = {},
) => {
  return useQuery({
    queryKey: attendanceKeys.event(eventId, query),
    queryFn: () => getEventAttendance(eventId, query),
    enabled: Number.isInteger(eventId) && eventId > 0,
  });
};

// SAVE / UPDATE ATTENDANCE
export const useSaveEventAttendance = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveAttendanceInput) =>
      saveEventAttendance(eventId, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...attendanceKeys.all, "event", eventId],
      });
    },
  });
};
