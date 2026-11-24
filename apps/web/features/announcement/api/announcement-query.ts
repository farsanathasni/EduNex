
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  type AnnouncementsParams,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
} from "./announcement";

export const announcementKeys = {
  all: ["announcements"] as const,
  lists: () => [...announcementKeys.all, "list"] as const,
  list: (params: AnnouncementsParams) =>
    [...announcementKeys.lists(), params] as const,
};

export const useAnnouncementsQuery = (
  params: AnnouncementsParams,
) => {
  return useQuery({
    queryKey: announcementKeys.list(params),
    queryFn: () => getAnnouncements(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateAnnouncementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAnnouncementInput) =>
      createAnnouncement(input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.all,
      });
    },
  });
};

export const useUpdateAnnouncementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateAnnouncementInput;
    }) => updateAnnouncement(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.all,
      });
    },
  });
};

export const useDeleteAnnouncementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAnnouncement(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: announcementKeys.all,
      });
    },
  });
};
