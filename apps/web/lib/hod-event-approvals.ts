
import { api } from "./axios";

export type PendingEvent = {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  clubId: number;
  clubName: string;
};

export type ReviewDecision = "approved" | "rejected";

export type ReviewEventData = {
  decision: ReviewDecision;
  comments?: string;
};

export async function getPendingEvents(): Promise<PendingEvent[]> {
  const response = await api.get("/hod/events/pending");

  return response.data.data ?? [];
}

export async function reviewEvent(
  eventId: number,
  data: ReviewEventData,
) {
  const response = await api.patch(
    `/hod/events/${eventId}/review`,
    data,
  );

  return response.data;
}
