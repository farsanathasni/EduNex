import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

import type {
  IssueBox,
  IssueCategory,
  IssueDetail,
  IssueListItem,
  IssuePagination,
  IssueRecipientsResult,
  IssueResponseItem,
  IssueStatus,
} from "./issues.types";

export type {
  IssueBox,
  IssueCategory,
  IssueDetail,
  IssueListItem,
  IssuePagination,
  IssueRecipient,
  IssueRecipientGroup,
  IssueRecipientsResult,
  IssueResponseItem,
  IssueStatus,
} from "./issues.types";

export interface IssueListParams {
  box: IssueBox;
  status?: IssueStatus;
  search?: string;
  page: number;
  limit: number;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  category: IssueCategory;
  recipientId: string;
}

export interface ReplyIssueInput {
  body: string;
  close: boolean;
}

export interface ResolveIssueInput {
  status: "resolved" | "rejected";
  note?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface IssueListResponse {
  issues: IssueListItem[];
  pagination: IssuePagination;
}

interface IssueThreadResponse {
  issue: IssueDetail;
  responses: IssueResponseItem[];
}

export const issuesApi = {
  getRecipients: async (): Promise<IssueRecipientsResult> => {
    const response = await api.get<ApiResponse<IssueRecipientsResult>>(
      "/issues/recipients",
    );
    return response.data.data;
  },

  create: async (input: CreateIssueInput): Promise<IssueDetail> => {
    const response = await api.post<ApiResponse<{ issue: IssueDetail }>>(
      "/issues",
      input,
    );
    return response.data.data.issue;
  },

  list: async (params: IssueListParams): Promise<IssueListResponse> => {
    const response = await api.get<ApiResponse<IssueListResponse>>(
      "/issues",
      { params },
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<IssueThreadResponse> => {
    const response = await api.get<ApiResponse<IssueThreadResponse>>(
      `/issues/${id}`,
    );
    return response.data.data;
  },

  reply: async (
    id: number,
    input: ReplyIssueInput,
  ): Promise<IssueResponseItem> => {
    const response = await api.post<
      ApiResponse<{ response: IssueResponseItem }>
    >(`/issues/${id}/responses`, input);
    return response.data.data.response;
  },

  resolve: async (
    id: number,
    input: ResolveIssueInput,
  ): Promise<IssueDetail> => {
    const response = await api.patch<ApiResponse<{ issue: IssueDetail }>>(
      `/issues/${id}/resolve`,
      input,
    );
    return response.data.data.issue;
  },
};

export const issueKeys = {
  all: ["issues"] as const,
  recipients: () => [...issueKeys.all, "recipients"] as const,
  lists: () => [...issueKeys.all, "list"] as const,
  list: (params: IssueListParams) =>
    [...issueKeys.lists(), params] as const,
  details: () => [...issueKeys.all, "detail"] as const,
  detail: (id: number) => [...issueKeys.details(), id] as const,
};

export function useIssueRecipientsQuery() {
  return useQuery({
    queryKey: issueKeys.recipients(),
    queryFn: issuesApi.getRecipients,
    retry: false,
  });
}

export function useIssuesQuery(params: IssueListParams) {
  return useQuery({
    queryKey: issueKeys.list(params),
    queryFn: () => issuesApi.list(params),
    retry: false,
  });
}

export function useIssueQuery(id: number) {
  return useQuery({
    queryKey: issueKeys.detail(id),
    queryFn: () => issuesApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
    retry: false,
  });
}

export function useCreateIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: issuesApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
  });
}

export function useReplyIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: ReplyIssueInput;
    }) => issuesApi.reply(id, input),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({
        queryKey: issueKeys.detail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
  });
}

export function useResolveIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: ResolveIssueInput;
    }) => issuesApi.resolve(id, input),
    onSuccess: (_issue, variables) => {
      void queryClient.invalidateQueries({
        queryKey: issueKeys.detail(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
    },
  });
}

export function getIssueErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (isAxiosError(error)) {
    const message = (
      error.response?.data as { message?: string } | undefined
    )?.message;

    if (typeof message === "string" && message) return message;
  }

  return error instanceof Error ? error.message : fallback;
}
