import { getClubs } from "@/lib/clubs";
import type { Club } from "@/lib/clubs";
import { isAxiosError } from "axios";
import {
  getHodStudents,
  getCoordinatorAssignments,
  createCoordinator,
  type CreateCoordinatorInput,
} from "@/lib/coordinators";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Query keys
export const HodStudentsKey = ["hod-students"] as const;

export const CoordinatorAssignmentsKey = [
  "coordinator-assignments",
] as const;

// Fetch all students
export const useHodStudents = () => {
  return useQuery({
    queryKey: HodStudentsKey,
    queryFn: () => getHodStudents(),
    retry: (failureCount, error: unknown) => {
  if (
    isAxiosError(error) &&
    (error.response?.status === 401 ||
      error.response?.status === 403)
  ) {
    return false;
  }

  return failureCount < 2;
},
  });
};

// Fetch all available clubs
export const useClubs = () => {
  return useQuery<Club[]>({
    queryKey: ["clubs"],
    queryFn: getClubs,
    retry: (failureCount, error: unknown) => {
  if (
    isAxiosError(error) &&
    (error.response?.status === 401 ||
      error.response?.status === 403)
  ) {
    return false;
  }

  return failureCount < 2;
},
  });
};

// Fetch coordinator assignments
export const useCoordinatorAssignments = () => {
  return useQuery({
    queryKey: CoordinatorAssignmentsKey,
    queryFn: getCoordinatorAssignments,
    retry: (failureCount, error: unknown) => {
       if (
    isAxiosError(error) &&
    (error.response?.status === 401 ||
      error.response?.status === 403)
  ) {
    return false;
  }

  return failureCount < 2;
},
});
}

// Appoint a student as a coordinator
export const useCreateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCoordinatorInput) =>
      createCoordinator(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CoordinatorAssignmentsKey,
      });
    },
  });
};