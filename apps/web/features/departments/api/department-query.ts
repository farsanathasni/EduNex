import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDepartments,
  deleteDepartment,
  getDepartment,
  updateDepartment,
  type DepartmentInput,
  type DepartmentListParams,
} from "@/features/departments/api/department";

export const DepartmentKey = ["departments"] as const;
export const DepartmentListKey = [...DepartmentKey, "list"] as const;

// Used by department selectors throughout the app. The endpoint caps a page
// at 100 records, so fetch its largest supported page for selector options.
export const useDepartment = (enabled = true) =>
  useQuery({
    queryKey: DepartmentKey,
    queryFn: () => getDepartment(),
    enabled,
    retry: 1,
  });

export const useDepartmentList = (params: DepartmentListParams) =>
  useQuery({
    queryKey: [...DepartmentListKey, params],
    queryFn: () => getDepartment(params),
    retry: false,
  });

const useInvalidateDepartments = () => {
  const queryClient = useQueryClient();
  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: DepartmentKey }),
      queryClient.invalidateQueries({ queryKey: DepartmentListKey }),
    ]);
  };
};

export const useCreateDepartments = () => {
  const invalidateDepartments = useInvalidateDepartments();
  return useMutation({
    mutationFn: (input: DepartmentInput[]) => createDepartments(input),
    onSuccess: invalidateDepartments,
  });
};

export const useUpdateDepartment = () => {
  const invalidateDepartments = useInvalidateDepartments();
  return useMutation({
    mutationFn: (input: { id: number; data: DepartmentInput }) =>
      updateDepartment(input.id, input.data),
    onSuccess: invalidateDepartments,
  });
};

export const useDeleteDepartment = () => {
  const invalidateDepartments = useInvalidateDepartments();
  return useMutation({
    mutationFn: (id: number) => deleteDepartment(id),
    onSuccess: invalidateDepartments,
  });
};
