export const ISSUE_CATEGORIES = [
  "academic",
  "facility",
  "technical",
  "other",
] as const;

export const ISSUE_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "rejected",
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];
export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssueBox = "sent" | "received";
export type IssueRecipientGroup = "hod" | "faculty" | "principal";

export interface IssueRecipient {
  id: string;
  name: string;
  role: IssueRecipientGroup;
}

export interface IssueRecipientsResult {
  hod: IssueRecipient[];
  faculty: IssueRecipient[];
  principal: IssueRecipient[];
}

export interface IssueListItem {
  id: number;
  title: string;
  description: string;
  category: string | null;
  status: IssueStatus;
  departmentId: number | null;
  counterpartyName: string | null;
  senderName: string | null;
  recipientName: string | null;
  isSender: boolean;
  isRecipient: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface IssueDetail extends IssueListItem {
  response: string | null;
  resolvedBy: string | null;
}

export interface IssueResponseItem {
  id: number;
  issueId: number;
  authorId: string;
  authorName: string | null;
  body: string;
  createdAt: string;
}

export interface IssuePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListIssuesResult {
  issues: IssueListItem[];
  pagination: IssuePagination;
}

export interface ListIssuesParams {
  viewerId: string;
  box: IssueBox;
  status?: IssueStatus;
  search?: string;
  page: number;
  limit: number;
}

export interface CreateIssueParams {
  viewerId: string;
  title: string;
  description: string;
  category: IssueCategory;
  recipientId: string;
}

export interface AddIssueResponseParams {
  issueId: number;
  viewerId: string;
  body: string;
  close: boolean;
}

export interface ResolveIssueParams {
  issueId: number;
  viewerId: string;
  status: "resolved" | "rejected";
  note?: string;
}
