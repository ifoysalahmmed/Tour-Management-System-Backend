import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import type { Error as MongooseError } from "mongoose";
import * as z from "zod";

import { envVars } from "../config/env.js";
import { AppError } from "../errors/app.error.js";
import {
  handleDuplicateValueError,
  handleValidationError,
} from "../errors/mongoose.error.js";
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
      message: "Request validation failed",
      errorSources: error.issues.map((issue) => ({
        path: issue.path.reverse().join(" inside ") || "unknown",
        message: issue.message,
      })),
    });
    return;
  }

  if (error.name === "ValidationError") {
    handleValidationError(res, error as MongooseError.ValidationError);
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
      message: "Access token has expired. Please log in again.",
    });
    return;
  }

  if (error instanceof jwt.JsonWebTokenError) {
    sendResponse(res, {
      statusCode: status.UNAUTHORIZED,
      success: false,
      message: "The provided access token is invalid.",
    });
    return;
  }

  if ("code" in error && (error as { code: number }).code === 11000) {
    handleDuplicateValueError(res, error);
    return;
  }

  if (error.name === "CastError") {
    sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Invalid resource ID format",
    });
    return;
  }

  sendResponse(res, {
    statusCode: status.INTERNAL_SERVER_ERROR,
    success: false,
    message: error.message || "An unexpected internal server error occurred",
    stack: isDevelopment ? error.stack : undefined,
  });
};

export default errorHandler;
