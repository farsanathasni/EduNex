
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { assignClubDepartment, createClub, createStudentMembershipRequest, deleteClub, getClubs, getMyStudentMembershipRequests, getStudentClubAnnouncements, getStudentClubById, getStudentClubCoordinators, getStudentClubEvents, getStudentClubs, updateClub } from "@/features/clubs/api/clubs";
import type { ClubListParams } from "@/features/clubs/api/clubs";
import type { CreateClubInput, UpdateClubInput } from "@/features/clubs/validation/club-schema";


type QueryRetry =
  | boolean
  | number
  | ((failureCount: number, error: Error) => boolean);

export const useClubsQuery = (retry?: QueryRetry, enabled = true) => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: () => getClubs(),
    enabled,
    ...(retry !== undefined ? { retry } : {}),
  });
};

export const useClubListQuery = (
  params: ClubListParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["clubs", "list", params],
    queryFn: () => getClubs(params),
    enabled,
    retry: false,
  });
};

export const useCreateClubMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClubInput) => createClub(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clubs"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["student-clubs"],
      });
      await queryClient.invalidateQueries({ queryKey: ["hod", "clubs"] });
    },
  });
};

export const useAssignClubDepartmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { clubId: number; departmentId: number }) =>
      assignClubDepartment(input.clubId, input.departmentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clubs"] });
      await queryClient.invalidateQueries({ queryKey: ["hod", "clubs"] });
    },
  });
};

export const useUpdateClubMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { clubId: number; data: UpdateClubInput }) =>
      updateClub(input.clubId, input.data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["clubs"] }),
        queryClient.invalidateQueries({ queryKey: ["hod", "clubs"] }),
        queryClient.invalidateQueries({ queryKey: ["student-clubs"] }),
      ]);
    },
  });
};

export const useDeleteClubMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: number) => deleteClub(clubId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["clubs"] }),
        queryClient.invalidateQueries({ queryKey: ["hod", "clubs"] }),
        queryClient.invalidateQueries({ queryKey: ["student-clubs"] }),
      ]);
    },
  });
};



export const useStudentClubsQuery = (enabled = true) => {
  return useQuery({
    queryKey:["student-clubs"],
    queryFn:getStudentClubs,
    enabled,
  })
}


export const useStudentClubByIdQuery =(clubId:number)=>{
  return useQuery({
    queryKey:["student-clubs",clubId],
    queryFn:()=>getStudentClubById(clubId),
    enabled:Number.isFinite(clubId)&&clubId>0,
  })
}


export const useStudentClubCoordinatorsQuery =(clubId:number)=>{
  return useQuery({
    queryKey:["student-clubs",clubId,"coordinators"],
    queryFn:()=>getStudentClubCoordinators(clubId),
    enabled:Number.isFinite(clubId)&&clubId>0
  })
}


export const useStudentClubEventsQuery =(clubId:number)=>{
  return useQuery({
    queryKey:["student-clubs",clubId,"events"],
    queryFn:()=>getStudentClubEvents(clubId),
    enabled:Number.isFinite(clubId)&&clubId>0
  })
}


export const useStudentClubAnnouncementsQuery = (clubId: number) => {
  return useQuery({
    queryKey: ["student-clubs", clubId, "announcements"],
    queryFn: () => getStudentClubAnnouncements(clubId),
    enabled: Number.isFinite(clubId) && clubId > 0,
  });
};


export const useMyStudentMembershipRequestsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["student-memberships"],
    queryFn: getMyStudentMembershipRequests,
    enabled,
  });
};


export const useCreateStudentMembershipRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: number) =>
      createStudentMembershipRequest(clubId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-memberships"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["student-clubs"],
      });
    },
  });
};



