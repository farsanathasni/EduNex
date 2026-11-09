
import { api } from "../../../lib/axios";

export const getPrincipalDashboard = async () => {
  const response = await api.get("/principal/dashboard");
  return response.data;
};

export const getPrincipalDepartments = async () => {
  const response = await api.get("/principal/departments");
  return response.data;
};

export interface CreateHodInput {
  name: string;
  email: string;
  password: string;
  employeeId: string;
  departmentId: string;
  designation: string;
  phone?: string;
}

export const createHod = async (data: CreateHodInput) => {
  const response = await api.post("/principal/hods", data);
  return response.data;
};


// Principal event requests

export interface PrincipalEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  clubId: number;
  clubName: string;
}

export interface PrincipalEventsResponse {
  success: boolean;
  message: string;
  data: PrincipalEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getPrincipalEvents = async (
  page = 1,
  limit = 10,
  search = "",
): Promise<PrincipalEventsResponse> => {
  const response = await api.get("/principal/events", {
    params: { page, limit, search },
  });

  return response.data;
};

export type PrincipalReviewDecision = "approved" | "rejected";

export interface PrincipalReviewData {
  decision: PrincipalReviewDecision;
  comments?: string;
}

export const reviewPrincipalEvent = async (
  eventId: number,
  data: PrincipalReviewData,
) => {
  const response = await api.patch(
    `/principal/events/${eventId}/review`,
    data,
  );

  return response.data;
};

export const getPrincipalAllEvents = async (
  page = 1,
  limit = 10,
  search = "",
) => {
  const response = await api.get("/principal/events/all", {
    params: { page, limit, search },
  });

  return response.data;
};


export const publishPrincipalEvent = async (eventId: number) => {
  const response = await api.patch(
    `/principal/events/${eventId}/publish`,
  );

  return response.data;
};
