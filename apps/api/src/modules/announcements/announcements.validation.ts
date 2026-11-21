
import { z } from "zod";

export const announcementsQuerySchema = z.object({
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

export const createAnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Announcement title must contain at least 3 characters.")
    .max(200, "Announcement title cannot exceed 200 characters."),

  content: z
    .string()
    .trim()
    .min(1, "Announcement content is required.")
    .max(10000, "Announcement content cannot exceed 10000 characters."),

    audience: z.enum(["campus", "department", "club"], {
    message: "Invalid announcement audience.",
  }),

  departmentId: z.coerce
    .number()
    .int("Department ID must be an integer.")
    .positive("Invalid department ID.")
    .optional(),

  clubId: z.coerce
    .number()
    .int("Club ID must be an integer.")
    .positive("Invalid club ID.")
    .optional(),
});

export const updateAnnouncementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Announcement title must contain at least 3 characters.")
    .max(200, "Announcement title cannot exceed 200 characters.")
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Announcement content is required.")
    .max(10000, "Announcement content cannot exceed 10000 characters.")
    .optional(),
})
  .strict()
  .refine(
    (data) => data.title !== undefined || data.content !== undefined,
    {
      message: "At least one field must be provided.",
    },
  );

export type AnnouncementsQuery = z.infer<
  typeof announcementsQuerySchema
>;

export type CreateAnnouncement = z.infer<
  typeof createAnnouncementSchema
>;

export type UpdateAnnouncement = z.infer<
  typeof updateAnnouncementSchema
>;
