import type { Request, Response } from "express";
import { UserModel } from "./user.model.js";
import status from "http-status";

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

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(status.CONFLICT).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const newUser = await UserModel.create({ name, email });

    res.status(status.CREATED).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
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
