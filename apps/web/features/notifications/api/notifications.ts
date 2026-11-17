import { api } from "../../../lib/axios";



export type Notification = {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  referenceType: string | null;
  referenceId: number | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notifications");
  return response.data.data;
};

export const markNotificationRead = async (id: number) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

export interface NotificationsPageResponse {
  success: boolean;
  message: string;
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


export const getNotificationsPage = async (
  page = 1,
  limit = 15,
  unreadOnly = false,
): Promise<NotificationsPageResponse> => {
  const response = await api.get("/notifications", {
    params: { page, limit, unread: unreadOnly },
  });
  return response.data;
};