"use client";

import { useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../../../lib/axios";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  Notification,
  getNotificationsPage,
} from "./notifications";



const PAGE_KEY = ["notifications-page"];
const NOTIFICATIONS_KEY = ["notifications"];

export const useNotifications = () =>
  useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: getNotifications,
  });

// Opens the SSE connection and pushes new notifications into the cache.
export const useNotificationStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // EventSource can't use axios, so reuse axios's base URL
    const es = new EventSource(
      `${api.defaults.baseURL}/notifications/stream`,
      { withCredentials: true },
    );

    es.onmessage = (event) => {
      const incoming: Notification = JSON.parse(event.data);

      queryClient.setQueryData<Notification[]>(
        NOTIFICATIONS_KEY,
        (old = []) =>
          old.some((n) => n.id === incoming.id) ? old : [incoming, ...old],
      );
      queryClient.invalidateQueries({ queryKey: PAGE_KEY });
    };

    return () => es.close();
  }, [queryClient]);
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markNotificationRead(id),

    onSuccess: (_data, id) => {
      queryClient.setQueryData<Notification[]>(
        NOTIFICATIONS_KEY,
        (old = []) =>
          old.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      queryClient.invalidateQueries({ queryKey: PAGE_KEY });
    },

    retry: false,
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),

    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(
        NOTIFICATIONS_KEY,
        (old = []) => old.map((n) => ({ ...n, isRead: true })),
      );
      queryClient.invalidateQueries({ queryKey: PAGE_KEY });
    },

    retry: false,
  });
};

export const useNotificationsPage = (page: number, unreadOnly: boolean) =>
  useQuery({
    queryKey: [...PAGE_KEY, page, unreadOnly],
    queryFn: () => getNotificationsPage(page, 15, unreadOnly),
    placeholderData: (previous) => previous, // no flicker between pages
  });