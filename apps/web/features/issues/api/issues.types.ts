export type IssueCategory = "academic" | "facility" | "technical" | "other";

export type IssueStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "rejected";

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
