import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserServices } from "./user.service.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

const createUser = catchAsync(async (_req, res) => {
  const { name, email } = _req.body as { name: string; email: string };

  if (!name || !email) {
    sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: true,
      message: "Name and email are required",
    });
    return;
  }

  const result = await UserServices.createUserIntoDB({ name, email });

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (_req, res) => {
  const users = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
};
