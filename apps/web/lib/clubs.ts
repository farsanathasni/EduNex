
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







export const getClubs = async (): Promise<Club[]> => {

    const response = await api.get("/clubs");
    return response.data.data;
 
};


export const createClub=async(data:CreateClubInput,):Promise<Club>=>{
 
    const response=await api.post("/clubs",data)
    return response.data.data
 
}


export const getStudentClubs = async (): Promise<Club[]> => {

    const response = await api.get("/clubs/student");
    return response.data.data;
  
};



export const getStudentClubById =async(clubId:number,):Promise<Club>=>{
  
    const response = await api.get(`/clubs/student/${clubId}`);
    return response.data.data;
  
}


  export const getStudentClubCoordinators  =async(clubId:number):Promise<ClubCoordinator[]>=>{
 
      const response = await api.get(`/clubs/student/${clubId}/coordinators`);
      return response.data.data;
    
  }


  export const getStudentClubEvents = async (
  clubId: number,
): Promise<ClubEvent[]> => {

    const response = await api.get(`/clubs/student/${clubId}/events`);
    return response.data.data;
  
};



export const getStudentClubAnnouncements = async (
  clubId: number
): Promise<ClubAnnouncement[]> => {

    const response = await api.get(
      `/clubs/student/${clubId}/announcements`
    );

    return response.data.data;
 
};



export const createStudentMembershipRequest = async (
  clubId: number,
): Promise<ClubMembershipRequest> => {
  
    const response = await api.post(`/clubs/student/${clubId}/membership`,);
    return response.data.data;

};


export const getMyStudentMembershipRequests = async (): Promise<
  ClubMembershipRequest[]
> => {
 
    const response = await api.get("/clubs/student/my/memberships");
    return response.data.data;
  
};