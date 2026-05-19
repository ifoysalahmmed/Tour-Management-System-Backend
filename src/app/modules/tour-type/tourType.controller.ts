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
  const result = await TourTypeServices.getAllTourTypesFromDB(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour types retrieved successfully",
    data: result.tourTypes,
    meta: result.meta,
  });
});

const getTourTypeById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TourTypeServices.getTourTypeByIdFromDB(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour type retrieved successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tourType = await TourTypeServices.updateTourTypeIntoDB(
    id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour type updated successfully",
    data: tourType,
  });
});

const deleteTourType = catchAsync(async (req, res) => {
  const { id } = req.params;
  await TourTypeServices.deleteTourTypeFromDB(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour type deleted successfully",
  });
});

export const TourTypeControllers = {
  createTourType,
  getAllTourTypes,
  getTourTypeById,
  updateTourType,
  deleteTourType,
};
