
import axios from "axios";

import { api } from "@/lib/axios";
import {
  CreateClubInput,
  UpdateClubInput,
} from "../validation/club-schema";
import { CoordinatorClubMembersResult, CoordinatorMembershipRequestsResult, ListParams } from "@/features/coordinator/api/coordinators";

export interface Club {
  id: number;
  name: string;
  description: string | null;
  departmentId: number | null;
}

export interface ClubPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ClubListParams {
  search: string;
  page: number;
  limit: number;
}

export interface ClubListResult {
  clubs: Club[];
  pagination: ClubPagination;
}

interface ClubListResponse {
  success: boolean;
  message?: string;
  data: Club[];
  pagination?: ClubPagination;
}

const getApiError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return new Error(error.response?.data?.message || fallback);
  }
  return error instanceof Error ? error : new Error(fallback);
};

export interface ClubMembershipRequest {
  id: number;
  clubId: number;
  clubName: string;
  status: string;
  requestedAt?: string;
  reviewedAt?: string | null;
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


export function getClubs(): Promise<Club[]>;
export function getClubs(params: ClubListParams): Promise<ClubListResult>;
export async function getClubs(
  params?: ClubListParams,
): Promise<Club[] | ClubListResult> {
  try {
    if (params) {
      const response = await api.get<ClubListResponse>("/clubs", {
        params,
      });

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error(
          response.data.message || "Invalid clubs API response.",
        );
      }

      if (!response.data.pagination) {
        throw new Error("Club pagination information is missing.");
      }

      return {
        clubs: response.data.data,
        pagination: response.data.pagination,
      };
    }

    const limit = 100;
    const clubs: Club[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await api.get<ClubListResponse>("/clubs", {
        params: { page, limit },
      });

      if (
        !response.data.success ||
        !Array.isArray(response.data.data)
      ) {
        throw new Error(
          response.data.message || "Invalid clubs API response.",
        );
      }

      clubs.push(...response.data.data);
      totalPages =
        response.data.pagination?.totalPages ??
        (response.data.data.length === limit ? page + 1 : page);
      page += 1;
    } while (page <= totalPages);

    return clubs;
  } catch (error) {
    throw getApiError(error, "Unable to load clubs.");
  }
}


export const createClub=async(data:CreateClubInput,):Promise<Club>=>{
 
    const response=await api.post("/clubs",{
      ...data,
      departmentId: Number(data.departmentId),
    })
    return response.data.data
 
}

export const updateClub = async (
  clubId: number,
  data: UpdateClubInput,
): Promise<Club> => {
  try {
    const response = await api.patch(`/clubs/${clubId}`, data);
    return response.data.data;
  } catch (error) {
    throw getApiError(error, "Unable to update club.");
  }
};

export const deleteClub = async (
  clubId: number,
): Promise<{ id: number }> => {
  try {
    const response = await api.delete(`/clubs/${clubId}`);
    return response.data.data;
  } catch (error) {
    throw getApiError(error, "Unable to delete club.");
  }
};

export const assignClubDepartment = async (
  clubId: number,
  departmentId: number,
): Promise<Club> => {
  const response = await api.patch(`/clubs/${clubId}/department`, {
    departmentId,
  });

  return response.data.data;
};


export const getStudentClubs = async (): Promise<Club[]> => {
  const limit = 100;
  const clubs: Club[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await api.get<{
      data: Club[];
      pagination?: { totalPages: number };
    }>("/clubs/student", { params: { page, limit } });

    clubs.push(...response.data.data);
    totalPages =
      response.data.pagination?.totalPages ??
      (response.data.data.length === limit ? page + 1 : page);
    page += 1;
  } while (page <= totalPages);

  return clubs;
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



export const getCoordinatorMembershipRequests = async (
  params?: ListParams,
): Promise<CoordinatorMembershipRequestsResult> => {
  const response = await api.get("/clubs/coordinator/membership-requests", {
    params,
  });

  return {
    requests: response.data.data as CoordinatorMembershipRequest[],
    pagination: response.data.pagination as ClubPagination,
  };
};


export const getCoordinatorClubMembers = async (params?: ListParams) => {
  const response = await api.get("/clubs/coordinator/members", { params });

  return {
    members: response.data.data as CoordinatorClubMember[],
    pagination: response.data.pagination as ClubPagination,
  };
};


 export const reviewClubMembershipRequest =async(requestId:number,decision:"approved"|"rejected"):Promise<CoordinatorMembershipRequest>=>{
  const response=await api.patch(`/clubs/coordinator/membership-requests/${requestId}`,{ decision },)
  return response.data.data
 }



