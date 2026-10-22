
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createClub, createStudentMembershipRequest, getClubs, getMyStudentMembershipRequests, getStudentClubAnnouncements, getStudentClubById, getStudentClubCoordinators, getStudentClubEvents, getStudentClubs } from "@/lib/clubs";
import type { CreateClubInput } from "@/validation/club-schema";


export const useClubsQuery = () => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: getClubs,
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
    },
  });
};



export const useStudentClubsQuery =()=>{
  return useQuery({
    queryKey:["student-clubs"],
    queryFn:getStudentClubs
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


export const useMyStudentMembershipRequestsQuery = () => {
  return useQuery({
    queryKey: ["student-memberships"],
    queryFn: getMyStudentMembershipRequests,
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



