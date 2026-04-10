import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVars } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  /* eslint-disable-next-line no-console */
  console.error(error.stack);

  const isDevelopment = envVars.NODE_ENV === "development";

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if ("code" in error && (error as { code: number }).code === 11000) {
    res.status(status.CONFLICT).json({
      success: false,
      message: "Duplicate entry — record already exists",
    });
    return;
  }

  res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: isDevelopment
      ? error.message || "Internal server error from global handler"
      : "Internal server error",
    stack: isDevelopment ? error.stack : undefined,
  });
};

export default errorHandler;
