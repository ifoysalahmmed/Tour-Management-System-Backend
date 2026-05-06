import status from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { DivisionService } from "./division.service.js";

const createDivision = catchAsync(async (req, res) => {
  const result = await DivisionService.createDivisionIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Division created successfully",
    data: result,
  });
});

const getAllDivisions = catchAsync(async (req, res) => {
  const result = await DivisionService.getAllDivisionsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Divisions retrieved successfully",
    data: result,
  });
});

export const DivisionControllers = {
  createDivision,
  getAllDivisions,
};
