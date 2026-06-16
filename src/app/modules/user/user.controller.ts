import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../helpers/cloudinary/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserServices } from "./user.service.js";

const createUser = catchAsync(async (req, res) => {
  let uploadedPicture: string | undefined;

  if (req.file) {
    uploadedPicture = await uploadToCloudinary(req.file.buffer, {
      width: 250,
      height: 250,
      filename: req.file.originalname,
    });
    req.body.picture = uploadedPicture;
  }

  try {
    const result = await UserServices.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    if (uploadedPicture) {
      await deleteFromCloudinary(uploadedPicture);
    }

    throw error;
  }
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

const getMyProfile = catchAsync(async (req, res) => {
  const decodedToken = req.user as JwtPayload;
  const result = await UserServices.getUserByEmailFromDB(
    decodedToken.email as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile information retrieved successfully",
    data: result,
  });
});

const getAUser = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await UserServices.getUserByEmailFromDB(email as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const decodedToken = req.user as JwtPayload;
  let uploadedPicture: string | undefined;

  if (req.file) {
    uploadedPicture = await uploadToCloudinary(req.file.buffer, {
      width: 250,
      height: 250,
      filename: req.file.originalname,
    });
    updatedData.picture = uploadedPicture;
  }

  try {
    const result = await UserServices.updateUserIntoDB(
      id as string,
      updatedData,
      decodedToken,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    if (uploadedPicture) {
      await deleteFromCloudinary(uploadedPicture);
    }

    throw error;
  }
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getMyProfile,
  getAUser,
  updateUser,
};
