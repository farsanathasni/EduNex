import type { RequestHandler } from "express";

import {
  getTeacherDashboard,
  getTeacherClasses,
  getTeacherStudents,
  getTeacherMaterials,
  createTeacherMaterial,
  createUploadedTeacherMaterial,
  deleteTeacherMaterial,
  getFileExtension,
  updateTeacherMaterial,
} from "./teacher.service.js";
import {
  deleteResourceFile,
  uploadResourceFile,
} from "../../lib/cloudinary.js";

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

      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : "";

      const page =
        req.query.page === undefined
          ? 1
          : Number(req.query.page);

      const limit =
        req.query.limit === undefined
          ? 10
          : Number(req.query.limit);

      const result = await getTeacherStudents(
        getUserId(res),
        semester,
        search,
        page,
        limit,
      );

      res.status(200).json({
        success: true,
        data: result.students,
        pagination: result.pagination,
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

export const uploadTeacherMaterialController: RequestHandler =
  async (req, res, next) => {
    try {
      const file = req.file;

      if (!file) {
        throw new Error("FILE_REQUIRED");
      }

      const data = await createUploadedTeacherMaterial(
        getUserId(res),
        req.body,
        file,
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

export const updateTeacherMaterialController: RequestHandler =
  async (req, res, next) => {
    try {
      const file = req.file;
      const stored = file ? await uploadResourceFile(file) : null;

      try {
        const data = await updateTeacherMaterial(getUserId(res), Number(req.params.id), {
          ...req.body,
          ...(file && stored
            ? {
                fileUrl: stored.secureUrl,
                fileType: getFileExtension(file.originalname).toUpperCase(),
                filePublicId: stored.publicId,
                fileResourceType: stored.resourceType,
                fileSize: stored.bytes,
                fileName: file.originalname,
              }
            : {}),
        });

        res.status(200).json({
          success: true,
          message: "Study material updated successfully",
          data,
        });
      } catch (error) {
        if (stored) {
          try {
            await deleteResourceFile(stored.publicId, stored.resourceType);
          } catch (cleanupError) {
            console.error("Failed to clean up new Cloudinary file", cleanupError);
          }
        }

        throw error;
      }
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