import status from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { StatsServices } from "./stats.service.js";

const getBookingStats = catchAsync(async (_req, res) => {
  const result = await StatsServices.getBookingStatsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Booking stats retrieved successfully",
    data: result,
  });
});

const getPaymentStats = catchAsync(async (_req, res) => {
  const result = await StatsServices.getPaymentStatsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment stats retrieved successfully",
    data: result,
  });
});

const getTourStats = catchAsync(async (_req, res) => {
  const result = await StatsServices.getTourStatsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour stats retrieved successfully",
    data: result,
  });
});

const getUserStats = catchAsync(async (_req, res) => {
  const result = await StatsServices.getUserStatsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User stats retrieved successfully",
    data: result,
  });
});

export const StatsControllers = {
  getBookingStats,
  getPaymentStats,
  getTourStats,
  getUserStats,
};
