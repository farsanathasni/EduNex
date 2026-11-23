import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

// Known error codes thrown by the services -> HTTP status and message.
const KNOWN_ERRORS: Record<string, { status: number; message: string }> = {
  // Auth
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  DB_UNAVAILABLE: {
    status: 503,
    message: "Service temporarily unavailable",
  },

  // Teacher / class attendance
  TEACHER_NOT_FOUND: { status: 403, message: "Faculty account not found." },
  TEACHER_DEPARTMENT_NOT_ASSIGNED: {
    status: 403,
    message: "Your account has no department assigned.",
  },
  MATERIAL_NOT_FOUND_OR_FORBIDDEN: {
    status: 404,
    message: "Study material not found.",
  },
  FILE_REQUIRED: { status: 400, message: "Please choose a file to upload." },
  FILE_TOO_LARGE: {
    status: 400,
    message: "The file is too large. The maximum size is 10 MB.",
  },
  INVALID_FILE_TYPE: {
    status: 400,
    message:
      "Unsupported file type. Allowed: pdf, doc, docx, ppt, pptx, xls, xlsx, png, jpg, jpeg, mp4.",
  },
  UNEXPECTED_FILE_FIELD: {
    status: 400,
    message: "Unexpected file field. Use the 'file' field.",
  },
  FILE_UPLOAD_FAILED: {
    status: 400,
    message: "The file could not be uploaded. Please try again.",
  },
  CLOUDINARY_CONFIG_MISSING: {
    status: 503,
    message: "File storage is not configured.",
  },
  CLOUDINARY_UPLOAD_FAILED: {
    status: 502,
    message: "The file could not be stored. Please try again.",
  },
  SUBJECT_NOT_ASSIGNED: {
    status: 403,
    message: "This subject is not assigned to you.",
  },
  ATTENDANCE_LOCKED: {
    status: 403,
    message: "Attendance can only be marked or edited on the same day.",
  },
  FUTURE_DATE_NOT_ALLOWED: {
    status: 400,
    message: "You cannot mark attendance for a future date.",
  },
  STUDENT_NOT_IN_CLASS: {
    status: 400,
    message: "One or more students do not belong to this class.",
  },
  STUDENT_NOT_FOUND: { status: 404, message: "Student profile not found." },
  REPORT_DEPARTMENT_FORBIDDEN: {
    status: 403,
    message: "You can only access reports for your own department.",
  },
  REPORT_DEPARTMENT_NOT_ASSIGNED: {
    status: 403,
    message: "Your account has no department assigned.",
  },
  REPORT_SCOPE_NOT_FOUND: {
    status: 403,
    message: "You do not have a department scope for attendance reports.",
  },
  REPORT_DEPARTMENT_NOT_FOUND: {
    status: 404,
    message: "Department not found.",
  },
  REPORT_SUBJECT_FORBIDDEN: {
    status: 403,
    message: "This subject is not available in your report scope.",
  },
  REPORT_STUDENT_NOT_FOUND: {
    status: 404,
    message: "Student profile not found in your report scope.",
  },

  // Subjects (HOD)
  HOD_NOT_FOUND: { status: 403, message: "HOD account not found." },
  DEPARTMENT_REQUIRED: { status: 400, message: "Department is required." },
  DEPARTMENT_NOT_FOUND: { status: 404, message: "Department not found." },
  SUBJECT_NOT_FOUND: { status: 404, message: "Subject not found." },
  SUBJECT_SCOPE_NOT_FOUND: {
    status: 403,
    message: "No department scope is available for your account.",
  },
  SUBJECT_CODE_EXISTS: {
    status: 409,
    message: "A subject with this code already exists in the department.",
  },
  SUBJECT_HAS_SESSIONS: {
    status: 409,
    message: "This subject already has attendance records and cannot be deleted.",
  },
  FACULTY_NOT_FOUND: { status: 404, message: "Faculty member not found." },
  FACULTY_ASSIGNMENT_NOT_FOUND: {
    status: 404,
    message: "This faculty member is not assigned to the subject.",
  },
  FACULTY_ALREADY_ASSIGNED: {
    status: 409,
    message: "This faculty member is already assigned to the subject.",
  },
  FACULTY_DEPARTMENT_MISMATCH: {
    status: 400,
    message: "Faculty must belong to the same department as the subject.",
  },

  // Event attendance
  EVENT_NOT_FOUND: { status: 404, message: "Event not found." },
  UNAUTHORIZED_EVENT_ACCESS: {
    status: 403,
    message: "You do not have access to this event.",
  },
  HOD_DEPARTMENT_NOT_ASSIGNED: {
    status: 403,
    message: "Your account has no department assigned.",
  },
  STUDENT_PROFILE_NOT_FOUND: {
    status: 404,
    message: "Student profile not found.",
  },
  DUPLICATE_STUDENT_IDS: {
    status: 400,
    message: "Duplicate student IDs are not allowed.",
  },
  INVALID_CLUB_MEMBERS: {
    status: 400,
    message: "One or more students are not approved members of this club.",
  },

  // Clubs / memberships
  CLUB_HAS_DEPENDENT_RECORDS: {
    status: 409,
    message:
      "This club cannot be deleted while related events, memberships, coordinators, or announcements still reference it.",
  },
  CLUB_NOT_FOUND: { status: 404, message: "Club not found." },
  MEMBERSHIP_REQUEST_EXISTS: {
    status: 409,
    message: "You have already requested or joined this club.",
  },
  MEMBERSHIP_REQUEST_NOT_FOUND: {
    status: 404,
    message: "Membership request not found.",
  },
  MEMBERSHIP_REQUEST_ALREADY_REVIEWED: {
    status: 409,
    message: "This membership request has already been reviewed.",
  },

  // Students / coordinators
  CLUB_COORDINATOR_ROLE_NOT_FOUND: {
    status: 404,
    message: "Coordinator role is not configured.",
  },
  STUDENT_NOT_FOUND_OR_FORBIDDEN: {
    status: 404,
    message:
      "Student not found or student does not belong to your department.",
  },
  CLUB_NOT_FOUND_OR_FORBIDDEN: {
    status: 404,
    message: "Club not found or club does not belong to your department.",
  },
  COORDINATOR_ALREADY_ASSIGNED: {
    status: 409,
    message: "This student is already assigned to this club.",
  },
  COORDINATOR_ASSIGNMENT_NOT_FOUND: {
    status: 404,
    message: "Coordinator assignment not found in your department.",
  },

  // Roles / permissions
  ROLE_NAME_INVALID: {
    status: 400,
    message: "Role name must contain letters or numbers.",
  },
  ROLE_RESERVED: {
    status: 409,
    message: "The Principal role is reserved; use Super Admin instead.",
  },
  ROLE_EXISTS: {
    status: 409,
    message: "A role with this name already exists.",
  },
  ROLE_NOT_FOUND: { status: 404, message: "Role not found." },
  ROLE_LOCKED: {
    status: 403,
    message: "The Super Admin role cannot be edited.",
  },
  ROLE_SYSTEM_RENAME: {
    status: 403,
    message: "Built-in roles cannot be renamed.",
  },
  ROLE_SYSTEM_DELETE: {
    status: 403,
    message: "Built-in roles cannot be deleted.",
  },
  ROLE_IN_USE: {
    status: 409,
    message: "Remove this role from its users before deleting it.",
  },

  // HOD event review
  EVENT_NOT_PENDING_OR_FORBIDDEN: {
    status: 404,
    message:
      "Event not found, not pending, or not accessible to your department.",
  },

  // Issues
  ISSUE_NOT_FOUND: { status: 404, message: "Issue not found." },
  ISSUE_FORBIDDEN: {
    status: 403,
    message: "You do not have access to this issue action.",
  },
  ISSUE_RECIPIENT_INVALID: {
    status: 400,
    message: "Please choose a valid recipient from your department or a principal.",
  },
  ISSUE_SENDER_DEPARTMENT_MISSING: {
    status: 403,
    message: "Your account has no department assigned.",
  },
  ISSUE_CLOSED: {
    status: 409,
    message: "This issue is closed and can no longer be changed.",
  },
  ISSUE_RESPONSE_EMPTY: {
    status: 400,
    message: "Please enter a reply before sending it.",
  },
  ISSUE_RESOLUTION_FORBIDDEN: {
    status: 403,
    message: "Only the recipient can resolve or reject this issue.",
  },
};

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Errors that already carry a status (e.g. StaffCreationError).
  const withStatus = err as Error & { statusCode?: number };
  if (typeof withStatus.statusCode === "number") {
    return res.status(withStatus.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues,
    });
  }

  // Known error codes.
  const known = KNOWN_ERRORS[err.message];
  if (known) {
    if (known.status === 503 && !res.getHeader("Retry-After")) {
      res.setHeader("Retry-After", "5");
    }
    return res.status(known.status).json({
      success: false,
      message: known.message,
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;