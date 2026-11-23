import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export interface StudentStudyMaterial {
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

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const studentResourcesApi = {
  getMaterials: async (): Promise<StudentStudyMaterial[]> => {
    const response = await api.get<ApiResponse<StudentStudyMaterial[]>>(
      "/resources/study-materials"
    );
    return response.data.data;
  },
};

export const studentResourcesKeys = {
  all: ["student", "resources"] as const,
  materials: () => [...studentResourcesKeys.all, "materials"] as const,
};

export function useStudentMaterialsQuery() {
  return useQuery({
    queryKey: studentResourcesKeys.materials(),
    queryFn: studentResourcesApi.getMaterials,
    retry: false,
  });
}
