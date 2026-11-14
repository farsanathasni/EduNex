
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import { getEventAttendance, getHodAttendanceEvents, getStudentAttendance, HodAttendanceEvent, SaveAttendanceInput, saveEventAttendance } from "./attendance";



export const attendanceKeys = {
  all: ["attendance"] as const,
  event: (eventId: number) =>
    [...attendanceKeys.all, "event", eventId] as const,
};


export const useStudentAttendance = () => {
  return useQuery({
    queryKey: [...attendanceKeys.all, "student"],
    queryFn: getStudentAttendance,
  });
};


export const useHodAttendanceEvents =()=>{
  return useQuery({
    queryKey:[...attendanceKeys.all,"hod","events"],
    queryFn:()=>getHodAttendanceEvents(),
  })
}

// Fetch event attendance
export const useEventAttendance = (eventId: number) => {
  return useQuery({
    queryKey: attendanceKeys.event(eventId),
    queryFn: () => getEventAttendance(eventId),
    enabled: Number.isInteger(eventId) && eventId > 0,
  });
};

// Save or update attendance
export const useSaveEventAttendance = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveAttendanceInput) =>
      saveEventAttendance(eventId, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.event(eventId),
      });
    },
  });
};
