
import { api } from "@/lib/axios";
import { CreateClubInput } from "../validation/club-schema";

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



export interface CoordinatorMembershipRequest {
  requestId: number;
  clubId: number;
  clubName: string;
  status: string;
  requestedAt: string;
  studentId: number;
  studentName: string;
  admissionNumber: string;
  email: string;
  phone: string | null;
  semester: number;
  departmentId: number;
  departmentName: string;
  departmentCode: string;
}


export interface CoordinatorClubMember {
  clubId: number;
  clubName: string;
  studentId: number;
  studentName: string;
  admissionNumber: string;
  email: string;
  phone: string | null;
  semester: number;
  departmentName: string;
  departmentCode: string;
  status: "approved" | "rejected";
  joinedAt: string | null;
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



export const getCoordinatorMembershipRequests =async():Promise<CoordinatorMembershipRequest[]>=>{
  const  response=await api.get("/clubs/coordinator/membership-requests",)
  return response.data.data
 }


 export const reviewClubMembershipRequest =async(requestId:number,decision:"approved"|"rejected"):Promise<CoordinatorMembershipRequest>=>{
  const response=await api.patch(`/clubs/coordinator/membership-requests/${requestId}`,{ decision },)
  return response.data.data
 }


 export const getCoordinatorClubMembers = async (): Promise<
  CoordinatorClubMember[]
> => {
  const response = await api.get("/clubs/coordinator/members");
  return response.data.data;
};