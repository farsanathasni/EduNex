import type { RequestHandler } from "express";

import {
  getAttendanceRoster,
  getMySubjects,
  getStudentAttendanceSummary,
  saveAttendance,
} from "./class-attendance.service.js";

function getUserId(res: Parameters<RequestHandler>[1]): string {
  const userId = res.locals.user?.id as string | undefined;

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}

// Faculty: subjects I teach.
export const getMySubjectsController: RequestHandler =
  async (req, res, next) => {
    try {
      const data = await getMySubjects(getUserId(res));

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

// Faculty: students of a class with saved (or default) statuses.
export const getAttendanceRosterController: RequestHandler =
  async (req, res, next) => {
    try {
      const subjectId = Number(req.query.subjectId);
      const date = String(req.query.date);
      const period =
        req.query.period === undefined ? 1 : Number(req.query.period);

      const data = await getAttendanceRoster(
        getUserId(res),
        subjectId,
        date,
        period,
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

// Faculty: save attendance for one class session.
export const saveAttendanceController: RequestHandler =
  async (req, res, next) => {
    try {
      const data = await saveAttendance(getUserId(res), req.body);

      res.status(200).json({
        success: true,
        message: "Attendance saved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

// Student: my attendance per subject and overall.
export const getMyAttendanceSummaryController: RequestHandler =
  async (req, res, next) => {
    try {
      const data = await getStudentAttendanceSummary(getUserId(res));

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };