import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";
import status from "http-status";

const validateBody =
  (schema: z.ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues[0]?.message ?? "Invalid request body";
        next(new AppError(status.BAD_REQUEST, message));
      } else {
        next(new AppError(status.BAD_REQUEST, "Invalid request body"));
      }
    }
  };

export default validateBody;
