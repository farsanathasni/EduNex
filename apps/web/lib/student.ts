

import { api } from "./axios";

export interface StudentProfileInput {
  admissionNumber: string;
  departmentId: string;   // ✅ number → string
  semester: string;       // ✅ number → string
  phone?: string;
};

export interface StudentProfile {
  id: number;
  name: string;
  userId: string;
  admissionNumber: string;
  departmentId: number | null;
  semester: number | null;
  phone: string | null;
}

export const getStudentProfile = async () => {
  const { data } = await api.get("/students/profile");
  return data;
};

export const CreateStudentProfile = async (
  input: StudentProfileInput
) => {
const { data } = await api.post("/students/profile", input);
  return data;
};
