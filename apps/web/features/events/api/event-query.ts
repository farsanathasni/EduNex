"use client";

import { createEventRequest, CreateEventRequestInput, getAllEvents, getMyEventRequests, getMyEvents } from "@/features/events/api/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getAllEvents, getMyEvents } from "@/lib/events";

export const useAllEventsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["events", "all"],
    queryFn: getAllEvents,
    enabled,
  });
};

export const useMyEventsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["events", "my"],
    queryFn: getMyEvents,
    enabled,
  });
};




export const useMyEventRequestsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["events", "requests", "my"],
    queryFn: getMyEventRequests,
    enabled,
  });
};

export const useCreateEventRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventRequestInput) =>
      createEventRequest(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
  });
};