import { CreateStudentProfile, deleteStudent, getStudentById, getStudentProfile, getStudents, updateStudent, type StudentListParams, type StudentProfileInput, type UpdateStudentInput } from "@/features/students/api/student";
import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";

export const StudentProfileKey = ["student-profile"] as const;
export const StudentListKey = ["students", "management"] as const;

export const useStudents = (params: StudentListParams, enabled = true) =>
  useQuery({
    queryKey: [...StudentListKey, params],
    queryFn: () => getStudents(params),
    enabled,
    retry: false,
  });

export const studentDetailKey = (studentId: number) =>
  [...StudentListKey, "detail", studentId] as const;

export const useStudentDetails = (studentId: number, enabled = true) =>
  useQuery({
    queryKey: studentDetailKey(studentId),
    queryFn: () => getStudentById(studentId),
    enabled: enabled && Number.isSafeInteger(studentId) && studentId > 0,
    retry: false,
  });

export const useUpdateStudent = (studentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStudentInput) => updateStudent(studentId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: StudentListKey });
      await queryClient.invalidateQueries({ queryKey: studentDetailKey(studentId) });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: number) => deleteStudent(studentId),
    onSuccess: async (_data, studentId) => {
      await queryClient.invalidateQueries({ queryKey: StudentListKey });
      await queryClient.invalidateQueries({ queryKey: studentDetailKey(studentId) });
    },
  });
};


export const useStudentProfile = () => {
  return useQuery({
    queryKey: StudentProfileKey,
    queryFn: getStudentProfile,

    retry: (failureCount, error: any) => {
      const status = error.response?.status;
      if (status === 401 || status === 404) {
        return false;
      }

      return failureCount < 2;
    },
  });
};

export const useCreateStudentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudentProfileInput) =>
      CreateStudentProfile(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: StudentProfileKey,
      });
    },
  });
};
