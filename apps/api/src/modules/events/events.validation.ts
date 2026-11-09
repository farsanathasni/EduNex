import { z } from "zod";

export const eventsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer.")
    .min(1, "Page must be at least 1.")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer.")
    .min(1, "Limit must be at least 1.")
    .max(100, "Limit cannot exceed 100.")
    .default(10),

  search: z
    .string()
    .trim()
    .max(150, "Search cannot exceed 150 characters.")
    .default(""),
});

export const createEventRequestSchema = z
  .object({
    clubId: z.coerce
      .number()
      .int("Club ID must be an integer.")
      .positive("Invalid club ID."),

    title: z
      .string()
      .trim()
      .min(3, "Event title must contain at least 3 characters.")
      .max(200, "Event title cannot exceed 200 characters."),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters.")
      .optional(),

    location: z
      .string()
      .trim()
      .max(255, "Location cannot exceed 255 characters.")
      .optional(),

    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
  })
  .refine(
    (data) =>
      new Date(data.endTime).getTime() >
      new Date(data.startTime).getTime(),
    {
      message: "End time must be after start time.",
      path: ["endTime"],
    },
  );

export type EventsQuery = z.infer<typeof eventsQuerySchema>;
export type CreateEventRequest = z.infer<typeof createEventRequestSchema>;