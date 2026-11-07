
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

// Types

export interface Teacher {
  id: string;
  departmentId: number;
  departmentName: string | null;
}

export interface TeacherDashboard {
  teacher: Teacher;
  totalStudents: number;
  totalMaterials: number;
  totalSemesters: number;
}

export interface TeacherClass {
  semester: number;
}

export interface TeacherStudent {
  id: number;
  name: string;
  admissionNumber: string;
  semester: number;
  phone: string | null;
}

export interface StudyMaterial {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string | null;
  visibility: "department" | "campus";
  createdAt: string;
}

export interface CreateMaterialInput {
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  visibility: "department" | "campus";
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API functions

export const teacherApi = {
  getDashboard: async () => {
    const response = await api.get<ApiResponse<TeacherDashboard>>(
      "/teacher/dashboard"
    );
    return response.data.data;
  },

  getClasses: async () => {
    const response = await api.get<ApiResponse<TeacherClass[]>>(
      "/teacher/classes"
    );
    return response.data.data;
  },

  getStudents: async (semester?: number) => {
    const response = await api.get<ApiResponse<TeacherStudent[]>>(
      "/teacher/students",
      {
        params: semester ? { semester } : {},
      }
    );
    return response.data.data;
  },

  getMaterials: async () => {
    const response = await api.get<ApiResponse<StudyMaterial[]>>(
      "/teacher/study-materials"
    );
    return response.data.data;
  },

  createMaterial: async (input: CreateMaterialInput) => {
    const response = await api.post<ApiResponse<StudyMaterial>>(
      "/teacher/study-materials",
      input
    );
    return response.data.data;
  },

  deleteMaterial: async (id: number) => {
    const response = await api.delete<ApiResponse<{ id: number }>>(
      `/teacher/study-materials/${id}`
    );
    return response.data.data;
  },
};

// Query keys

export const teacherKeys = {
  all: ["teacher"] as const,
  dashboard: () => [...teacherKeys.all, "dashboard"] as const,
  classes: () => [...teacherKeys.all, "classes"] as const,
  students: (semester?: number) =>
    [...teacherKeys.all, "students", semester] as const,
  materials: () => [...teacherKeys.all, "materials"] as const,
};

// Queries


export function useTeacherDashboardQuery() {
  return useQuery({
    queryKey: teacherKeys.dashboard(),
    queryFn: teacherApi.getDashboard,
    retry: false,
  });
}

export function useTeacherClassesQuery() {
  return useQuery({
    queryKey: teacherKeys.classes(),
    queryFn: teacherApi.getClasses,
    retry: false,
  });
}

export function useTeacherStudentsQuery(semester?: number) {
  return useQuery({
    queryKey: teacherKeys.students(semester),
    queryFn: () => teacherApi.getStudents(semester),
    retry: false,
  });
}

export function useTeacherMaterialsQuery() {
  return useQuery({
    queryKey: teacherKeys.materials(),
    queryFn: teacherApi.getMaterials,
  });
}

// Mutations

export function useCreateTeacherMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.createMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.all,
      });
    },
  });
}

export function useDeleteTeacherMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.all,
      });
    },
  });
}
