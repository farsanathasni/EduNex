import z from "zod";


export const studentProfileSchema =z.object({
    admissionNumber:z
    .string().trim()
    .min(1, "Admission number is required.")
    .max(30, "Admission number must be at most 30 characters.")
    .regex(/^[a-zA-Z0-9/-]+$/,"Use only letters, numbers, hyphens, and slashes."),

    departmentId:z
    .string().min(1, "Please select a department.")
    .regex(/^[1-9]\d*$/, "Please select a valid department."),

    semester:z
    .string()
    .regex( /^[6-9]\d{9}$/,"Enter a valid 10-digit Indian mobile number."),

    phone:z
    .string().trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),

})


export type StudentProfileFormValues=z.infer<typeof studentProfileSchema >