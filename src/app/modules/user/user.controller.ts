import type { Request, Response } from "express";
import status from "http-status";
import { UserServices } from "./user.service.js";

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body as { name: string; email: string };

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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(status.CONFLICT).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    /* eslint-disable-next-line no-console */
    console.error("Error creating user:", error);

    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const UserControllers = {
  createUser,
};
