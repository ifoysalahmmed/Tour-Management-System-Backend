import type { Request, Response } from "express";
import status from "http-status";
import sendResponse from "../utils/sendResponse.js";

const notFound = (_req: Request, res: Response): void => {
  sendResponse(res, {
    statusCode: status.NOT_FOUND,
    success: false,
    message: "Route not found",
  });
};

export default notFound;
