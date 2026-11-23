export const LOST_FOUND_CATEGORIES = [
  "bags",
  "electronics",
  "documents",
  "books",
  "clothing",
  "accessories",
  "keys",
  "other",
] as const;

export const LOST_FOUND_STATUSES = [
  "active",
  "claimed",
  "returned",
  "closed",
] as const;

export type LostFoundCategory = (typeof LOST_FOUND_CATEGORIES)[number];
export type LostFoundStatus = (typeof LOST_FOUND_STATUSES)[number];
export type LostFoundClaimStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn";

export interface LostFoundPhoto {
  url: string;
  publicId: string;
  resourceType: string;
  bytes: number;
}

export interface VerificationQuestionView {
  id: string;
  prompt: string;
}

export interface ExpectedAnswer {
  id: string;
  answer: string;
}

export interface ClaimAnswer {
  id: string;
  answer: string;
}

export interface AnswerMatch {
  id: string;
  matches: boolean;
}

export interface ItemSummary {
  id: number;
  title: string;
  category: LostFoundCategory;
  place: string;
  dateFound: string;
  photos: LostFoundPhoto[];
  status: LostFoundStatus;
  finderName: string | null;
}

export interface ItemListItem extends ItemSummary {
  description: string;
  itemType: "found" | "lost";
  claimCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimView {
  id: number;
  itemId: number;
  status: LostFoundClaimStatus;
  answers: ClaimAnswer[];
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimWithItem extends ClaimView {
  item: ItemSummary;
}

export interface ClaimReview extends ClaimView {
  claimantName: string | null;
  matches: AnswerMatch[];
}

export interface AuditEventItem {
  id: number;
  itemId: number;
  claimId: number | null;
  actorUserId: string | null;
  actorName: string | null;
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
  itemTitle?: string;
}

export interface ItemDetail extends ItemListItem {
  finderUserId: string;
  isFinder: boolean;
  canReview: boolean;
  verificationQuestions: VerificationQuestionView[];
  expectedAnswers: ExpectedAnswer[] | null;
  myClaim: ClaimView | null;
  claims: ClaimReview[] | null;
  audit: AuditEventItem[] | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ItemListResult {
  items: ItemListItem[];
  pagination: Pagination;
}

export interface ItemListParams {
  search?: string;
  category?: LostFoundCategory;
  status?: LostFoundStatus;
  mine?: boolean;
  page: number;
  limit: number;
}

export interface CreateItemInput {
  title: string;
  description: string;
  category: LostFoundCategory;
  place: string;
  dateFound: string;
  questions: Array<{ prompt: string; answer: string }>;
  answers: Array<{ id: string; answer: string }>;
  photos: File[];
}

export interface UpdateItemInput {
  title?: string;
  description?: string;
  category?: LostFoundCategory;
  place?: string;
  dateFound?: string;
  close?: boolean;
}

export interface SubmitClaimInput {
  answers: ClaimAnswer[];
}

export interface ClaimDecisionInput {
  decision: "approved" | "rejected";
  note?: string;
}
