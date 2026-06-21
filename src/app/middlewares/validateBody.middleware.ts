import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import * as z from "zod";

import { AppError } from "../errors/app.error.js";

const validateBody =
  (schema: z.ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.body === undefined || req.body === null) {
        return next(
          new AppError(status.BAD_REQUEST, "Request body is required"),
        );
      }

      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(error);
      } else {
        next(
          new AppError(
            status.BAD_REQUEST,
            "The request body contains invalid data",
          ),
        );
      }
    }
  };

export default validateBody;
