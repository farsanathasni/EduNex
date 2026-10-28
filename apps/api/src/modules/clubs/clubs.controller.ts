
import type { Request, Response } from "express";

import asyncHandler from "../../middleware/asyncHandler.js";
import {
  createClub,
  createMemberShipRequest,
  getAllClubs,
  getClubAnnouncements,
  getClubById,
  getClubCoordinators,
  getClubEvents,
  getMyMembershipRequests,
  getStudentProfileByUserId,
} from "./clubs.service.js";
import {
  clubListQuerySchema,
  createClubSchema,
} from "./clubs.validation.js";

const getListQuery = (req: Request) =>
  clubListQuerySchema.safeParse(req.query);

export const CreateClub = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = createClubSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid club details.",
        errors: validation.error.flatten(),
      });
    }

    const { name, description, departmentId } = validation.data;

    const club = await createClub(name, description, departmentId);

    return res.status(201).json({
      success: true,
      message: "Club created successfully.",
      data: club,
    });
  },
);

export const GetAllClubs = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = getListQuery(req);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { page, limit, search } = validation.data;
    const result = await getAllClubs(search, page, limit);

    return res.status(200).json({
      success: true,
      message: "Clubs fetched successfully.",
      data: result.clubs,
      pagination: result.pagination,
    });
  },
);

export const GetStudentClubs = GetAllClubs;

export const GetStudentClubById = asyncHandler(
  async (req: Request, res: Response) => {
    const clubId = Number(req.params.clubId);

    if (!Number.isSafeInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    const data = await getClubById(clubId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Club fetched successfully.",
      data,
    });
  },
);

export const GetStudentClubCoordinators = asyncHandler(
  async (req: Request, res: Response) => {
    const clubId = Number(req.params.clubId);
    const validation = getListQuery(req);

    if (!Number.isSafeInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { page, limit, search } = validation.data;
    const result = await getClubCoordinators(
      clubId,
      search,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Club coordinators fetched successfully.",
      data: result.coordinators,
      pagination: result.pagination,
    });
  },
);

export const GetStudentClubEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const clubId = Number(req.params.clubId);
    const validation = getListQuery(req);

    if (!Number.isSafeInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { page, limit, search } = validation.data;
    const result = await getClubEvents(
      clubId,
      search,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Club events fetched successfully.",
      data: result.events,
      pagination: result.pagination,
    });
  },
);

export const GetStudentClubAnnouncements = asyncHandler(
  async (req: Request, res: Response) => {
    const clubId = Number(req.params.clubId);
    const validation = getListQuery(req);

    if (!Number.isSafeInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const { page, limit } = validation.data;
    const result = await getClubAnnouncements(
      clubId,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Club announcements fetched successfully.",
      data: result.announcements,
      pagination: result.pagination,
    });
  },
);

export const CreateStudentMembershipRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const clubId = Number(req.params.clubId);

    if (!Number.isSafeInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    const student = await getStudentProfileByUserId(currentUser.id);

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    try {
      const data = await createMemberShipRequest(clubId, student.id);

      return res.status(201).json({
        success: true,
        message: "Membership request submitted successfully.",
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CLUB_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Club not found.",
        });
      }

      if (
        error instanceof Error &&
        error.message === "MEMBERSHIP_REQUEST_EXISTS"
      ) {
        return res.status(409).json({
          success: false,
          message: "You have already requested or joined this club.",
        });
      }

      throw error;
    }
  },
);

export const GetMyStudentMembershipRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const validation = getListQuery(req);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or pagination parameters.",
        errors: validation.error.flatten(),
      });
    }

    const student = await getStudentProfileByUserId(currentUser.id);

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const { page, limit, search } = validation.data;
    const result = await getMyMembershipRequests(
      student.id,
      search,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Membership requests fetched successfully.",
      data: result.requests,
      pagination: result.pagination,
    });
  },
);
