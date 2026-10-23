import {
  getPendingEvents,
  reviewEvent,
} from "@/lib/hod-event-approvals";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useHodPendingEvents = () => {
  return useQuery({
    queryKey: ["hod", "event-approvals", "pending"],
    queryFn: getPendingEvents,
    retry: false,
  });
};

export const useReviewHodEvent = () => {
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
      reviewEvent(eventId, {
        decision,
        comments,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["hod", "event-approvals", "pending"],
      });
    },

    retry: false,
  });
};