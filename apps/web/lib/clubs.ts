
import axios from "axios";
import { api } from "./axios";
import type { CreateClubInput } from "@/validation/club-schema";

export interface Club {
  id: number;
  name: string;
  description: string | null;
  departmentId: number | null;
}

export interface ClubMembershipRequest {
  id:number,
  clubId:number,
  status:string,
  club?:Club
}

export interface ClubEvent{
  id:number,
  title: string;
  description?: string | null;
  startDate?: string;
  date?: string;
}

export interface ClubAnnouncement {
  id: number;
  title: string;
  content?: string;
  message?: string;
  createdAt?: string;
}

export interface ClubCoordinator {
  id: number;
  name: string;
  email?: string;
}

const logApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error("Request URL:", error.config?.baseURL, error.config?.url);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
  }
};





export const getClubs = async (): Promise<Club[]> => {
  try {
    const response = await api.get("/");
    return response.data.data;
  } 
  catch (error) {
    logApiError(error);
    throw error;
  }
};


export const createClub=async(data:CreateClubInput,):Promise<Club>=>{
  try{
    const response=await api.post("/",data)
    return response.data.data
  }
catch (error) {
    logApiError(error);
    throw error;
  }
}


export const getStudentClubs = async (): Promise<Club[]> => {
  try {
    const response = await api.get("/student");
    return response.data.data;
  } catch (error) {
    logApiError(error);
    throw error;
  }
};



export const getStudentClubById =async(clubId:number,):Promise<Club>=>{
  try{
    const response = await api.get(`/student/${clubId}`);
    return response.data.data;
  }
  catch(error){
    logApiError(error);
    throw error;
  }
}


  export const getStudentClubCoordinators  =async(clubId:number):Promise<ClubCoordinator[]>=>{
    try{
      const response = await api.get(`/student/${clubId}/coordinators`);
      return response.data.data;
    }
    catch (error) {
    logApiError(error);
    throw error;
  }
  }


  export const getStudentClubEvents = async (
  clubId: number,
): Promise<ClubEvent[]> => {
  try {
    const response = await api.get(`/student/${clubId}/events`);
    return response.data.data;
  } catch (error) {
    logApiError(error);
    throw error;
  }
};


export const getStudentClubAnnouncements = async (
  clubId: number,
): Promise<ClubAnnouncement[]> => {
  try {
    const response = await api.get(`/student/${clubId}/announcements`,);
    return response.data.data;
  } catch (error) {
    logApiError(error);
    throw error;
  }
};


export const createStudentMembershipRequest = async (
  clubId: number,
): Promise<ClubMembershipRequest> => {
  try {
    const response = await api.post(`/student/${clubId}/membership`,);
    return response.data.data;
  } catch (error) {
    logApiError(error);
    throw error;
  }
};


export const getMyStudentMembershipRequests = async (): Promise<
  ClubMembershipRequest[]
> => {
  try {
    const response = await api.get("/student/my/memberships");
    return response.data.data;
  } catch (error) {
    logApiError(error);
    throw error;
  }
};