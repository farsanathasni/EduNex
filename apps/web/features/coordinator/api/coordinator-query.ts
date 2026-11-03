import { isAxiosError } from "axios";
import {
  createCoordinator,
  getCoordinatorAssignments,
  getCoordinatorStatus,
  type CreateCoordinatorInput,
} from "@/features/coordinator/api/coordinators";
import { getHodStudents } from "@/features/hod/api/hod";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const retryUnlessAuthError = (
  failureCount: number,
  error: unknown,
) => {
  if (
    isAxiosError(error) &&
    (error.response?.status === 401 ||
      error.response?.status === 403)
  ) {
    return false;
  }

  return failureCount < 2;
};

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
    retry: retryUnlessAuthError,
  });
};

// Fetch coordinator assignments
export const useCoordinatorAssignments = () => {
  return useQuery({
    queryKey: CoordinatorAssignmentsKey,
    queryFn: getCoordinatorAssignments,
    retry: retryUnlessAuthError,
  });
};

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

export const useCoordinatorStatusQuery =()=>{
    return useQuery({
        queryKey:["coordinator","status"],
        queryFn:getCoordinatorStatus
    })
}