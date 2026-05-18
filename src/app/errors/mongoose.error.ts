import type { Response } from "express";
import status from "http-status";
import type { Error as MongooseError } from "mongoose";

import sendResponse from "../utils/sendResponse.js";

export const handleDuplicateValueError = (res: Response, error: Error) => {
  const duplicateValue =
    Object.values(
      (
        error as unknown as {
          errorResponse: {
            keyValue: Record<string, unknown>;
          };
        }
      ).errorResponse?.keyValue ?? {},
    )[0] ?? "value";

  sendResponse(res, {
    statusCode: status.CONFLICT,
    success: false,
    message: `Duplicate value detected: ${duplicateValue} already exists`,
  });
};

export const handleValidationError = (
  res: Response,
  error: MongooseError.ValidationError,
) => {
  const errorSources = Object.values(error.errors).map((err) => ({
    path: err.path,
    message:
      err.kind === "ObjectId"
        ? `Invalid ObjectId ${err.value} provided for field ${err.path}`
        : `Invalid value ${err.value} provided for field ${err.path}`,
  }));

  sendResponse(res, {
    statusCode: status.BAD_REQUEST,
    success: false,
    message: "Validation failed",
    errorSources,
  });
};
