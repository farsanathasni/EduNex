import {
  getDepartments,
  getHodDashboard,
  getHodStudents,
  updateStudent,
  deleteStudent,
  type UpdateStudentData
} from "@/lib/hod";
import { useMutation ,useQuery, useQueryClient } from "@tanstack/react-query";

export const useHodDashboard = () => {
  return useQuery({
    queryKey: ["hod", "dashboard"],
    queryFn: getHodDashboard,
    retry: false,
  });
};

export const useHodDepartments = (enabled = true) => {
  return useQuery({
    queryKey: ["hod", "departments"],
    queryFn: getDepartments,
    enabled,
    retry: false,
  });
};

export const useHodStudents = (
  departmentId?: number,
  semester?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "hod",
      "students",
      departmentId ?? "all",
      semester ?? "all",
    ],
    queryFn: () => getHodStudents(departmentId, semester),
    enabled,
    retry: false,
  });
};


export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: number;
      data: UpdateStudentData;
    }) => updateStudent(studentId, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["hod", "students"],
      });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: number) =>
      deleteStudent(studentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["hod", "students"],
      });
    },
  });
};
