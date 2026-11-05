import { api } from "@/lib/axios"

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface UserRole {
  id: number;
  name: string;
  slug: string;
}

export interface StudentProfile {
  id: number;
  departmentId: number;
}

export interface StaffProfile {
  id: number;
  role: string;
  employeeId: string;
  departmentId: number | null;
  designation: string | null;
}

export interface CoordinatedClub {
  id: number;
  name: string;
}

export interface CurrentUserData {
  user: CurrentUser | null;
  roles: UserRole[];
  isSuperAdmin: boolean;
  permissions: string[];
  hasStudentProfile: boolean;
  studentProfile: StudentProfile | null;
  staffProfile: StaffProfile | null;
  coordinatedClubs: CoordinatedClub[];
}

export interface CurrentUserResponse {
  success: boolean;
  data: CurrentUserData;
}

export const getCurrentUser = async (): Promise<CurrentUserData> => {
  const response = await api.get<CurrentUserResponse>("/me");

  return response.data.data;
};