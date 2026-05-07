import status from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { TourTypeServices } from "./tourType.service.js";

const createTourType = catchAsync(async (req, res) => {
  const tourType = await TourTypeServices.createTourTypeIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Tour type created successfully",
    data: tourType,
  });
});

const getAllTourTypes = catchAsync(async (req, res) => {
  const result = await TourTypeServices.getAllTourTypesFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

export const TourTypeControllers = {
  createTourType,
  getAllTourTypes,
};
