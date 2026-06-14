import status from "http-status";

import { uploadFilesWithRollback } from "../../helpers/cloudinary/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { DivisionServices } from "./division.service.js";

const createDivision = catchAsync(async (req, res) => {
  const create = async ([thumbnail]: string[]) => {
    if (thumbnail) req.body.thumbnail = thumbnail;
    return DivisionServices.createDivisionIntoDB(req.body);
  };

  const result = req.file
    ? await uploadFilesWithRollback(req.file, create)
    : await DivisionServices.createDivisionIntoDB(req.body);

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

  const update = async ([thumbnail]: string[]) => {
    if (thumbnail) req.body.thumbnail = thumbnail;
    return DivisionServices.updateDivisionIntoDB(id as string, req.body);
  };

  const result = req.file
    ? await uploadFilesWithRollback(req.file, update)
    : await DivisionServices.updateDivisionIntoDB(id as string, req.body);

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
