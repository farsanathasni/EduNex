import type { Request, Response, NextFunction } from "express";

// Known error codes thrown by the services -> HTTP status and message.
const KNOWN_ERRORS: Record<string, { status: number; message: string }> = {
  // Auth
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },

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

  // Known error codes.
  const known = KNOWN_ERRORS[err.message];
  if (known) {
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