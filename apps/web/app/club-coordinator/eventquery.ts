"use client";

import { getAllEvents, getMyEvents } from "@/lib/event";
import { useQuery } from "@tanstack/react-query";
// import { getAllEvents, getMyEvents } from "@/lib/events";

export const useAllEventsQuery = () => {
  return useQuery({
    queryKey: ["events", "all"],
    queryFn: getAllEvents,
  });
};

export const useMyEventsQuery = () => {
  return useQuery({
    queryKey: ["events", "my"],
    queryFn: getMyEvents,
  });
};