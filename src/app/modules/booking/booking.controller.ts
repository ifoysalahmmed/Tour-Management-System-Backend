import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
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

export const BookingControllers = {
  createBooking,
};
