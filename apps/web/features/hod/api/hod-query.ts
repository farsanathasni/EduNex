import {
  createHodClub,
  getHodClubs,
  getHodDashboard,
  getHodStudents,
} from "@/features/hod/api/hod";
import type { ClubListParams } from "@/features/clubs/api/clubs";
import type { CreateHodClubInput } from "@/features/clubs/validation/club-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useHodDashboard = () => {
  return useQuery({
    queryKey: ["hod", "dashboard"],
    queryFn: getHodDashboard,
    retry: false,
  });
};

export const useHodStudents = (
  departmentId?: number,
  semester?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "hod",
      "students",
      departmentId ?? "all",
      semester ?? "all",
    ],
    queryFn: () => getHodStudents(departmentId, semester),
    enabled,
    retry: false,
  });
};

export const useHodClubs = (enabled = true) => {
  return useQuery({
    queryKey: ["hod", "clubs"],
    queryFn: () => getHodClubs(),
    enabled,
    retry: false,
  });
};

export const useHodClubListQuery = (
  params: ClubListParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["hod", "clubs", "list", params],
    queryFn: () => getHodClubs(params),
    enabled,
    retry: false,
  });
};

export const useCreateHodClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateHodClubInput) => createHodClub(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["hod", "clubs"] });
      await queryClient.invalidateQueries({ queryKey: ["clubs"] });
      await queryClient.invalidateQueries({ queryKey: ["student-clubs"] });
    },
  });
};