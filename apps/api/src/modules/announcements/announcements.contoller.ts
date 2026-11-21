
import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";

import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "./announcements.service.js";

import {
  announcementsQuerySchema,
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "./announcements.validation.js";

export const getAnnouncementsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const validation = announcementsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const result = await getAnnouncements(userId, validation.data);

    if (!result) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view announcements.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.announcements,
      pagination: result.pagination,
      message: "Announcements fetched successfully.",
    });
  },
);

export const createAnnouncementController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const validation = createAnnouncementSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement details.",
        errors: validation.error.flatten(),
      });
    }

    const result = await createAnnouncement(userId, validation.data);

    if (!result) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create this announcement.",
      });
    }

    return res.status(201).json({
      success: true,
      data: result,
      message: "Announcement created successfully.",
    });
  },
);

export const updateAnnouncementController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const announcementId = Number(req.params.id);

    if (!Number.isInteger(announcementId) || announcementId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    const validation = updateAnnouncementSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement update details.",
        errors: validation.error.flatten(),
      });
    }

    const result = await updateAnnouncement(
      userId,
      announcementId,
      validation.data,
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found or you are not allowed to update it.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Announcement updated successfully.",
    });
  },
);

export const deleteAnnouncementController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const announcementId = Number(req.params.id);

    if (!Number.isInteger(announcementId) || announcementId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    const result = await deleteAnnouncement(userId, announcementId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found or you are not allowed to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: "Announcement deleted successfully.",
    });
  },
);
