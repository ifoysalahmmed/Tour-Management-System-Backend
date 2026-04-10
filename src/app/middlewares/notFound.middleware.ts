import type { Request, Response } from "express";
import status from "http-status";

const notFound = (_req: Request, res: Response): void => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Route not found",
  });
};

export default notFound;
