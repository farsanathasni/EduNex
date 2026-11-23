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

export const LOST_FOUND_ITEM_TYPES = ["found", "lost"] as const;
export const LOST_FOUND_STATUSES = [
  "active",
  "claimed",
  "returned",
  "closed",
] as const;
export const LOST_FOUND_CLAIM_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
] as const;

export type LostFoundCategory = (typeof LOST_FOUND_CATEGORIES)[number];
export type LostFoundItemType = (typeof LOST_FOUND_ITEM_TYPES)[number];
export type LostFoundStatus = (typeof LOST_FOUND_STATUSES)[number];
export type LostFoundClaimStatus = (typeof LOST_FOUND_CLAIM_STATUSES)[number];

export interface LostFoundPhoto {
  url: string;
  publicId: string;
  resourceType: string;
  bytes: number;
}

export interface VerificationQuestionInput {
  prompt: string;
  answer: string;
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
  itemType: LostFoundItemType;
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

export interface ListItemsResult {
  items: ItemListItem[];
  pagination: Pagination;
}

export interface ListItemsParams {
  viewerId: string;
  search?: string;
  category?: LostFoundCategory;
  status?: LostFoundStatus;
  mine: boolean;
  page: number;
  limit: number;
}

export interface CreateItemParams {
  viewerId: string;
  title: string;
  description: string;
  category: LostFoundCategory;
  place: string;
  dateFound: string;
  questions: VerificationQuestionInput[];
  photos: LostFoundPhoto[];
}

export interface UpdateItemParams {
  itemId: number;
  viewerId: string;
  title?: string;
  description?: string;
  category?: LostFoundCategory;
  place?: string;
  dateFound?: string;
  close?: boolean;
}

export interface SubmitClaimParams {
  itemId: number;
  viewerId: string;
  answers: ClaimAnswer[];
}

export interface DecideClaimParams {
  claimId: number;
  viewerId: string;
  decision: "approved" | "rejected";
  note?: string;
}

export interface ListAuditParams {
  viewerId: string;
  page: number;
  limit: number;
}
