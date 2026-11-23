import type { RequestHandler } from "express";

import {
  addIssueResponse,
  createIssue,
  getIssueById,
  getIssueRecipients,
  listIssues,
  resolveIssue,
} from "./issues.service.js";
import { issueListQuerySchema } from "./issues.validation.js";

const getUserId = (res: Parameters<RequestHandler>[1]): string => {
  const userId = res.locals.user?.id as string | undefined;

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
};

export const getIssueRecipientsController: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    const data = await getIssueRecipients(getUserId(res));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createIssueController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const issue = await createIssue({
      viewerId: getUserId(res),
      ...req.body,
    });

    res.status(201).json({ success: true, data: { issue } });
  } catch (error) {
    next(error);
  }
};

export const listIssuesController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const parsed = issueListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
      return;
    }

    const data = await listIssues({
      viewerId: getUserId(res),
      ...parsed.data,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getIssueByIdController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const data = await getIssueById(
      Number(req.params.id),
      getUserId(res),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addIssueResponseController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const data = await addIssueResponse({
      issueId: Number(req.params.id),
      viewerId: getUserId(res),
      ...req.body,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const resolveIssueController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const issue = await resolveIssue({
      issueId: Number(req.params.id),
      viewerId: getUserId(res),
      ...req.body,
    });

    res.status(200).json({ success: true, data: { issue } });
  } catch (error) {
    next(error);
  }
};
