
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

export interface TeacherStudentListParams {
  search: string;
  semester?: number;
  page: number;
  limit: number;
}

export interface TeacherStudentListResult {
  students: TeacherStudent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StudyMaterial {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string | null;
  filePublicId: string | null;
  fileResourceType: string | null;
  fileSize: number | null;
  fileName: string | null;
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

type MaterialFields = {
  title?: string;
  description?: string;
  visibility?: "department" | "campus";
  fileType?: string;
};

export type UploadMaterialInput = MaterialFields & {
  title: string;
  visibility: "department" | "campus";
  file: File;
};

export type UpdateMaterialInput = MaterialFields & {
  fileUrl?: string;
  file?: File;
};

type ProgressCallback = (percent: number) => void;

function toMaterialFormData(input: MaterialFields & { file?: File }) {
  const formData = new FormData();

  if (input.file) formData.append("file", input.file);
  if (input.title !== undefined) formData.append("title", input.title);
  if (input.description !== undefined) {
    formData.append("description", input.description);
  }
  if (input.visibility !== undefined) {
    formData.append("visibility", input.visibility);
  }
  if (input.fileType !== undefined) formData.append("fileType", input.fileType);

  return formData;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: TeacherStudentListResult["pagination"];
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

  getStudents: async (
    params: TeacherStudentListParams
  ): Promise<TeacherStudentListResult> => {
    const response = await api.get<PaginatedApiResponse<TeacherStudent[]>>(
      "/teacher/students",
      {
        params: {
          search: params.search,
          page: params.page,
          limit: params.limit,
          ...(params.semester !== undefined
            ? { semester: params.semester }
            : {}),
        },
      }
    );

    return {
      students: response.data.data,
      pagination: response.data.pagination,
    };
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

  uploadMaterial: async (
    input: UploadMaterialInput,
    onProgress?: ProgressCallback
  ) => {
    const response = await api.post<ApiResponse<StudyMaterial>>(
      "/teacher/study-materials/upload",
      toMaterialFormData(input),
      {
        headers: { "Content-Type": undefined },
        timeout: 120000,
        onUploadProgress: (event) => {
          if (event.progress !== undefined) {
            onProgress?.(Math.round(event.progress * 100));
          }
        },
      }
    );
    return response.data.data;
  },

  updateMaterial: async (
    id: number,
    input: UpdateMaterialInput,
    onProgress?: ProgressCallback
  ) => {
    const response = await api.patch<ApiResponse<StudyMaterial>>(
      `/teacher/study-materials/${id}`,
      toMaterialFormData(input),
      {
        headers: { "Content-Type": undefined },
        timeout: 120000,
        onUploadProgress: (event) => {
          if (event.progress !== undefined) {
            onProgress?.(Math.round(event.progress * 100));
          }
        },
      }
    );
    return response.data.data;
  },
};

// Query keys

export const teacherKeys = {
  all: ["teacher"] as const,
  dashboard: () => [...teacherKeys.all, "dashboard"] as const,
  classes: () => [...teacherKeys.all, "classes"] as const,
  students: (params: TeacherStudentListParams) =>
    [...teacherKeys.all, "students", params] as const,
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

export function useTeacherStudentsQuery(
  params: TeacherStudentListParams
) {
  return useQuery({
    queryKey: teacherKeys.students(params),
    queryFn: () => teacherApi.getStudents(params),
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

export function useUploadTeacherMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      onProgress,
    }: {
      input: UploadMaterialInput;
      onProgress?: ProgressCallback;
    }) => teacherApi.uploadMaterial(input, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherKeys.all,
      });
    },
  });
}

export function useUpdateTeacherMaterialMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
      onProgress,
    }: {
      id: number;
      input: UpdateMaterialInput;
      onProgress?: ProgressCallback;
    }) => teacherApi.updateMaterial(id, input, onProgress),
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
