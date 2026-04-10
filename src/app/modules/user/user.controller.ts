import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserServices } from "./user.service.js";
import catchAsync from "../../utils/catchAsync.js";

const createUser = catchAsync(async (_req, res) => {
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
});

const getAllUsers = catchAsync(async (_req, res) => {
  const users = await UserServices.getAllUsersFromDB();

  res.status(status.OK).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
};
