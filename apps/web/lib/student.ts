
import { api } from "./axios";

export interface StudentProfileInput {
  admissionNumber: string;
  departmentId: number;
  semester: number;
  phone: string | null;
}

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
  const { data } = await api.post("/students/profile", {
    ...input,
    departmentId: Number(input.departmentId),
    semester: Number(input.semester),
  });

  return data;
};
