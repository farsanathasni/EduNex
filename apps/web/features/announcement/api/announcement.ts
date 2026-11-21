
import { api } from "../../../lib/axios";

export type AnnouncementAudience = "campus" | "department" | "club";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  departmentId: number | null;
  publishedBy: string;
  audience: AnnouncementAudience;
  clubId: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type CreateAnnouncementInput = {
  title: string;
  content: string;
  audience: AnnouncementAudience;
  departmentId?: number;
  clubId?: number;
};

export type UpdateAnnouncementInput = {
  title?: string;
  content?: string;
};

const getAllAnnouncementPages = async (
  search = "",
): Promise<Announcement[]> => {
  const limit = 100;
  const announcements: Announcement[] = [];

  let page = 1;
  let totalPages = 1;

  do {
    const response = await api.get<ApiResponse<Announcement[]>>(
      "/announcements",
      {
        params: { page, limit, search },
      },
    );

    announcements.push(...response.data.data);

    totalPages =
      response.data.pagination?.totalPages ??
      (response.data.data.length === limit ? page + 1 : page);

    page += 1;
  } while (page <= totalPages);

  return announcements;
};

export const getAnnouncements = async (
  search = "",
): Promise<Announcement[]> => {
  return getAllAnnouncementPages(search);
};

export const createAnnouncement = async (
  input: CreateAnnouncementInput,
): Promise<Announcement> => {
  const { data } = await api.post<ApiResponse<Announcement>>(
    "/announcements",
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to create announcement.");
  }

  return data.data;
};

export const updateAnnouncement = async (
  id: number,
  input: UpdateAnnouncementInput,
): Promise<Announcement> => {
  const { data } = await api.patch<ApiResponse<Announcement>>(
    `/announcements/${id}`,
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update announcement.");
  }

  return data.data;
};

export const deleteAnnouncement = async (
  id: number,
): Promise<Announcement> => {
  const { data } = await api.delete<ApiResponse<Announcement>>(
    `/announcements/${id}`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to delete announcement.");
  }

  return data.data;
};
