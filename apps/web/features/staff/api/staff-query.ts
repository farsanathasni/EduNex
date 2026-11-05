import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStaff,
  deactivateStaff,
  getStaff,
  updateStaff,
  type CreateStaffInput,
  type StaffListParams,
  type UpdateStaffInput,
} from "@/features/staff/api/staff";

export const useStaff = (params: StaffListParams) =>
  useQuery({
    queryKey: ["staff", params],
    queryFn: () => getStaff(params),
  });

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStaffInput) => createStaff(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useUpdateStaff = (staffId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStaffInput) => updateStaff(staffId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};

export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => deactivateStaff(staffId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
};
