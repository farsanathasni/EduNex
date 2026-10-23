
import { getClubs } from "@/lib/clubs";
import type { Club } from "@/lib/clubs";
import { isAxiosError } from "axios";

import {
  getHodStudents,
  getCoordinatorAssignments,
  createCoordinator,
  updateCoordinator,
  deactivateCoordinator,
  type CreateCoordinatorInput,
  type UpdateCoordinatorInput,
} from "@/lib/coordinators";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const HodStudentsKey = ["hod-students"] as const;

export const CoordinatorAssignmentsKey = [
  "coordinator-assignments",
] as const;

const shouldRetry = (failureCount: number, error: unknown) => {
  if (
    isAxiosError(error) &&
    (error.response?.status === 401 ||
      error.response?.status === 403)
  ) {
    return false;
  }

  return failureCount < 2;
};

export const useHodStudents = () => {
  return useQuery({
    queryKey: HodStudentsKey,
    queryFn: () => getHodStudents(),
    retry: shouldRetry,
  });
};

export const useClubs = () => {
  return useQuery<Club[]>({
    queryKey: ["clubs"],
    queryFn: getClubs,
    retry: shouldRetry,
  });
};

export const useCoordinatorAssignments = () => {
  return useQuery({
    queryKey: CoordinatorAssignmentsKey,
    queryFn: getCoordinatorAssignments,
    retry: shouldRetry,
  });
};

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

export const useUpdateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: number;
      data: UpdateCoordinatorInput;
    }) => updateCoordinator(assignmentId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CoordinatorAssignmentsKey,
      });
    },
  });
};

export const useDeactivateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: number) =>
      deactivateCoordinator(assignmentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CoordinatorAssignmentsKey,
      });
    },
  });
};
