
import { isAxiosError } from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCoordinator,
  getCoordinatorAssignments,
  getCoordinatorStatus,
  updateCoordinator,
  deactivateCoordinator,
  type CreateCoordinatorInput,
  type CoordinatorAssignmentsParams,
  type UpdateCoordinatorInput,
} from "@/features/coordinator/api/coordinators";

import {
  getCoordinatorClubMembers,
  getCoordinatorMembershipRequests,
  reviewClubMembershipRequest,
} from "@/features/clubs/api/clubs";

import { getHodStudents } from "@/features/hod/api/hod";

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

export const HodStudentsKey = ["hod-students"] as const;

export const CoordinatorAssignmentsKey = [
  "coordinator-assignments",
] as const;

// HOD students
export const useHodStudents = () => {
  return useQuery({
    queryKey: HodStudentsKey,
    queryFn: () => getHodStudents(),
    retry: retryUnlessAuthError,
  });
};

// Coordinator assignments
export const useCoordinatorAssignments = (
  params?: CoordinatorAssignmentsParams,
) => {
  return useQuery({
    queryKey: params
      ? [...CoordinatorAssignmentsKey, params]
      : CoordinatorAssignmentsKey,
    queryFn: () => getCoordinatorAssignments(params),
    retry: retryUnlessAuthError,
  });
};

// Create coordinator
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

// Update coordinator
export const useUpdateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      input,
    }: {
      assignmentId: number;
      input: UpdateCoordinatorInput;
    }) => updateCoordinator(assignmentId, input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CoordinatorAssignmentsKey,
      });
    },
  });
};

// Deactivate coordinator
export const useDeactivateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateCoordinator,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CoordinatorAssignmentsKey,
      });
    },
  });
};

// Coordinator status
export const useCoordinatorStatusQuery = () => {
  return useQuery({
    queryKey: ["coordinator", "status"],
    queryFn: getCoordinatorStatus,
    retry: retryUnlessAuthError,
  });
};

// Membership requests
export const useCoordinatorMembershipRequests = (enabled = true) => {
  return useQuery({
    queryKey: ["coordinator", "membership-requests"],
    queryFn: getCoordinatorMembershipRequests,
    retry: retryUnlessAuthError,
    enabled,
  });
};

// Review membership request
export const useReviewClubMembershipRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      decision,
    }: {
      requestId: number;
      decision: "approved" | "rejected";
    }) => reviewClubMembershipRequest(requestId, decision),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["coordinator", "membership-requests"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["coordinator", "club-members"],
      });
    },
  });
};

// Club members
export const useCoordinatorClubMembers = (enabled = true) => {
  return useQuery({
    queryKey: ["coordinator", "club-members"],
    queryFn: getCoordinatorClubMembers,
    retry: retryUnlessAuthError,
    enabled,
  });
};
