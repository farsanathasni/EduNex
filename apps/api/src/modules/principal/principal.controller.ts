
import type { Request, Response } from "express"
import asyncHandler from "../../middleware/asyncHandler.js"
import {
  getStaffProfile,
  createHod,
  createStaffAccount,
  createStudentAccount,
  StaffCreationError,
  getDepartments,
} from "./principal.service.js"
import { createHodSchema } from "../hod/hod.validation.js"
import { createStaffSchema } from "../staff/staff.validation.js"
import { createManagedStudentSchema } from "../students/student.validation.js"
import { getPendingEvents } from "../hod/hod.service.js"
import { getPrincipalAllEvents,publishApprovedEvent } from "../events/events.service.js"
import {
  resolveDepartmentScope,
  type Access,
} from "../rbac/rbac.access.js"


const getPaginationParams = (req: Request) => {
  const page =
    req.query.page === undefined ? 1 : Number(req.query.page);

  const limit =
    req.query.limit === undefined ? 50 : Number(req.query.limit)

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return null;
  }

  return { page, limit };
};


export const GetPrincipalDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

   
    const profile = await getStaffProfile(user.id);

    return res.status(200).json({
      success: true,
      message: "Principal dashboard fetched successfully.",
      data: {
        staffId: profile?.id ?? null,
        employeeId: profile?.employeeId ?? null,
        role: profile?.role ?? "super-admin",
        designation: profile?.designation ?? "Super Admin",
      },
    });
  },
);

export const CreateHod = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const validation = createHodSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid HOD details.",
        errors: validation.error.flatten(),
      });
    }

    try {
      const hod = await createHod(validation.data, user.id);

      return res.status(201).json({
        success: true,
        message: "HOD account created successfully.",
        data: hod,
      });
    } catch (error) {
      if (error instanceof StaffCreationError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      const message =
        error instanceof Error ? error.message : "Unable to create HOD.";

      if (
        message.includes("already registered") ||
        message.toLowerCase().includes("already exists")
      ) {
        return res.status(409).json({
          success: false,
          message,
        });
      }

      throw error;
    }
  },
)


export const CreateStaff = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const validation = createStaffSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff details.",
        errors: validation.error.flatten(),
      });
    }

    try {
      const createdStaff = await createStaffAccount(validation.data, user.id);
      return res.status(201).json({
        success: true,
        message: `${validation.data.role === "hod" ? "HOD" : "Faculty"} account created. A password setup email has been sent.`,
        data: createdStaff,
      });
    } catch (error) {
      if (error instanceof StaffCreationError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  },
);

export const CreateStudent = asyncHandler(
  async (req: Request, res: Response) => {
    if (!res.locals.user) {
      return res.status(401).json({ success: false, message: "Please log in first." });
    }
    if (!(res.locals.access as Access | undefined)?.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the Principal can create managed student accounts.",
      });
    }

    const validation = createManagedStudentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid student details.",
        errors: validation.error.flatten(),
      });
    }

    try {
      const student = await createStudentAccount(validation.data);
      return res.status(201).json({
        success: true,
        message: "Student account created. A password setup email has been sent.",
        data: student,
      });
    } catch (error) {
      if (error instanceof StaffCreationError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      throw error;
    }
  },
);

export const GetDepartments = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    const departmentsList = await getDepartments();

    return res.status(200).json({
      success: true,
      data: departmentsList,
    });
  },
);



export const GetPrincipalEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const access = res.locals.access as Access;

    
    if (!access?.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the Principal can view all event requests.",
      });
    }

    // Resolve the Principal's global department scope.
    const scope = await resolveDepartmentScope(access);

    if (!scope) {
      return res.status(403).json({
        success: false,
        message: "Unable to resolve department access.",
      });
    }

    const pagination = getPaginationParams(req);

    if (!pagination) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100.",
      });
    }

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const departmentId =
      scope.kind === "department" ? scope.departmentId : undefined;

    const result = await getPendingEvents(
      departmentId,
      search,
      pagination.page,
      pagination.limit,
    );

    return res.status(200).json({
      success: true,
      message: "Pending events fetched successfully.",
      data: result.events,
      pagination: result.pagination,
    });
  },
);


export const GetPrincipalAllEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const access = res.locals.access as Access;

    if (!access?.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the Principal can view all college events.",
      });
    }

    const scope = await resolveDepartmentScope(access);

    if (!scope) {
      return res.status(403).json({
        success: false,
        message: "Unable to resolve department access.",
      });
    }

    const pagination = getPaginationParams(req);

    if (!pagination) {
      return res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100.",
      });
    }

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const departmentId =
      scope.kind === "department" ? scope.departmentId : undefined;

    const result = await getPrincipalAllEvents(
      search,
      pagination.page,
      pagination.limit,
      departmentId,
    );

    return res.status(200).json({
      success: true,
      message: "College events fetched successfully.",
      data: result.events,
      pagination: result.pagination,
    });
  },
);


export const PublishPrincipalEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const access = res.locals.access as Access;

    if (!access?.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the Principal can publish events.",
      });
    }

    const eventId = Number(req.params.eventId);

    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const publishedEvent = await publishApprovedEvent(eventId);

    if (!publishedEvent) {
      return res.status(400).json({
        success: false,
        message:
          "This event cannot be published. Only approved events can be published.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event published successfully.",
      data: publishedEvent,
    });
  },
);
