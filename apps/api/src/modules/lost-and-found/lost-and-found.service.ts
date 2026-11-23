import { and, asc, count, desc, eq, ilike, inArray, or } from "drizzle-orm";

import { db } from "../../config/database.js";
import { user } from "../../db/schema/auth-schema.js";
import {
  lostFoundAuditEvents,
  lostFoundClaims,
  lostFoundItems,
  staff,
  StudentProfile,
} from "../../db/schema/index.js";
import { notifyUser } from "../../lib/notify.js";
import { can, loadAccess, type Access } from "../rbac/rbac.access.js";

import type {
  AnswerMatch,
  AuditEventItem,
  ClaimReview,
  ClaimView,
  ClaimWithItem,
  CreateItemParams,
  DecideClaimParams,
  ExpectedAnswer,
  ItemDetail,
  ItemListItem,
  ItemSummary,
  ListAuditParams,
  ListItemsParams,
  ListItemsResult,
  LostFoundPhoto,
  Pagination,
  SubmitClaimParams,
  UpdateItemParams,
  VerificationQuestionInput,
  VerificationQuestionView,
} from "./lost-and-found.types.js";

type ItemRow = typeof lostFoundItems.$inferSelect;
type ClaimRow = typeof lostFoundClaims.$inferSelect;
type AuditRow = typeof lostFoundAuditEvents.$inferSelect;

type Actor = {
  userId: string;
  access: Access;
  canCreate: boolean;
  canClaim: boolean;
  canModerate: boolean;
};

const fail = (code: string): never => {
  throw new Error(code);
};

const loadActor = async (userId: string): Promise<Actor> => {
  const loaded = await loadAccess(userId);

  if (!loaded) throw new Error("UNAUTHORIZED");

  const access = loaded;

  return {
    userId,
    access,
    canCreate: can(access, "lost_found", "create"),
    canClaim: can(access, "lost_found", "claim"),
    canModerate: can(access, "lost_found", "moderate"),
  };
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

const getFinderDepartmentId = async (
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

const canReview = (actor: Actor, item: ItemRow): boolean =>
  actor.canModerate ||
  (actor.canCreate && item.finderUserId === actor.userId);

const normalizeAnswer = (value: string): string =>
  value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

const buildMatches = (
  item: ItemRow,
  answers: ClaimView["answers"],
): AnswerMatch[] =>
  item.expectedAnswers.map((expected) => {
    const given = answers.find((answer) => answer.id === expected.id)?.answer ?? "";
    return {
      id: expected.id,
      matches: normalizeAnswer(given) === normalizeAnswer(expected.answer),
    };
  });

const buildItemSummary = (
  row: ItemRow,
  names: Map<string, string>,
): ItemSummary => ({
  id: row.id,
  title: row.title,
  category: row.category as ItemSummary["category"],
  place: row.place,
  dateFound: row.dateFound,
  photos: row.photos,
  status: row.status as ItemSummary["status"],
  finderName: names.get(row.finderUserId) ?? null,
});

const buildItemListItem = (
  row: ItemRow,
  names: Map<string, string>,
  claimCount: number | null,
): ItemListItem => ({
  ...buildItemSummary(row, names),
  description: row.description,
  itemType: row.itemType as ItemListItem["itemType"],
  claimCount,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const buildClaimView = (row: ClaimRow): ClaimView => ({
  id: row.id,
  itemId: row.itemId,
  status: row.status as ClaimView["status"],
  answers: row.answers,
  decisionNote: row.decisionNote,
  decidedAt: row.decidedAt,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const buildClaimReview = (
  row: ClaimRow,
  item: ItemRow,
  names: Map<string, string>,
): ClaimReview => ({
  ...buildClaimView(row),
  claimantName: names.get(row.claimantUserId) ?? null,
  matches: buildMatches(item, row.answers),
});

const buildAuditEvent = (
  row: AuditRow,
  names: Map<string, string>,
  itemTitle?: string,
): AuditEventItem => ({
  id: row.id,
  itemId: row.itemId,
  claimId: row.claimId,
  actorUserId: row.actorUserId,
  actorName: row.actorUserId ? names.get(row.actorUserId) ?? null : null,
  action: row.action,
  details: row.details,
  createdAt: row.createdAt,
  ...(itemTitle === undefined ? {} : { itemTitle }),
});

const loadItem = async (itemId: number): Promise<ItemRow> => {
  const [row] = await db
    .select()
    .from(lostFoundItems)
    .where(eq(lostFoundItems.id, itemId))
    .limit(1);

  if (!row) fail("LOST_FOUND_NOT_FOUND");

  return row;
};

const loadClaim = async (claimId: number): Promise<ClaimRow> => {
  const [row] = await db
    .select()
    .from(lostFoundClaims)
    .where(eq(lostFoundClaims.id, claimId))
    .limit(1);

  if (!row) fail("CLAIM_NOT_FOUND");

  return row;
};

const loadVisibleItem = async (
  itemId: number,
  actor: Actor,
): Promise<ItemRow> => {
  const item = await loadItem(itemId);

  if (canReview(actor, item)) return item;

  const [claim] = await db
    .select({ id: lostFoundClaims.id })
    .from(lostFoundClaims)
    .where(
      and(
        eq(lostFoundClaims.itemId, itemId),
        eq(lostFoundClaims.claimantUserId, actor.userId),
      ),
    )
    .limit(1);

  if (!claim) fail("LOST_FOUND_NOT_FOUND");

  return item;
};

const writeAudit = async ({
  itemId,
  claimId = null,
  actorUserId,
  action,
  details = {},
}: {
  itemId: number;
  claimId?: number | null;
  actorUserId: string | null;
  action: string;
  details?: Record<string, unknown>;
}): Promise<void> => {
  await db.insert(lostFoundAuditEvents).values({
    itemId,
    claimId,
    actorUserId,
    action,
    details,
  });
};

const getClaimCounts = async (itemIds: number[]): Promise<Map<number, number>> => {
  if (itemIds.length === 0) return new Map();

  const rows = await db
    .select({ itemId: lostFoundClaims.itemId, total: count() })
    .from(lostFoundClaims)
    .where(inArray(lostFoundClaims.itemId, itemIds))
    .groupBy(lostFoundClaims.itemId);

  return new Map(rows.map((row) => [row.itemId, row.total]));
};

const loadDetail = async (item: ItemRow, actor: Actor): Promise<ItemDetail> => {
  const reviewer = canReview(actor, item);
  const names = await getNameMap([item.finderUserId]);

  const [myClaimRow, allClaims, allAudit, claimCounts] = await Promise.all([
    db
      .select()
      .from(lostFoundClaims)
      .where(
        and(
          eq(lostFoundClaims.itemId, item.id),
          eq(lostFoundClaims.claimantUserId, actor.userId),
        ),
      )
      .limit(1),
    reviewer
      ? db
          .select()
          .from(lostFoundClaims)
          .where(eq(lostFoundClaims.itemId, item.id))
          .orderBy(desc(lostFoundClaims.createdAt))
      : Promise.resolve([] as ClaimRow[]),
    reviewer
      ? db
          .select()
          .from(lostFoundAuditEvents)
          .where(eq(lostFoundAuditEvents.itemId, item.id))
          .orderBy(asc(lostFoundAuditEvents.createdAt))
      : Promise.resolve([] as AuditRow[]),
    reviewer ? getClaimCounts([item.id]) : Promise.resolve(new Map<number, number>()),
  ]);

  if (reviewer) {
    const extra = await getNameMap([
      ...allClaims.map((row) => row.claimantUserId),
      ...allAudit.map((row) => row.actorUserId),
    ]);

    for (const [id, name] of extra) names.set(id, name);
  }

  const questions: VerificationQuestionView[] = item.verificationQuestions.map(
    (question) => ({ id: question.id, prompt: question.prompt }),
  );

  const expectedAnswers: ExpectedAnswer[] | null = reviewer
    ? item.expectedAnswers
    : null;

  return {
    ...buildItemListItem(
      item,
      names,
      reviewer ? claimCounts.get(item.id) ?? 0 : null,
    ),
    finderUserId: item.finderUserId,
    isFinder: item.finderUserId === actor.userId,
    canReview: reviewer,
    verificationQuestions: questions,
    expectedAnswers,
    myClaim: myClaimRow[0] ? buildClaimView(myClaimRow[0]) : null,
    claims: reviewer
      ? allClaims.map((row) => buildClaimReview(row, item, names))
      : null,
    audit: reviewer
      ? allAudit.map((row) => buildAuditEvent(row, names))
      : null,
  };
};

const buildQuestionSet = (
  questions: VerificationQuestionInput[],
  answers: Array<{ answer: string }>,
): {
  verificationQuestions: VerificationQuestionView[];
  expectedAnswers: ExpectedAnswer[];
} => {
  if (questions.length !== answers.length) fail("CLAIM_ANSWERS_INVALID");

  const verificationQuestions = questions.map((question, index) => ({
    id: `q${index + 1}`,
    prompt: question.prompt,
  }));
  const expectedAnswers = verificationQuestions.map((question, index) => ({
    id: question.id,
    answer: answers[index]?.answer ?? "",
  }));

  return { verificationQuestions, expectedAnswers };
};

const validateClaimAnswers = (
  item: ItemRow,
  answers: Array<{ id: string; answer: string }>,
): void => {
  const questionIds = new Set(item.verificationQuestions.map((q) => q.id));
  const answerIds = answers.map((a) => a.id);

  if (
    answers.length !== questionIds.size ||
    new Set(answerIds).size !== answerIds.length ||
    answerIds.some((id) => !questionIds.has(id))
  ) {
    fail("CLAIM_ANSWERS_INVALID");
  }
};

export const listItems = async ({
  viewerId,
  search,
  category,
  status,
  mine,
  page,
  limit,
}: ListItemsParams): Promise<ListItemsResult> => {
  const actor = await loadActor(viewerId);

  const conditions = [];

  if (mine) conditions.push(eq(lostFoundItems.finderUserId, viewerId));

  if (category) conditions.push(eq(lostFoundItems.category, category));
  if (status) conditions.push(eq(lostFoundItems.status, status));

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      or(
        ilike(lostFoundItems.title, pattern),
        ilike(lostFoundItems.description, pattern),
        ilike(lostFoundItems.place, pattern),
      )!,
    );
  }

  const where = and(...conditions);
  const offset = (page - 1) * limit;

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: lostFoundItems.id,
        finderUserId: lostFoundItems.finderUserId,
        itemType: lostFoundItems.itemType,
        title: lostFoundItems.title,
        description: lostFoundItems.description,
        category: lostFoundItems.category,
        place: lostFoundItems.place,
        dateFound: lostFoundItems.dateFound,
        photos: lostFoundItems.photos,
        status: lostFoundItems.status,
        createdAt: lostFoundItems.createdAt,
        updatedAt: lostFoundItems.updatedAt,
      })
      .from(lostFoundItems)
      .where(where)
      .orderBy(desc(lostFoundItems.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(lostFoundItems).where(where),
  ]);

  const names = await getNameMap(rows.map((row) => row.finderUserId));
  const claimCounts = await getClaimCounts(
    rows
      .filter(
        (row) =>
          actor.canModerate ||
          (actor.canCreate && row.finderUserId === actor.userId),
      )
      .map((row) => row.id),
  );

  const total = totalResult[0]?.total ?? 0;

  return {
    items: rows.map((row) => {
      const reviewer =
        actor.canModerate ||
        (actor.canCreate && row.finderUserId === actor.userId);

      return buildItemListItem(
        row as ItemRow,
        names,
        reviewer ? claimCounts.get(row.id) ?? 0 : null,
      );
    }),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getItemById = async (
  itemId: number,
  viewerId: string,
): Promise<ItemDetail> => {
  const actor = await loadActor(viewerId);
  const item = await loadVisibleItem(itemId, actor);

  return loadDetail(item, actor);
};

export const createItem = async ({
  viewerId,
  title,
  description,
  category,
  place,
  dateFound,
  questions,
  photos,
}: CreateItemParams): Promise<ItemDetail> => {
  const actor = await loadActor(viewerId);

  if (!actor.canCreate) fail("LOST_FOUND_FORBIDDEN");

  if (photos.length < 1) fail("PHOTO_REQUIRED");
  if (photos.length > 3) fail("TOO_MANY_PHOTOS");

  const { verificationQuestions, expectedAnswers } = buildQuestionSet(
    questions,
    questions.map((question) => ({ answer: question.answer })),
  );

  const departmentId = await getFinderDepartmentId(viewerId);

  const [created] = await db
    .insert(lostFoundItems)
    .values({
      finderUserId: viewerId,
      finderDepartmentId: departmentId,
      title,
      description,
      category,
      place,
      dateFound,
      photos: photos as LostFoundPhoto[],
      status: "active",
      verificationQuestions,
      expectedAnswers,
    })
    .returning();

  await writeAudit({
    itemId: created.id,
    actorUserId: viewerId,
    action: "posted",
    details: { category, itemType: "found" },
  });

  return loadDetail(created, actor);
};

export const updateItem = async ({
  itemId,
  viewerId,
  title,
  description,
  category,
  place,
  dateFound,
  close,
}: UpdateItemParams): Promise<ItemDetail> => {
  const actor = await loadActor(viewerId);
  const item = await loadItem(itemId);

  if (!canReview(actor, item)) fail("LOST_FOUND_NOT_FOUND");

  if (item.finderUserId === viewerId && !actor.canModerate) {
    const [approved] = await db
      .select({ id: lostFoundClaims.id })
      .from(lostFoundClaims)
      .where(
        and(
          eq(lostFoundClaims.itemId, itemId),
          eq(lostFoundClaims.status, "approved"),
        ),
      )
      .limit(1);

    if (approved) fail("ITEM_CLAIM_APPROVED");
  }

  const patch: Partial<typeof lostFoundItems.$inferInsert> = {};

  if (title !== undefined) patch.title = title;
  if (description !== undefined) patch.description = description;
  if (category !== undefined) patch.category = category;
  if (place !== undefined) patch.place = place;
  if (dateFound !== undefined) patch.dateFound = dateFound;
  if (close) patch.status = "closed";

  if (Object.keys(patch).length > 0) {
    await db
      .update(lostFoundItems)
      .set(patch)
      .where(eq(lostFoundItems.id, itemId));

    await writeAudit({
      itemId,
      actorUserId: viewerId,
      action: close ? "closed" : "edited",
      details: { fields: Object.keys(patch) },
    });
  }

  return loadDetail(await loadItem(itemId), actor);
};

export const submitClaim = async ({
  itemId,
  viewerId,
  answers,
}: SubmitClaimParams): Promise<ClaimView> => {
  const actor = await loadActor(viewerId);

  if (!actor.canClaim) fail("LOST_FOUND_FORBIDDEN");

  const item = await loadItem(itemId);

  if (item.finderUserId === viewerId) fail("OWN_ITEM_CLAIM");
  if (item.status !== "active") fail("ITEM_NOT_ACTIVE");

  validateClaimAnswers(item, answers);

  const [pending] = await db
    .select({ id: lostFoundClaims.id })
    .from(lostFoundClaims)
    .where(
      and(
        eq(lostFoundClaims.itemId, itemId),
        eq(lostFoundClaims.claimantUserId, viewerId),
        eq(lostFoundClaims.status, "pending"),
      ),
    )
    .limit(1);

  if (pending) fail("CLAIM_PENDING_EXISTS");

  const [attempts] = await db
    .select({ total: count() })
    .from(lostFoundClaims)
    .where(
      and(
        eq(lostFoundClaims.itemId, itemId),
        eq(lostFoundClaims.claimantUserId, viewerId),
      ),
    );

  if ((attempts?.total ?? 0) >= 3) fail("CLAIM_ATTEMPTS_EXCEEDED");

  const [created] = await db
    .insert(lostFoundClaims)
    .values({
      itemId,
      claimantUserId: viewerId,
      answers,
      status: "pending",
    })
    .returning();

  await writeAudit({
    itemId,
    claimId: created.id,
    actorUserId: viewerId,
    action: "claim_submitted",
    details: { questionIds: answers.map((answer) => answer.id) },
  });

  await notifyUser(item.finderUserId, {
    title: "Someone claimed your item",
    message: `A new claim was submitted for "${item.title}".`,
    notificationType: "lost_found_claim",
    referenceType: "lost_found",
    referenceId: itemId,
  });

  return buildClaimView(created);
};

export const listMyClaims = async (
  viewerId: string,
): Promise<ClaimWithItem[]> => {
  const actor = await loadActor(viewerId);

  if (!actor.canClaim) fail("LOST_FOUND_FORBIDDEN");

  const rows = await db
    .select()
    .from(lostFoundClaims)
    .where(eq(lostFoundClaims.claimantUserId, viewerId))
    .orderBy(desc(lostFoundClaims.createdAt));

  if (rows.length === 0) return [];

  const items = await db
    .select()
    .from(lostFoundItems)
    .where(
      inArray(
        lostFoundItems.id,
        rows.map((row) => row.itemId),
      ),
    );

  const names = await getNameMap(items.map((item) => item.finderUserId));
  const itemMap = new Map(items.map((item) => [item.id, item]));

  return rows.flatMap((row) => {
    const item = itemMap.get(row.itemId);

    if (!item) return [];

    return [{
      ...buildClaimView(row),
      item: buildItemSummary(item, names),
    }];
  });
};

export const decideClaim = async ({
  claimId,
  viewerId,
  decision,
  note,
}: DecideClaimParams): Promise<ClaimReview> => {
  const actor = await loadActor(viewerId);
  const claim = await loadClaim(claimId);
  const item = await loadItem(claim.itemId);

  if (!canReview(actor, item)) fail("CLAIM_NOT_FOUND");
  if (claim.status !== "pending") fail("CLAIM_NOT_PENDING");
  if (decision === "approved" && item.status !== "active") {
    fail("ITEM_NOT_ACTIVE");
  }

  const now = new Date().toISOString();
  const decisionNote = note?.trim() || null;

  const [updated] = await db
    .update(lostFoundClaims)
    .set({
      status: decision,
      decisionNote,
      decidedBy: viewerId,
      decidedAt: now,
    })
    .where(eq(lostFoundClaims.id, claimId))
    .returning();

  await writeAudit({
    itemId: item.id,
    claimId,
    actorUserId: viewerId,
    action: decision,
    details: {
      note: decisionNote,
      ...(decision === "approved" ? { itemStatus: "claimed" } : {}),
    },
  });

  if (decision === "approved") {
    await db
      .update(lostFoundItems)
      .set({ status: "claimed" })
      .where(eq(lostFoundItems.id, item.id));

    const otherPending = await db
      .select()
      .from(lostFoundClaims)
      .where(
        and(
          eq(lostFoundClaims.itemId, item.id),
          eq(lostFoundClaims.status, "pending"),
        ),
      );

    const autoNote = "Automatically rejected: another claim was approved.";

    for (const other of otherPending) {
      await db
        .update(lostFoundClaims)
        .set({
          status: "rejected",
          decisionNote: autoNote,
          decidedBy: viewerId,
          decidedAt: now,
        })
        .where(eq(lostFoundClaims.id, other.id));

      await writeAudit({
        itemId: item.id,
        claimId: other.id,
        actorUserId: viewerId,
        action: "rejected",
        details: { note: autoNote, automatic: true },
      });

      await notifyUser(other.claimantUserId, {
        title: "Claim update",
        message: `A claim for "${item.title}" was closed because another claim was approved.`,
        notificationType: "lost_found_decision",
        referenceType: "lost_found",
        referenceId: item.id,
      });
    }
  }

  await notifyUser(claim.claimantUserId, {
    title: decision === "approved" ? "Claim approved" : "Claim rejected",
    message: `Your claim for "${item.title}" was ${decision}.`,
    notificationType: "lost_found_decision",
    referenceType: "lost_found",
    referenceId: item.id,
  });

  const names = await getNameMap([claim.claimantUserId]);

  return buildClaimReview(updated, await loadItem(item.id), names);
};

export const markReturned = async (
  itemId: number,
  viewerId: string,
): Promise<ItemDetail> => {
  const actor = await loadActor(viewerId);
  const item = await loadItem(itemId);

  if (!canReview(actor, item)) fail("LOST_FOUND_NOT_FOUND");
  if (item.status === "returned" || item.status === "closed") {
    fail("ITEM_NOT_ACTIVE");
  }

  const [approved] = await db
    .select()
    .from(lostFoundClaims)
    .where(
      and(
        eq(lostFoundClaims.itemId, itemId),
        eq(lostFoundClaims.status, "approved"),
      ),
    )
    .limit(1);

  await db
    .update(lostFoundItems)
    .set({ status: "returned" })
    .where(eq(lostFoundItems.id, itemId));

  await writeAudit({
    itemId,
    claimId: approved?.id ?? null,
    actorUserId: viewerId,
    action: "returned",
    details: { previousStatus: item.status },
  });

  if (approved) {
    await notifyUser(approved.claimantUserId, {
      title: "Item marked as returned",
      message: `The finder marked "${item.title}" as returned.`,
      notificationType: "lost_found_returned",
      referenceType: "lost_found",
      referenceId: itemId,
    });
  }

  return loadDetail(await loadItem(itemId), actor);
};

export const confirmReceipt = async (
  itemId: number,
  viewerId: string,
): Promise<ItemDetail> => {
  const actor = await loadActor(viewerId);

  if (!actor.canClaim) fail("LOST_FOUND_FORBIDDEN");

  const item = await loadItem(itemId);

  const [approved] = await db
    .select()
    .from(lostFoundClaims)
    .where(
      and(
        eq(lostFoundClaims.itemId, itemId),
        eq(lostFoundClaims.claimantUserId, viewerId),
        eq(lostFoundClaims.status, "approved"),
      ),
    )
    .limit(1);

  if (!approved) fail("CLAIM_NOT_FOUND");

  await writeAudit({
    itemId,
    claimId: approved.id,
    actorUserId: viewerId,
    action: "receipt_confirmed",
    details: {},
  });

  await notifyUser(item.finderUserId, {
    title: "Receipt confirmed",
    message: `The claimant confirmed receipt of "${item.title}".`,
    notificationType: "lost_found_returned",
    referenceType: "lost_found",
    referenceId: itemId,
  });

  return loadDetail(item, actor);
};

export const withdrawClaim = async (
  claimId: number,
  viewerId: string,
): Promise<ClaimView> => {
  const actor = await loadActor(viewerId);
  const claim = await loadClaim(claimId);

  if (claim.claimantUserId !== viewerId) fail("CLAIM_NOT_FOUND");
  if (claim.status !== "pending") fail("CLAIM_NOT_PENDING");

  const [updated] = await db
    .update(lostFoundClaims)
    .set({ status: "withdrawn" })
    .where(eq(lostFoundClaims.id, claimId))
    .returning();

  await writeAudit({
    itemId: claim.itemId,
    claimId,
    actorUserId: viewerId,
    action: "withdrawn",
    details: {},
  });

  return buildClaimView(updated);
};

export const listAudit = async ({
  viewerId,
  page,
  limit,
}: ListAuditParams): Promise<{
  events: AuditEventItem[];
  pagination: Pagination;
}> => {
  const actor = await loadActor(viewerId);

  if (!actor.canModerate) fail("LOST_FOUND_FORBIDDEN");

  const offset = (page - 1) * limit;

  const [rows, totalResult] = await Promise.all([
    db
      .select()
      .from(lostFoundAuditEvents)
      .orderBy(desc(lostFoundAuditEvents.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(lostFoundAuditEvents),
  ]);

  const names = await getNameMap(rows.map((row) => row.actorUserId));

  const items = await db
    .select({ id: lostFoundItems.id, title: lostFoundItems.title })
    .from(lostFoundItems)
    .where(
      inArray(
        lostFoundItems.id,
        rows.map((row) => row.itemId),
      ),
    );
  const titles = new Map(items.map((item) => [item.id, item.title]));

  const total = totalResult[0]?.total ?? 0;

  return {
    events: rows.map((row) =>
      buildAuditEvent(row, names, titles.get(row.itemId)),
    ),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
