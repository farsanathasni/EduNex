"use client";

import { getAllEvents, getMyEvents } from "@/features/events/api/event";
import { useQuery } from "@tanstack/react-query";
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
