import status from "http-status";

import { uploadToCloudinary } from "../../config/cloudinary.config.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { DivisionServices } from "./division.service.js";

const createDivision = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.thumbnail = await uploadToCloudinary(req.file.buffer);
  }

  const result = await DivisionServices.createDivisionIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Division created successfully",
    data: result,
  });
});

const getAllDivisions = catchAsync(async (_req, res) => {
  const result = await DivisionServices.getAllDivisionsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Divisions retrieved successfully",
    data: result,
  });
});

const getADivision = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await DivisionServices.getDivisionBySlugFromDB(slug as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Division retrieved successfully",
    data: result,
  });
});

const updateDivision = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (req.file) {
    updateData.thumbnail = await uploadToCloudinary(req.file.buffer);
  }

  const result = await DivisionServices.updateDivisionIntoDB(
    id as string,
    updateData,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Division updated successfully",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req, res) => {
  const { id } = req.params;

  await DivisionServices.deleteDivisionFromDB(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Division deleted successfully",
  });
});

export const DivisionControllers = {
  createDivision,
  getAllDivisions,
  getADivision,
  updateDivision,
  deleteDivision,
};
