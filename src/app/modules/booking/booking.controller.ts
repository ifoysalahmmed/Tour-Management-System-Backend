import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import type { BookingStatus } from "./booking.interface.js";
import { BookingServices } from "./booking.service.js";

const createBooking = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;
  const payload = req.body;

  const booking = await BookingServices.createBookingIntoDB(payload, userId);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingsFromDB(
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: result.bookings,
    meta: result.meta,
  });
});

const getUserBookings = catchAsync(async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;
  const result = await BookingServices.getUserBookingsFromDB(
    userId,
    req.query as Record<string, string>,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Your bookings retrieved successfully",
    data: result.bookings,
    meta: result.meta,
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const booking = await BookingServices.getBookingByIdFromDB(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Booking retrieved successfully",
    data: booking,
  });
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status: bookingStatus } = req.body;

  const updatedBooking = await BookingServices.updateBookingStatusIntoDB(
    id as string,
    bookingStatus as BookingStatus,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Booking status updated successfully",
    data: updatedBooking,
  });
});

const assignGuide = catchAsync(async (req, res) => {
  const { id: bookingId } = req.params;
  const { guide: guideId } = req.body;

  const assignedGuide = await BookingServices.assignGuideIntoDB(
    bookingId as string,
    guideId as Types.ObjectId,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Guide assigned to booking successfully",
    data: assignedGuide,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  assignGuide,
};
