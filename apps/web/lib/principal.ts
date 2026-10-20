
import { api } from "./axios";

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
