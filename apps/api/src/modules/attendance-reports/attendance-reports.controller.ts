import type { RequestHandler } from "express";

import type { Access } from "../rbac/rbac.access.js";
import {
  getOverview,
  getStudentReport,
  getStudents,
  getSubjectAverages,
} from "./attendance-reports.service.js";
import {
  overviewQuerySchema,
  studentParamsSchema,
  studentsQuerySchema,
  subjectsQuerySchema,
} from "./attendance-reports.validation.js";

function getAccess(res: Parameters<RequestHandler>[1]): Access {
  const access = res.locals.access as Access | undefined;
  if (!access) throw new Error("UNAUTHORIZED");
  return access;
}

export const getOverviewController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getOverview(
      getAccess(res),
      overviewQuerySchema.parse(req.query),
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getStudentsController: RequestHandler = async (req, res, next) => {
  try {
    const result = await getStudents(
      getAccess(res),
      studentsQuerySchema.parse(req.query),
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

export const getStudentReportController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const { studentId } = studentParamsSchema.parse(req.params);
    const data = await getStudentReport(
      getAccess(res),
      studentId,
      overviewQuerySchema.parse(req.query),
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSubjectsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const data = await getSubjectAverages(
      getAccess(res),
      subjectsQuerySchema.parse(req.query),
    );
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
