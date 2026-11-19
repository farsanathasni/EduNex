import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  assignSubjectFaculty,
  createSubject,
  deleteSubject,
  getAvailableFaculty,
  getSubjectFaculty,
  getSubjects,
  removeSubjectFaculty,
  updateSubject,
  type FacultyListParams,
  type SubjectInput,
  type SubjectListParams,
} from "./subjects";

export const subjectKeys = {
  all: ["subjects"] as const,
  lists: () => [...subjectKeys.all, "list"] as const,
  list: (params: SubjectListParams) => [...subjectKeys.lists(), params] as const,
  faculties: () => [...subjectKeys.all, "faculty"] as const,
  faculty: (subjectId: number, params: FacultyListParams) =>
    [...subjectKeys.faculties(), "assigned", subjectId, params] as const,
  available: (subjectId: number, params: FacultyListParams) =>
    [...subjectKeys.faculties(), "available", subjectId, params] as const,
};

export const useSubjectsQuery = (params: SubjectListParams, enabled = true) =>
  useQuery({
    queryKey: subjectKeys.list(params),
    queryFn: () => getSubjects(params),
    enabled,
    retry: false,
    placeholderData: (prev) => prev,
  });

export const useCreateSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubjectInput) => createSubject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
};

export const useUpdateSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<SubjectInput> }) =>
      updateSubject(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
};

export const useDeleteSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
};

export const useSubjectFacultyQuery = (
  subjectId: number | null,
  params: FacultyListParams,
  enabled = true,
) =>
  useQuery({
    queryKey:
      subjectId !== null
        ? subjectKeys.faculty(subjectId, params)
        : [...subjectKeys.faculties(), "idle"],
    queryFn: () => getSubjectFaculty(subjectId!, params),
    enabled: enabled && subjectId !== null,
    retry: false,
    placeholderData: (prev) => prev,
  });

export const useAvailableFacultyQuery = (
  subjectId: number | null,
  params: FacultyListParams,
  enabled = true,
) =>
  useQuery({
    queryKey:
      subjectId !== null
        ? subjectKeys.available(subjectId, params)
        : [...subjectKeys.faculties(), "available", "idle"],
    queryFn: () => getAvailableFaculty(subjectId!, params),
    enabled: enabled && subjectId !== null,
    retry: false,
    placeholderData: (prev) => prev,
  });

export const useAssignSubjectFacultyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, staffId }: { subjectId: number; staffId: string }) =>
      assignSubjectFaculty(subjectId, staffId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...subjectKeys.faculties(), "assigned", variables.subjectId],
      });
      queryClient.invalidateQueries({
        queryKey: [...subjectKeys.faculties(), "available", variables.subjectId],
      });
    },
  });
};

export const useRemoveSubjectFacultyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, staffId }: { subjectId: number; staffId: string }) =>
      removeSubjectFaculty(subjectId, staffId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...subjectKeys.faculties(), "assigned", variables.subjectId],
      });
      queryClient.invalidateQueries({
        queryKey: [...subjectKeys.faculties(), "available", variables.subjectId],
      });
    },
  });
};
