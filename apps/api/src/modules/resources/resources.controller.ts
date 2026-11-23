import type { RequestHandler } from "express";

import { getStudentMaterials } from "./resources.service.js";

function getUserId(res: Parameters<RequestHandler>[1]): string {
  const userId = res.locals.user?.id as string | undefined;

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}

export const getStudentMaterialsController: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    const data = await getStudentMaterials(getUserId(res));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
