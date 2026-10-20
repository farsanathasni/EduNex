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
      console.error("Request URL:", error.config?.baseURL, error.config?.url);
       console.error("Request URL:", error.config?.baseURL, error.config?.url);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    }
    throw error;
  }
};