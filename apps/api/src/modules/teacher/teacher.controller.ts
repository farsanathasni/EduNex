import type { RequestHandler } from "express";

import {
  getTeacherDashboard,
  getTeacherClasses,
  getTeacherStudents,
  getTeacherMaterials,
  createTeacherMaterial,
  deleteTeacherMaterial,
} from "./teacher.service.js";

function getUserId(res: Parameters<RequestHandler>[1]): string {
  const userId = res.locals.user?.id as string | undefined;

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}

export const getTeacherDashboardController: RequestHandler =
  async (req, res, next) => {
    try {
      const data = await getTeacherDashboard(getUserId(res));

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const getTeacherClassesController: RequestHandler =
  async (req, res, next) => {
    try {
      const data = await getTeacherClasses(getUserId(res));

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const getTeacherStudentsController: RequestHandler =
  async (req, res, next) => {
    try {
      const semester = req.query.semester
        ? Number(req.query.semester)
        : undefined;

      const data = await getTeacherStudents(
        getUserId(res),
        semester,
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const getTeacherMaterialsController: RequestHandler =
  async (req, res, next) => {
    try {
      const data = await getTeacherMaterials(getUserId(res));

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const createTeacherMaterialController: RequestHandler =
  async (req, res, next) => {
    try {
      const data = await createTeacherMaterial(
        getUserId(res),
        req.body,
      );

      res.status(201).json({
        success: true,
        message: "Study material uploaded successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteTeacherMaterialController: RequestHandler =
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const data = await deleteTeacherMaterial(
        getUserId(res),
        id,
      );

      res.status(200).json({
        success: true,
        message: "Study material deleted successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };