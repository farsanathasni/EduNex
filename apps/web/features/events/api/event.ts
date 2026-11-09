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


export type CreateEventRequestInput = {
  clubId: number;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
};

export type CreatedEventRequest = {
  id: number;
  clubId: number;
  requestedBy: string | null;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
};


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


export const getMyEventRequests = async (): Promise<Event[]> => {
  return getAllEventPages("/events/requests/my");
};

export const createEventRequest = async (
  input: CreateEventRequestInput,
): Promise<CreatedEventRequest> => {
  try {
    const { data } = await api.post<ApiResponse<CreatedEventRequest>>(
      "/events/requests",
      input,
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to submit event request.");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error && !("isAxiosError" in error)) {
      throw error;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const response = (
        error as {
          response?: { data?: { message?: string } };
        }
      ).response;

      throw new Error(
        response?.data?.message || "Failed to submit event request.",
      );
    }

    throw new Error("Something went wrong while submitting the request.");
  }
};