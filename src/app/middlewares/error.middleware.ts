import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import * as z from "zod";

import { envVars } from "../config/env.js";
import { AppError } from "../errors/app.error.js";
import sendResponse from "../utils/sendResponse.js";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isDevelopment = envVars.NODE_ENV === "development";

  if (error instanceof z.ZodError) {
    sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Zod Error",
      errorSources: error.issues.map((issue) => ({
        path: issue.path.reverse().join(" inside ") || "unknown",
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    sendResponse(res, {
      statusCode: error.statusCode,
      success: false,
      message: error.message,
    });

    return;
  }

  if (error instanceof jwt.TokenExpiredError) {
    sendResponse(res, {
      statusCode: status.UNAUTHORIZED,
      success: false,
      message: "Access token has expired",
    });
    return;
  }

  if (error instanceof jwt.JsonWebTokenError) {
    sendResponse(res, {
      statusCode: status.UNAUTHORIZED,
      success: false,
      message: "Invalid access token",
    });
    return;
  }

  if ("code" in error && (error as { code: number }).code === 11000) {
    const duplicateValue =
      Object.values(
        (
          error as unknown as {
            errorResponse: { keyValue: Record<string, unknown> };
          }
        ).errorResponse?.keyValue ?? {},
      )[0] ?? "value";

    sendResponse(res, {
      statusCode: status.CONFLICT,
      success: false,
      message: `Duplicate entry - ${duplicateValue} already exists`,
    });
    return;
  } else if (error.name === "CastError") {
    sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Invalid ID format",
    });
    return;
  }

  sendResponse(res, {
    statusCode: status.INTERNAL_SERVER_ERROR,
    success: false,
    message: error.message || "Internal server error",
    stack: isDevelopment ? error.stack : undefined,
  });
};

export default errorHandler;
