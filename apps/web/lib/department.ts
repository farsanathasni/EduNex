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

    // console.log("1. getDepartment() called");
    // console.log("2. API base URL:", api.defaults.baseURL);
    // console.log("3. Request path:", "/department");
  const response = await api.get("/api/department");

    //  console.log("4. Full request URL:", response.config.url);
    // console.log("5. Response data:", response.data);
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
      // console.error("Status:", error.response?.status);
      // console.error("Response:", error.response?.data);
      // console.error("Department API error:", error.response?.status, error.response?.data);
    }
    throw error;
  }
};