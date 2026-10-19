import { CreateStudentProfile,getStudentProfile, type StudentProfileInput,} from "@/lib/student";
import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";

export const StudentProfileKey = ["student-profile"] as const;


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
