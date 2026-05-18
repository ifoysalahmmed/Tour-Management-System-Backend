import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserServices } from "./user.service.js";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    meta: result.meta,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const decodedToken = req.user as JwtPayload;

  const result = await UserServices.updateUserIntoDB(
    id as string,
    updateData,
    decodedToken,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
};
