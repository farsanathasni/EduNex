import axios from "axios";
import { api } from "./axios";

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export const getDepartment = async (): Promise<Department[]> => {
  try {
    const response = await api.get("/department");
    const result = response.data;

    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    throw new Error("Invalid departments API response");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Department API error:", error.response?.status, error.response?.data);
    }
    throw error;
  }
};