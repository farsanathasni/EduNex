
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createAnnouncement, CreateAnnouncementInput, deleteAnnouncement, getAnnouncements, updateAnnouncement, UpdateAnnouncementInput } from "./announcement";



export const announcementKeys = {
  all: ["announcements"] as const,
  lists: () => [...announcementKeys.all, "list"] as const,
  list: (search: string) =>
    [...announcementKeys.lists(), search] as const,
};

export const useAnnouncementsQuery = (search = "") => {
  return useQuery({
    queryKey: announcementKeys.list(search),
    queryFn: () => getAnnouncements(search),
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
