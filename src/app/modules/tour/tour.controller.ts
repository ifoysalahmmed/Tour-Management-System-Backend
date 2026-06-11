import status from "http-status";

import { uploadToCloudinary } from "../../config/cloudinary.config.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { TourServices } from "./tour.service.js";

const createTour = catchAsync(async (req, res) => {
  if (Array.isArray(req.files) && req.files.length > 0) {
    req.body.images = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer)),
    );
  }

  const result = await TourServices.createTourIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsync(async (req, res) => {
  const result = await TourServices.getAllToursFromDB(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tours retrieved successfully",
    data: result.tours,
    meta: result.meta,
  });
});

const getATour = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await TourServices.getTourBySlugFromDB(slug as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour retrieved successfully",
    data: result,
  });
});

const updateTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (Array.isArray(req.files) && req.files.length > 0) {
    updateData.images = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer)),
    );
  }

  const result = await TourServices.updateTourIntoDB(id as string, updateData);

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
  getATour,
  updateTour,
  deleteTour,
};
