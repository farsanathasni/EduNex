// import api from "@/lib/axios";

import { api } from "./axios";

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
}

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get<ApiResponse<Event[]>>("/events/");
  return response.data.data;
};

export const getMyEvents = async (): Promise<Event[]> => {
  const response = await api.get<ApiResponse<Event[]>>("/events/my");
  return response.data.data;
};