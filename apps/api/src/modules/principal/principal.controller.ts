// import type { Request, Response } from "express";
// import asyncHandler from "../../middleware/asyncHandler.js";
// import { getActivePrincipal, createHod,getDepartments } from "./principal.service.js";
// import { createHodSchema } from "../hod/hod.validation.js";

// export const GetPrincipalDashboard = asyncHandler(
//   async (_req: Request, res: Response) => {
//     const user = res.locals.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized. Please log in.",
//       });
//     }

//     const principal = await getActivePrincipal(user.id);

//     if (!principal) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Active Principal permission required.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Principal dashboard fetched successfully.",
//       data: {
//         staffId: principal.id,
//         employeeId: principal.employeeId,
//         role: principal.role,
//         designation: principal.designation,
//       },
//     });
//   }
// );

// export const CreateHod = asyncHandler(
//   async (req: Request, res: Response) => {
//     const user = res.locals.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Please log in first.",
//       });
//     }

//     const principal = await getActivePrincipal(user.id);

//     if (!principal) {
//       return res.status(403).json({
//         success: false,
//         message: "Only an active Principal can create HOD accounts.",
//       });
//     }

//     const validation = createHodSchema.safeParse(req.body);

//     if (!validation.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid HOD details.",
//         errors: validation.error.flatten(),
//       });
//     }

//     try {
//       const hod = await createHod(validation.data);

//       return res.status(201).json({
//         success: true,
//         message: "HOD account created successfully.",
//         data: hod,
//       });
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Unable to create HOD.";

//       if (
//         message.includes("already registered") ||
//         message.toLowerCase().includes("already exists")
//       ) {
//         return res.status(409).json({
//           success: false,
//           message,
//         });
//       }

//       throw error;
//     }
//   },
// );

// export const GetDepartments = asyncHandler(
//   async (_req: Request, res: Response) => {
//     const user = res.locals.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Please log in first.",
//       });
//     }

//     const principal = await getActivePrincipal(user.id);

//     if (!principal) {
//       return res.status(403).json({
//         success: false,
//         message: "Only an active Principal can view departments.",
//       });
//     }

//     const departmentsList = await getDepartments();

//     return res.status(200).json({
//       success: true,
//       data: departmentsList,
//     });
//   },
// );

import type { Request, Response } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import {
  getStaffProfile,
  createHod,
  createStaffAccount,
  StaffCreationError,
  getDepartments,
} from "./principal.service.js";
import { createHodSchema } from "../hod/hod.validation.js";
import { createStaffSchema } from "../staff/staff.validation.js";

// Access is decided by the rbac() middleware on the router
// (admin:view, staff:create, department:view), so these handlers
// no longer check for a Principal staff record.

export const GetPrincipalDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    // Optional: a Super Admin may have no staff record.
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
);

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
