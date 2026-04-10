import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserServices } from "./user.service.js";

const createUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { name, email } = _req.body as { name: string; email: string };

    if (!name || !email) {
      res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Name and email are required",
      });
      return;
    }

    const result = await UserServices.createUserIntoDB({ name, email });

    res.status(status.CREATED).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    _next(error);
  }
};

export const UserControllers = {
  createUser,
};
