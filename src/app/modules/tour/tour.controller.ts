import status from "http-status";

import { uploadFilesWithRollback } from "../../helpers/cloudinary/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { TourServices } from "./tour.service.js";

const createTour = catchAsync(async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];

  const create = async (images: string[]) => {
    if (images.length) req.body.images = images;
    return TourServices.createTourIntoDB(req.body);
  };

  const result = files.length
    ? await uploadFilesWithRollback(files, create)
    : await TourServices.createTourIntoDB(req.body);

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
  const files = Array.isArray(req.files) ? req.files : [];

  const update = async (images: string[]) => {
    if (images.length) req.body.images = images;
    return TourServices.updateTourIntoDB(id as string, req.body);
  };

  const result = files.length
    ? await uploadFilesWithRollback(files, update)
    : await TourServices.updateTourIntoDB(id as string, req.body);

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
