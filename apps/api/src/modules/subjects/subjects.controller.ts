import type { RequestHandler } from "express";

import type { Access } from "../rbac/rbac.access.js";
import {
  assignFaculty,
  createSubject,
  deleteSubject,
  getScopeDepartmentId,
  listAvailableFaculty,
  listSubjectFaculty,
  listSubjects,
  removeFaculty,
  resolveSubjectScope,
  updateSubject,
} from "./subjects.service.js";

function getAccess(res: Parameters<RequestHandler>[1]): Access {
  const access = res.locals.access as Access | undefined;

  if (!access) {
    throw new Error("UNAUTHORIZED");
  }

  return access;
}

// Pagination and search values, read the same way as the teacher module.
const readListQuery = (query: Record<string, unknown>) => ({
  search: typeof query.search === "string" ? query.search.trim() : "",
  semester: query.semester ? Number(query.semester) : undefined,
  departmentId: query.departmentId ? Number(query.departmentId) : undefined,
  page: query.page === undefined ? 1 : Number(query.page),
  limit: query.limit === undefined ? 10 : Number(query.limit),
});

export const listSubjectsController: RequestHandler =
  async (req, res, next) => {
    try {
      const query = readListQuery(req.query);
      const scope = await resolveSubjectScope(
        getAccess(res),
        query.departmentId,
      );
      const result = await listSubjects(getScopeDepartmentId(scope), query);

      res.status(200).json({
        success: true,
        data: result.subjects,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

export const createSubjectController: RequestHandler =
  async (req, res, next) => {
    try {
      const scope = await resolveSubjectScope(
        getAccess(res),
        req.body.departmentId,
      );
      const data = await createSubject(req.body, getScopeDepartmentId(scope));

      res.status(201).json({
        success: true,
        message: "Subject created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const updateSubjectController: RequestHandler =
  async (req, res, next) => {
    try {
      const scope = await resolveSubjectScope(getAccess(res));
      const data = await updateSubject(
        Number(req.params.id),
        req.body,
        getScopeDepartmentId(scope),
      );

      res.status(200).json({
        success: true,
        message: "Subject updated successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteSubjectController: RequestHandler =
  async (req, res, next) => {
    try {
      const scope = await resolveSubjectScope(getAccess(res));
      const data = await deleteSubject(
        Number(req.params.id),
        getScopeDepartmentId(scope),
      );

      res.status(200).json({
        success: true,
        message: "Subject deleted successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const listSubjectFacultyController: RequestHandler =
  async (req, res, next) => {
    try {
      const scope = await resolveSubjectScope(getAccess(res));
      const { search, page, limit } = readListQuery(req.query);
      const result = await listSubjectFaculty(
        Number(req.params.id),
        getScopeDepartmentId(scope),
        { search, page, limit },
      );

      res.status(200).json({
        success: true,
        data: result.faculty,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

export const listAvailableFacultyController: RequestHandler =
  async (req, res, next) => {
    try {
      const scope = await resolveSubjectScope(getAccess(res));
      const { search, page, limit } = readListQuery(req.query);
      const result = await listAvailableFaculty(
        Number(req.params.id),
        getScopeDepartmentId(scope),
        { search, page, limit },
      );

      res.status(200).json({
        success: true,
        data: result.faculty,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

export const assignFacultyController: RequestHandler =
  async (req, res, next) => {
    try {
      const scope = await resolveSubjectScope(getAccess(res));
      const data = await assignFaculty(
        Number(req.params.id),
        req.body.staffId,
        getScopeDepartmentId(scope),
      );

      res.status(201).json({
        success: true,
        message: "Faculty assigned successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const removeFacultyController: RequestHandler =
  async (req, res, next) => {
    try {
      const scope = await resolveSubjectScope(getAccess(res));
      const data = await removeFaculty(
        Number(req.params.id),
        String(req.params.staffId),
        getScopeDepartmentId(scope),
      );

      res.status(200).json({
        success: true,
        message: "Faculty removed successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
