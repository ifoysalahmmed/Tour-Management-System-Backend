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

export const TourTypeControllers = {
  createTourType,
};
