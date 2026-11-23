import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  notInArray,
  or,
} from "drizzle-orm";

import { db } from "../../config/database.js";
import { user } from "../../db/schema/auth-schema.js";
import {
  departments,
  issues,
  issueResponses,
} from "../../db/schema/others-schema.js";
import { roles, userRoles } from "../../db/schema/rbac-schema.js";
import { staff } from "../../db/schema/staff-schema.js";
import { StudentProfile } from "../../db/schema/student-profile.js";
import { notifyUser } from "../../lib/notify.js";
import { can, loadAccess, SUPER_ADMIN_SLUG } from "../rbac/rbac.access.js";

import type {
  AddIssueResponseParams,
  CreateIssueParams,
  IssueBox,
  IssueDetail,
  IssueListItem,
  IssueRecipientsResult,
  IssueResponseItem,
  IssueStatus,
  ListIssuesParams,
  ListIssuesResult,
  ResolveIssueParams,
} from "./issues.types.js";

type IssueRow = typeof issues.$inferSelect;
type IssueResponseRow = typeof issueResponses.$inferSelect;

const CLOSED_STATUSES: IssueStatus[] = ["resolved", "rejected"];

const fail = (code: string): never => {
  throw new Error(code);
};

const safeNotify = async (
  userId: string | null,
  payload: Parameters<typeof notifyUser>[1],
): Promise<void> => {
  if (!userId) return;

  try {
    await notifyUser(userId, payload);
  } catch (error) {
    console.error("[issues] notification failed", error);
  }
};

const hasSenderProfile = async (userId: string): Promise<boolean> => {
  const [staffRow] = await db
    .select({ userId: staff.userId })
    .from(staff)
    .where(and(eq(staff.userId, userId), eq(staff.isActive, true)))
    .limit(1);

  if (staffRow) return true;

  const [studentRow] = await db
    .select({ userId: StudentProfile.userId })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.userId, userId),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .limit(1);

  return !!studentRow;
};

const getNameMap = async (
  ids: Array<string | null>,
): Promise<Map<string, string>> => {
  const uniqueIds = [...new Set(ids.filter((id): id is string => !!id))];

  if (uniqueIds.length === 0) return new Map();

  const rows = await db
    .select({ id: user.id, name: user.name })
    .from(user)
    .where(inArray(user.id, uniqueIds));

  return new Map(rows.map((row) => [row.id, row.name]));
};

const getSenderDepartmentId = async (
  userId: string,
): Promise<number | null> => {
  const [staffRow] = await db
    .select({ departmentId: staff.departmentId })
    .from(staff)
    .where(and(eq(staff.userId, userId), eq(staff.isActive, true)))
    .limit(1);

  if (staffRow?.departmentId != null) return staffRow.departmentId;

  const [studentRow] = await db
    .select({ departmentId: StudentProfile.departmentId })
    .from(StudentProfile)
    .where(
      and(
        eq(StudentProfile.userId, userId),
        eq(StudentProfile.isDeleted, false),
      ),
    )
    .limit(1);

  return studentRow?.departmentId ?? null;
};

const getAllowedRecipients = async (
  userId: string,
  departmentId: number | null,
): Promise<IssueRecipientsResult> => {
  const groups: IssueRecipientsResult = {
    hod: [],
    faculty: [],
    principal: [],
  };

  if (departmentId != null) {
    const staffRows = await db
      .select({
        id: user.id,
        name: user.name,
        role: staff.role,
      })
      .from(staff)
      .innerJoin(user, eq(staff.userId, user.id))
      .where(
        and(
          eq(staff.isActive, true),
          eq(staff.departmentId, departmentId),
        ),
      );

    for (const row of staffRows) {
      if (row.id === userId) continue;
      if (row.role !== "hod" && row.role !== "faculty") continue;

      groups[row.role].push({ id: row.id, name: row.name, role: row.role });
    }
  }

  const principalRows = await db
    .select({ id: user.id, name: user.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .innerJoin(user, eq(userRoles.userId, user.id))
    .innerJoin(staff, eq(staff.userId, userRoles.userId))
    .where(and(eq(staff.isActive, true), eq(roles.slug, SUPER_ADMIN_SLUG)));

  const seen = new Set<string>();

  for (const row of principalRows) {
    if (row.id === userId || seen.has(row.id)) continue;

    seen.add(row.id);
    groups.principal.push({
      id: row.id,
      name: row.name,
      role: "principal",
    });
  }

  return groups;
};

const findAllowedRecipient = (
  groups: IssueRecipientsResult,
  recipientId: string,
) => [...groups.hod, ...groups.faculty, ...groups.principal].find(
  (recipient) => recipient.id === recipientId,
);

const buildListItem = (
  row: IssueRow,
  viewerId: string,
  names: Map<string, string>,
): IssueListItem => {
  const isSender = row.reportedBy === viewerId;
  const isRecipient = row.assignedTo === viewerId;
  const counterpartyId = isSender ? row.assignedTo : row.reportedBy;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status as IssueStatus,
    departmentId: row.departmentId,
    counterpartyName: counterpartyId ? names.get(counterpartyId) ?? null : null,
    senderName: names.get(row.reportedBy) ?? null,
    recipientName: row.assignedTo ? names.get(row.assignedTo) ?? null : null,
    isSender,
    isRecipient,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    resolvedAt: row.resolvedAt,
  };
};

const buildDetail = (
  row: IssueRow,
  viewerId: string,
  names: Map<string, string>,
): IssueDetail => ({
  ...buildListItem(row, viewerId, names),
  response: row.response,
  resolvedBy: row.resolvedBy,
});

const buildResponseItem = (
  row: IssueResponseRow,
  names: Map<string, string>,
): IssueResponseItem => ({
  id: row.id,
  issueId: row.issueId,
  authorId: row.authorId,
  authorName: names.get(row.authorId) ?? null,
  body: row.body,
  createdAt: row.createdAt,
});

const loadVisibleIssue = async (
  issueId: number,
  viewerId: string,
): Promise<IssueRow> => {
  const [row] = await db
    .select()
    .from(issues)
    .where(eq(issues.id, issueId))
    .limit(1);

  if (!row) fail("ISSUE_NOT_FOUND");

  if (row.reportedBy !== viewerId && row.assignedTo !== viewerId) {
    fail("ISSUE_NOT_FOUND");
  }

  return row;
};

const loadIssueDetail = async (
  issueId: number,
  viewerId: string,
): Promise<IssueDetail> => {
  const row = await loadVisibleIssue(issueId, viewerId);
  const names = await getNameMap([row.reportedBy, row.assignedTo]);

  return buildDetail(row, viewerId, names);
};

export const getIssueRecipients = async (
  userId: string,
): Promise<IssueRecipientsResult> => {
  const departmentId = await getSenderDepartmentId(userId);
  return getAllowedRecipients(userId, departmentId);
};

export const createIssue = async ({
  viewerId,
  title,
  description,
  category,
  recipientId,
}: CreateIssueParams): Promise<IssueDetail> => {
  const access = await loadAccess(viewerId);

  if (!access) return fail("UNAUTHORIZED");

  if (access.isSuperAdmin || !(await hasSenderProfile(viewerId))) {
    fail("ISSUE_SENDER_NOT_ALLOWED");
  }

  const departmentId = await getSenderDepartmentId(viewerId);
  const groups = await getAllowedRecipients(viewerId, departmentId);

  if (!findAllowedRecipient(groups, recipientId)) {
    fail("ISSUE_RECIPIENT_INVALID");
  }

  const [created] = await db
    .insert(issues)
    .values({
      title,
      description,
      category,
      status: "open",
      reportedBy: viewerId,
      assignedTo: recipientId,
      departmentId,
    })
    .returning();

  await safeNotify(recipientId, {
    title: "New issue assigned to you",
    message: `A new issue was raised: ${created.title}`,
    notificationType: "issue_created",
    referenceType: "issue",
    referenceId: created.id,
  });

  return loadIssueDetail(created.id, viewerId);
};

export const listIssues = async ({
  viewerId,
  box,
  status,
  search,
  page,
  limit,
}: ListIssuesParams): Promise<ListIssuesResult> => {
  const access = await loadAccess(viewerId);

  if (!access) return fail("UNAUTHORIZED");

  const canCreate = can(access, "issue", "create");
  const canRespond = can(access, "issue", "respond");
  const effectiveBox: IssueBox = access.isSuperAdmin
    ? "received"
    : !canRespond
      ? "sent"
      : !canCreate
        ? "received"
        : box;

  const conditions = [
    effectiveBox === "sent"
      ? eq(issues.reportedBy, viewerId)
      : eq(issues.assignedTo, viewerId),
  ];

  if (status) conditions.push(eq(issues.status, status));

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      or(ilike(issues.title, pattern), ilike(issues.description, pattern))!,
    );
  }

  const where = and(...conditions);
  const offset = (page - 1) * limit;

  const [rows, totalResult] = await Promise.all([
    db
      .select()
      .from(issues)
      .where(where)
      .orderBy(desc(issues.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(issues).where(where),
  ]);

  const names = await getNameMap(
    rows.flatMap((row) => [row.reportedBy, row.assignedTo]),
  );

  const total = totalResult[0]?.total ?? 0;

  return {
    issues: rows.map((row) => buildListItem(row, viewerId, names)),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getIssueById = async (
  issueId: number,
  viewerId: string,
): Promise<{ issue: IssueDetail; responses: IssueResponseItem[] }> => {
  const row = await loadVisibleIssue(issueId, viewerId);
  const responseRows = await db
    .select()
    .from(issueResponses)
    .where(eq(issueResponses.issueId, issueId))
    .orderBy(asc(issueResponses.createdAt));

  const names = await getNameMap([
    row.reportedBy,
    row.assignedTo,
    ...responseRows.map((response) => response.authorId),
  ]);

  return {
    issue: buildDetail(row, viewerId, names),
    responses: responseRows.map((response) =>
      buildResponseItem(response, names),
    ),
  };
};

export const addIssueResponse = async ({
  issueId,
  viewerId,
  body,
  close,
}: AddIssueResponseParams): Promise<{
  response: IssueResponseItem;
  issue: IssueDetail;
}> => {
  const issue = await loadVisibleIssue(issueId, viewerId);

  if (close === true) {
    fail("ISSUE_RESOLUTION_FORBIDDEN");
  }

  const isSender = issue.reportedBy === viewerId;
  const isRecipient = issue.assignedTo === viewerId;
  const otherPartyId = isSender ? issue.assignedTo : issue.reportedBy;
  const nextStatus: IssueStatus =
    isRecipient && !isSender && issue.status === "open"
      ? "in_progress"
      : (issue.status as IssueStatus);
  const now = new Date().toISOString();

  const saved = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(issues)
      .set({ status: nextStatus, updatedAt: now })
      .where(
        and(
          eq(issues.id, issueId),
          notInArray(issues.status, CLOSED_STATUSES),
        ),
      )
      .returning();

    if (!updated) fail("ISSUE_CLOSED");

    const [response] = await tx
      .insert(issueResponses)
      .values({ issueId, authorId: viewerId, body, createdAt: now })
      .returning();

    return response;
  });

  await safeNotify(otherPartyId, {
    title: "New reply on an issue",
    message: `A new reply was added to: ${issue.title}`,
    notificationType: "issue_replied",
    referenceType: "issue",
    referenceId: issueId,
  });

  const names = await getNameMap([viewerId]);

  return {
    response: buildResponseItem(saved, names),
    issue: await loadIssueDetail(issueId, viewerId),
  };
};

export const resolveIssue = async ({
  issueId,
  viewerId,
  status,
  note,
}: ResolveIssueParams): Promise<IssueDetail> => {
  const issue = await loadVisibleIssue(issueId, viewerId);

  if (issue.assignedTo !== viewerId) {
    fail("ISSUE_RESOLUTION_FORBIDDEN");
  }

  const now = new Date().toISOString();

  await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(issues)
      .set({
        status,
        resolvedBy: viewerId,
        resolvedAt: now,
        response: note ?? null,
        updatedAt: now,
      })
      .where(
        and(
          eq(issues.id, issueId),
          eq(issues.assignedTo, viewerId),
          notInArray(issues.status, CLOSED_STATUSES),
        ),
      )
      .returning();

    if (!updated) fail("ISSUE_CLOSED");

    if (note) {
      await tx.insert(issueResponses).values({
        issueId,
        authorId: viewerId,
        body: note,
        createdAt: now,
      });
    }
  });

  await safeNotify(issue.reportedBy, {
    title: status === "resolved" ? "Issue resolved" : "Issue rejected",
    message: `Your issue was ${status}: ${issue.title}`,
    notificationType: status === "resolved" ? "issue_resolved" : "issue_rejected",
    referenceType: "issue",
    referenceId: issueId,
  });

  return loadIssueDetail(issueId, viewerId);
};
