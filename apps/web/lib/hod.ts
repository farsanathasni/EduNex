import { api } from "./axios";

export interface HodDashboard {
  
  [key: string]: unknown;
}

export const getHodDashboard = async () => {
  const response = await api.get("/hod/dashboard");
  return response.data;
};