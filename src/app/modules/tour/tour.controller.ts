import status from "http-status";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../helpers/cloudinary/index.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { TourServices } from "./tour.service.js";

const createTour = catchAsync(async (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  let uploadedImages: string[] = [];

  if (files.length) {
    uploadedImages = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, { filename: file.originalname }),
      ),
    );
    req.body.images = uploadedImages;
  }

  try {
    const result = await TourServices.createTourIntoDB(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Tour created successfully",
      data: result,
    });
  } catch (error) {
    if (uploadedImages.length) {
      await Promise.allSettled(uploadedImages.map(deleteFromCloudinary));
    }

    throw error;
  }
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
  let uploadedImages: string[] = [];

  if (files.length) {
    uploadedImages = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, { filename: file.originalname }),
      ),
    );
  }

  try {
    const result = await TourServices.updateTourIntoDB(
      id as string,
      req.body,
      uploadedImages,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Tour updated successfully",
      data: result,
    });
  } catch (error) {
    if (uploadedImages.length) {
      await Promise.allSettled(uploadedImages.map(deleteFromCloudinary));
    }

    throw error;
  }
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
