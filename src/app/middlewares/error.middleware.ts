import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import type { Error as MongooseError } from "mongoose";
import multer from "multer";
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

  if (error instanceof multer.MulterError) {
    const multerMessages: Record<string, string> = {
      LIMIT_UNEXPECTED_FILE:
        "Uploading multiple files in a single-file field.",
      LIMIT_FILE_SIZE: "File is too large. Please upload a smaller file.",
      LIMIT_FILE_COUNT: "Too many files uploaded at once.",
      LIMIT_FIELD_COUNT: "Too many form fields in the request.",
      LIMIT_FIELD_KEY: "Form field name is too long.",
      LIMIT_FIELD_VALUE: "Form field value is too long.",
      LIMIT_PART_COUNT: "Too many parts in the multipart request.",
    };

    sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: multerMessages[error.code] ?? `File upload error: ${error.message}`,
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
