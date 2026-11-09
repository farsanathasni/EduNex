
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  reviewPrincipalEvent,
  publishPrincipalEvent,
} from "./principal";

export const useReviewPrincipalEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      decision,
      comments,
    }: {
      eventId: number;
      decision: "approved" | "rejected";
      comments?: string;
    }) =>
      reviewPrincipalEvent(eventId, {
        decision,
        comments,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["principal-events"],
      });
    },

    retry: false,
  });
};

export const usePublishPrincipalEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) =>
      publishPrincipalEvent(eventId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["principal-all-events"],
      });
    },

    retry: false,
  });
};
