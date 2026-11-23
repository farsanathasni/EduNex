import type { Request, RequestHandler } from "express";

import {
  confirmReceipt,
  createItem,
  decideClaim,
  getItemById,
  listAudit,
  listItems,
  listMyClaims,
  markReturned,
  submitClaim,
  updateItem,
  withdrawClaim,
} from "./lost-and-found.service.js";
import { lostFoundStorage } from "./lost-found.storage.js";
import { auditQuerySchema, itemListQuerySchema } from "./lost-and-found.validation.js";

const getUserId = (res: Parameters<RequestHandler>[1]): string => {
  const userId = res.locals.user?.id as string | undefined;

  if (!userId) throw new Error("UNAUTHORIZED");

  return userId;
};

const getUploadedFiles = (req: Request): Express.Multer.File[] =>
  (req.files as Express.Multer.File[] | undefined) ?? [];

const sendValidationError = (
  res: Parameters<RequestHandler>[1],
  issues: unknown,
): void => {
  res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: issues,
  });
};

export const listItemsController: RequestHandler = async (req, res, next) => {
  try {
    const parsed = itemListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      sendValidationError(res, parsed.error.issues);
      return;
    }

    const data = await listItems({
      viewerId: getUserId(res),
      ...parsed.data,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getItemByIdController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getItemById(Number(req.params.id), getUserId(res));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createItemController: RequestHandler = async (req, res, next) => {
  let photos: Awaited<ReturnType<typeof lostFoundStorage.store>> = [];

  try {
    photos = await lostFoundStorage.store(getUploadedFiles(req));

    const data = await createItem({
      viewerId: getUserId(res),
      ...req.body,
      photos,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    await lostFoundStorage.remove(photos);
    next(error);
  }
};

export const updateItemController: RequestHandler = async (req, res, next) => {
  try {
    const data = await updateItem({
      itemId: Number(req.params.id),
      viewerId: getUserId(res),
      ...req.body,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const submitClaimController: RequestHandler = async (req, res, next) => {
  try {
    const data = await submitClaim({
      itemId: Number(req.params.id),
      viewerId: getUserId(res),
      ...req.body,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const listMyClaimsController: RequestHandler = async (_req, res, next) => {
  try {
    const data = await listMyClaims(getUserId(res));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const decideClaimController: RequestHandler = async (req, res, next) => {
  try {
    const data = await decideClaim({
      claimId: Number(req.params.id),
      viewerId: getUserId(res),
      ...req.body,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const withdrawClaimController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const data = await withdrawClaim(Number(req.params.id), getUserId(res));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const markReturnedController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const data = await markReturned(Number(req.params.id), getUserId(res));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const confirmReceiptController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const data = await confirmReceipt(Number(req.params.id), getUserId(res));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const listAuditController: RequestHandler = async (req, res, next) => {
  try {
    const parsed = auditQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      sendValidationError(res, parsed.error.issues);
      return;
    }

    const data = await listAudit({
      viewerId: getUserId(res),
      ...parsed.data,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
