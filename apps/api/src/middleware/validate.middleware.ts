
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, type ZodType } from "zod";

const validate = (
  schema: ZodType,
  source: "body" | "query" | "params" = "body"
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);

      if (source === "body") {
        req.body = parsed;
      } else if (source === "params") {
        Object.assign(req.params, parsed);
      }

      // Do not assign to req.query.
      // Express exposes req.query through a getter.

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues,
        });
        return;
      }

      next(error);
    }
  };
};

export default validate;
