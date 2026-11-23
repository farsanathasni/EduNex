
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

export interface AnnouncementPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AnnouncementsParams {
  search?: string;
  page?: number;
  limit?: number;
  audience?: "campus" | "department" | "club";
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: AnnouncementPagination;
}

export interface AnnouncementsResponse {
  announcements: Announcement[];
  pagination: AnnouncementPagination;
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

export const getAnnouncements = async (
  params: AnnouncementsParams = {},
): Promise<AnnouncementsResponse> => {
  const { data } = await api.get<ApiResponse<Announcement[]>>(
    "/announcements",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 6,
        search: params.search?.trim() ?? "",
        ...(params.audience ? { audience: params.audience } : {}),
      },
    },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch announcements.");
  }

  return {
    announcements: data.data,
    pagination: data.pagination ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 6,
      total: data.data.length,
      totalPages: data.data.length > 0 ? 1 : 0,
    },
  };
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
