import { z } from "zod";

export const coordinatorSchema = z.object({
  studentId: z
    .number()
    .int()
    .positive("Please select a student."),

  clubId: z
    .number()
    .int()
    .positive("Please enter a valid club ID."),
});

export type CoordinatorFormInput = z.infer<
  typeof coordinatorSchema
>;