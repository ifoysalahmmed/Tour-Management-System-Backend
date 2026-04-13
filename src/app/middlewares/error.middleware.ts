import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVars } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import sendResponse from "../utils/sendResponse.js";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  /* eslint-disable-next-line no-console */
  // console.error(error.stack);

  const isDevelopment = envVars.NODE_ENV === "development";

  if (error instanceof AppError) {
    sendResponse(res, {
      statusCode: error.statusCode,
      success: false,
      message: error.message,
    });

    return;
  }

  if ("code" in error && (error as { code: number }).code === 11000) {
    sendResponse(res, {
      statusCode: status.CONFLICT,
      success: false,
      message: "Duplicate entry — record already exists",
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
