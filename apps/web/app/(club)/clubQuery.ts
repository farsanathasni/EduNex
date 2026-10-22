
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createClub, getClubs } from "@/lib/clubs";

export const useClubsQuery = () => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: getClubs,
  });
};

export const useCreateClubMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClub,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clubs"],
      });
    },
  });
};
