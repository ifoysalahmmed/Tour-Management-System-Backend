import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { UserServices } from "./user.service.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";

const createUser = catchAsync(async (_req, res) => {
  const result = await UserServices.createUserIntoDB(_req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (_req, res) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    meta: result.total,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
};
