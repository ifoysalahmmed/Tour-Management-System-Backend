import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { TourModel } from "../tour/tour.model.js";
import { UserModel } from "../user/user.model.js";
import type { IBookingCreate } from "./booking.interface.js";
import { BookingModel } from "./booking.model.js";

const createBookingIntoDB = async (payload: IBookingCreate, userId: string) => {
  const [user, tour] = await Promise.all([
    UserModel.findById(userId).lean(),
    TourModel.findById(payload.tour).select("costFrom").lean(),
  ]);

  if (!user?.phone || !user?.address) {
    throw new AppError(
      status.BAD_REQUEST,
      "Please update your profile with phone and address before making a booking.",
    );
  }

  if (!tour) {
    throw new AppError(status.NOT_FOUND, "Invalid tour ID");
  }

  const bookingPayload = {
    ...payload,
    user: userId,
    totalAmount: tour.costFrom * payload.guestCount,
  };

  return await BookingModel.create(bookingPayload);
};

export const BookingServices = {
  createBookingIntoDB,
};
