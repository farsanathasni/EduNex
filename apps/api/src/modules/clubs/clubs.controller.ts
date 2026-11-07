
import type { Request, Response } from "express"
import { eq } from "drizzle-orm"
import asyncHandler from "../../middleware/asyncHandler.js";
import { db } from "../../config/database.js";
import { departments } from "../../db/schema/others-schema.js";
import {
  resolveHodDepartmentScope,
  type Access,
} from "../rbac/rbac.access.js";
import {
  assignClubDepartment,
  createClub,
  createMemberShipRequest,
  getAllClubs,
  getClubAnnouncements,
  getClubById,
  getClubCoordinators,
  getClubEvents,
  getCoordinatorClubMembers,
  getCoordinatorMembershipRequests,
  getCoordinatorProfileByUserId,
  getMyMembershipRequests,
  getStudentProfileByUserId,
  reviewClubMembershipRequest,
} from "./clubs.service.js"

import {
  assignClubDepartmentSchema,
  clubListQuerySchema,
  createClubSchema,
} from "./clubs.validation.js";

const getListQuery = (req: Request) =>
  clubListQuerySchema.safeParse(req.query);

const requirePrincipal = (
  res: Response,
  message = "Only the Principal can assign a department to a club.",
) => {
  if ((res.locals.access as Access | undefined)?.isSuperAdmin) return true;

  res.status(403).json({
    success: false,
    message,
  });
  return false;
};

const departmentExists = async (departmentId: number) => {
  const [department] = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.id, departmentId))
    .limit(1);

  return !!department;
};

export const CreateClub = asyncHandler(
  async (req: Request, res: Response) => {
    if (
      !requirePrincipal(
        res,
        "Only the Principal can create a club for a selected department.",
      )
    ) {
      return;
    }

    const validation = createClubSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid club details.",
        errors: validation.error.flatten(),
      });
    }

    const { name, description, departmentId } = validation.data;

    if (!(await departmentExists(departmentId))) {
      return res.status(400).json({
        success: false,
        message: "Selected department does not exist.",
      });
    }

    const club = await createClub(name, description, departmentId);

    return res.status(201).json({
      success: true,
      message: "Club created successfully.",
      data: club,
    });
  },
);

export const AssignClubDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!requirePrincipal(res)) return;

    const clubId = Number(req.params.clubId);

    if (!Number.isSafeInteger(clubId) || clubId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid club ID.",
      });
    }

    const validation = assignClubDepartmentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid department details.",
        errors: validation.error.flatten(),
      });
    }

    const { departmentId } = validation.data;

    if (!(await departmentExists(departmentId))) {
      return res.status(400).json({
        success: false,
        message: "Selected department does not exist.",
      });
    }

    const club = await getClubById(clubId);

    if (!club) {
      return res.status(404).json({
        success: false,
        message: "Club not found.",
      });
    }

    if (club.departmentId !== null) {
      return res.status(409).json({
        success: false,
        message: "This club already belongs to a department.",
      });
    }

    const updatedClub = await assignClubDepartment(clubId, departmentId);

    if (!updatedClub) {
      return res.status(409).json({
        success: false,
        message: "This club already belongs to a department.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Club department assigned successfully.",
      data: updatedClub,
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

    const departmentId = await resolveHodDepartmentScope(
      res.locals.access as Access,
    );

    if (departmentId === null) {
      return res.status(403).json({
        success: false,
        message: "No department is assigned to your account.",
      });
    }

    const result = await getAllClubs(search, page, limit, departmentId);

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

    const departmentId = await resolveHodDepartmentScope(
      res.locals.access as Access,
    );

    if (departmentId === null) {
      return res.status(403).json({
        success: false,
        message: "No department is assigned to your account.",
      });
    }

    if (departmentId !== undefined) {
      const club = await getClubById(clubId);

      if (!club || club.departmentId !== departmentId) {
        return res.status(404).json({
          success: false,
          message: "Club not found.",
        });
      }
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



export const GetCoordinatorMembershipRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const coordinator = await getCoordinatorProfileByUserId(
      currentUser.id,
    );

    if (!coordinator) {
      return res.status(403).json({
        success: false,
        message: "Coordinator profile not found.",
      });
    }

    const requests = await getCoordinatorMembershipRequests(
      coordinator.id,
    );

    return res.status(200).json({
      success: true,
      message: "Membership requests fetched successfully.",
      data: requests,
    });
  },
);


export const ReviewClubMembershipRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const currentUser = res.locals.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    const requestId = Number(req.params.requestId);
    const { decision } = req.body;

    if (!Number.isSafeInteger(requestId) || requestId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership request ID.",
      });
    }

    if (decision !== "approved" && decision !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Decision must be approved or rejected.",
      });
    }

    const coordinator = await getCoordinatorProfileByUserId(
      currentUser.id,
    );

    if (!coordinator) {
      return res.status(403).json({
        success: false,
        message: "Coordinator profile not found.",
      });
    }

    try {
      const updatedRequest = await reviewClubMembershipRequest(
        coordinator.id,
        requestId,
        decision,
      );

      return res.status(200).json({
        success: true,
        message: `Membership request ${decision} successfully.`,
        data: updatedRequest,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "MEMBERSHIP_REQUEST_NOT_FOUND"
      ) {
        return res.status(404).json({
          success: false,
          message: "Membership request not found.",
        });
      }

      if (
        error instanceof Error &&
        error.message === "MEMBERSHIP_REQUEST_ALREADY_REVIEWED"
      ) {
        return res.status(409).json({
          success: false,
          message: "This membership request has already been reviewed.",
        });
      }

      throw error;
    }
  },
);



export const GetCoordinatorClubMembers = asyncHandler(
  async (req: Request, res: Response) => {
    if (!res.locals.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const coordinator = await getCoordinatorProfileByUserId(
      res.locals.user.id,
    );

    if (!coordinator) {
      return res.status(403).json({
        success: false,
        message: "Coordinator profile not found",
      });
    }

    const members = await getCoordinatorClubMembers(coordinator.id);

    return res.status(200).json({
      success: true,
      message: "Club members fetched successfully",
      data: members,
    });
  },
);