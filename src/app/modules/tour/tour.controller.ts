import status from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { TourServices } from "./tour.service.js";

const createTour = catchAsync(async (req, res) => {
  const result = await TourServices.createTourIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req, res) => {
  const { page, limit, sortBy, sortOrder } = req.query;

  const result = await TourServices.getAllToursFromDB({
    ...(typeof page === "string" && { page: Number(page) }),
    ...(typeof limit === "string" && { limit: Number(limit) }),
    ...(typeof sortBy === "string" && { sortBy }),
    ...((sortOrder === "asc" || sortOrder === "desc") && { sortOrder }),
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tours retrieved successfully",
    data: result.tours,
    meta: result.meta,
  });
});

const updateTour = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TourServices.updateTourIntoDB(id as string, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req, res) => {
  const { id } = req.params;

  await TourServices.deleteTourFromDB(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour deleted successfully",
  });
});

export const TourControllers = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
};
