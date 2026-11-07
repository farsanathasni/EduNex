// import api from "@/lib/axios";

import { api } from "../../../lib/axios";

export interface Event {
  id: number;
  clubId: number;
  clubName: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: { totalPages: number };
}

const getAllEventPages = async (path: string): Promise<Event[]> => {
  const limit = 100;
  const events: Event[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await api.get<ApiResponse<Event[]>>(path, {
      params: { page, limit },
    });
    events.push(...response.data.data);
    totalPages =
      response.data.pagination?.totalPages ??
      (response.data.data.length === limit ? page + 1 : page);
    page += 1;
  } while (page <= totalPages);

  return events;
};

export const getAllEvents = async (): Promise<Event[]> => {
  return getAllEventPages("/events/");
};

export const getMyEvents = async (): Promise<Event[]> => {
  return getAllEventPages("/events/my");
};
