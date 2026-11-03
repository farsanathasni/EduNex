import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

const validate = (
  schema: ZodSchema,
  property: "body" | "params" | "query",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req[property] = result.data as never;

    next();
  };
};

export default validate;