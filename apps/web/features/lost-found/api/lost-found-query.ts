import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

import type {
  AuditEventItem,
  ClaimDecisionInput,
  ClaimView,
  ClaimWithItem,
  CreateItemInput,
  ItemDetail,
  ItemListParams,
  ItemListResult,
  Pagination,
  SubmitClaimInput,
  UpdateItemInput,
} from "./lost-found.types";

export type {
  AnswerMatch,
  AuditEventItem,
  ClaimAnswer,
  ClaimReview,
  ClaimView,
  ClaimWithItem,
  CreateItemInput,
  ExpectedAnswer,
  ItemDetail,
  ItemListItem,
  ItemListResult,
  ItemListParams,
  ItemSummary,
  LostFoundCategory,
  LostFoundClaimStatus,
  LostFoundPhoto,
  LostFoundStatus,
  Pagination,
  SubmitClaimInput,
  UpdateItemInput,
  VerificationQuestionView,
} from "./lost-found.types";
export {
  LOST_FOUND_CATEGORIES,
  LOST_FOUND_STATUSES,
} from "./lost-found.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface AuditResult {
  events: AuditEventItem[];
  pagination: Pagination;
}

export const lostFoundApi = {
  list: async (params: ItemListParams): Promise<ItemListResult> => {
    const response = await api.get<ApiResponse<ItemListResult>>(
      "/lost-found",
      { params },
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<ItemDetail> => {
    const response = await api.get<ApiResponse<ItemDetail>>(
      `/lost-found/${id}`,
    );
    return response.data.data;
  },

  create: async (input: CreateItemInput): Promise<ItemDetail> => {
    const body = new FormData();

    body.append("title", input.title);
    body.append("description", input.description);
    body.append("category", input.category);
    body.append("place", input.place);
    body.append("dateFound", input.dateFound);
    body.append("questions", JSON.stringify(input.questions));
    body.append("answers", JSON.stringify(input.answers));
    for (const photo of input.photos) body.append("photos", photo);

    const response = await api.post<ApiResponse<ItemDetail>>(
      "/lost-found",
      body,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data.data;
  },

  update: async (id: number, input: UpdateItemInput): Promise<ItemDetail> => {
    const response = await api.patch<ApiResponse<ItemDetail>>(
      `/lost-found/${id}`,
      input,
    );
    return response.data.data;
  },

  submitClaim: async (
    id: number,
    input: SubmitClaimInput,
  ): Promise<ClaimView> => {
    const response = await api.post<ApiResponse<ClaimView>>(
      `/lost-found/${id}/claims`,
      input,
    );
    return response.data.data;
  },

  myClaims: async (): Promise<ClaimWithItem[]> => {
    const response = await api.get<ApiResponse<ClaimWithItem[]>>(
      "/lost-found/my-claims",
    );
    return response.data.data;
  },

  decideClaim: async (
    id: number,
    input: ClaimDecisionInput,
  ): Promise<ClaimView> => {
    const response = await api.post<ApiResponse<ClaimView>>(
      `/lost-found/claims/${id}/decide`,
      input,
    );
    return response.data.data;
  },

  withdrawClaim: async (id: number): Promise<ClaimView> => {
    const response = await api.delete<ApiResponse<ClaimView>>(
      `/lost-found/claims/${id}`,
    );
    return response.data.data;
  },

  markReturned: async (id: number): Promise<ItemDetail> => {
    const response = await api.post<ApiResponse<ItemDetail>>(
      `/lost-found/${id}/return`,
    );
    return response.data.data;
  },

  confirmReceipt: async (id: number): Promise<ItemDetail> => {
    const response = await api.post<ApiResponse<ItemDetail>>(
      `/lost-found/${id}/receipt`,
    );
    return response.data.data;
  },

  audit: async (params: {
    page: number;
    limit: number;
  }): Promise<AuditResult> => {
    const response = await api.get<ApiResponse<AuditResult>>(
      "/lost-found/audit",
      { params },
    );
    return response.data.data;
  },
};

export const lostFoundKeys = {
  all: ["lost-found"] as const,
  lists: () => [...lostFoundKeys.all, "list"] as const,
  list: (params: ItemListParams) => [...lostFoundKeys.lists(), params] as const,
  details: () => [...lostFoundKeys.all, "detail"] as const,
  detail: (id: number) => [...lostFoundKeys.details(), id] as const,
  myClaims: () => [...lostFoundKeys.all, "my-claims"] as const,
  audit: (params: { page: number; limit: number }) =>
    [...lostFoundKeys.all, "audit", params] as const,
};

export function useLostFoundItemsQuery(params: ItemListParams) {
  return useQuery({
    queryKey: lostFoundKeys.list(params),
    queryFn: () => lostFoundApi.list(params),
    retry: false,
  });
}

export function useLostFoundItemQuery(id: number) {
  return useQuery({
    queryKey: lostFoundKeys.detail(id),
    queryFn: () => lostFoundApi.getById(id),
    enabled: Number.isFinite(id) && id > 0,
    retry: false,
  });
}

export function useMyClaimsQuery() {
  return useQuery({
    queryKey: lostFoundKeys.myClaims(),
    queryFn: lostFoundApi.myClaims,
    retry: false,
  });
}

export function useLostFoundAuditQuery(params: {
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: lostFoundKeys.audit(params),
    queryFn: () => lostFoundApi.audit(params),
    retry: false,
  });
}

function useInvalidateItem() {
  const queryClient = useQueryClient();

  return (id?: number) => {
    void queryClient.invalidateQueries({ queryKey: lostFoundKeys.lists() });
    void queryClient.invalidateQueries({ queryKey: lostFoundKeys.myClaims() });
    if (id !== undefined) {
      void queryClient.invalidateQueries({
        queryKey: lostFoundKeys.detail(id),
      });
    }
  };
}

export function useCreateLostFoundItemMutation() {
  const invalidate = useInvalidateItem();

  return useMutation({
    mutationFn: lostFoundApi.create,
    onSuccess: (item) => invalidate(item.id),
  });
}

export function useUpdateLostFoundItemMutation() {
  const invalidate = useInvalidateItem();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateItemInput;
    }) => lostFoundApi.update(id, input),
    onSuccess: (item) => invalidate(item.id),
  });
}

export function useSubmitClaimMutation() {
  const invalidate = useInvalidateItem();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: SubmitClaimInput;
    }) => lostFoundApi.submitClaim(id, input),
    onSuccess: (_claim, variables) => invalidate(variables.id),
  });
}

export function useDecideClaimMutation() {
  const invalidate = useInvalidateItem();

  return useMutation({
    mutationFn: ({
      id,
      input,
      itemId,
    }: {
      id: number;
      input: ClaimDecisionInput;
      itemId: number;
    }) => lostFoundApi.decideClaim(id, input),
    onSuccess: (_claim, variables) => invalidate(variables.itemId),
  });
}

export function useWithdrawClaimMutation() {
  const invalidate = useInvalidateItem();

  return useMutation({
    mutationFn: ({ id, itemId }: { id: number; itemId: number }) =>
      lostFoundApi.withdrawClaim(id),
    onSuccess: (_claim, variables) => invalidate(variables.itemId),
  });
}

export function useMarkReturnedMutation() {
  const invalidate = useInvalidateItem();

  return useMutation({
    mutationFn: lostFoundApi.markReturned,
    onSuccess: (item) => invalidate(item.id),
  });
}

export function useConfirmReceiptMutation() {
  const invalidate = useInvalidateItem();

  return useMutation({
    mutationFn: lostFoundApi.confirmReceipt,
    onSuccess: (item) => invalidate(item.id),
  });
}

export function getLostFoundErrorMessage(
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
