import status from "http-status";
import type { Types } from "mongoose";

import { AppError } from "../../errors/app.error.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { generateTransactionId } from "../../utils/generateTransactionId.js";
import { PaymentStatus } from "../payment/payment.interface.js";
import { PaymentModel } from "../payment/payment.model.js";
import { TourModel } from "../tour/tour.model.js";
import { UserRole } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";
import { bookingSearchableFields } from "./booking.constant.js";
import { BookingStatus, type IBookingCreate } from "./booking.interface.js";
import { BookingModel } from "./booking.model.js";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service.js";

const createBookingIntoDB = async (payload: IBookingCreate, userId: string) => {
  const [user, tour] = await Promise.all([
    UserModel.findById(userId).select("name email phone address").lean(),
    TourModel.findById(payload.tour)
      .select("costFrom maxGuest startDate")
      .lean(),
  ]);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!user.phone || !user.address) {
    throw new AppError(
      status.BAD_REQUEST,
      "Please update your profile with phone and address before making a booking.",
    );
  }

  if (!tour) {
    throw new AppError(status.NOT_FOUND, "Invalid tour ID");
  }

  if (tour.startDate < new Date()) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot book a tour that has already started",
    );
  }

  if (tour.maxGuest && payload.guestCount > tour.maxGuest) {
    throw new AppError(
      status.BAD_REQUEST,
      `Guest count exceeds the maximum allowed (${tour.maxGuest})`,
    );
  }

  const transactionId = generateTransactionId();

  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    const bookingDocs = await BookingModel.create(
      [
        {
          ...payload,
          user: userId,
          bookingStatus: BookingStatus.Pending,
        },
      ],
      { session },
    );
    const booking = bookingDocs[0]!;

    const paymentDocs = await PaymentModel.create(
      [
        {
          booking: booking._id,
          transactionId,
          amount: tour.costFrom * booking.guestCount,
          status: PaymentStatus.Unpaid,
        },
      ],
      { session },
    );
    const payment = paymentDocs[0]!;

    const result = await BookingModel.findByIdAndUpdate(
      booking._id,
      { payment: payment._id },
      { returnDocument: "after", runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment", "transactionId amount currency status");

    const sslPayment = await SSLCommerzServices.initiatePayment({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      amount: payment.amount,
      currency: payment.currency,
      transactionId: payment.transactionId,
    });

    await session.commitTransaction();
    return {
      booking: result,
      payment: sslPayment.GatewayPageURL,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllBookingsFromDB = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(BookingModel.find(), query);

  const data = queryBuilder
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .select()
    .paginate()
    .populate("user tour");

  const [bookings, meta] = await Promise.all([
    data.modelQuery,
    queryBuilder.getMetaData(),
  ]);

  return {
    bookings,
    meta,
  };
};

const getUserBookingsFromDB = async (
  userId: string,
  query: Record<string, string>,
) => {
  const queryBuilder = new QueryBuilder(
    BookingModel.find({ user: userId }).select("-user"),
    query,
  );

  const data = queryBuilder
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .select()
    .paginate()
    .populate("tour");

  const [bookings, meta] = await Promise.all([
    data.modelQuery,
    queryBuilder.getMetaData(),
  ]);

  return {
    bookings,
    meta,
  };
};

const getBookingByIdFromDB = async (id: string) => {
  const booking = await BookingModel.findById(id).populate(
    "user tour guide payment",
  );

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  return booking;
};

const updateBookingStatusIntoDB = async (
  id: string,
  bookingStatus: BookingStatus,
) => {
  const booking = await BookingModel.findById(id).select("bookingStatus");

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  booking.bookingStatus = bookingStatus;

  return await booking.save();
};

const assignGuideIntoDB = async (
  bookingId: string,
  guideId: Types.ObjectId,
) => {
  const [booking, guide] = await Promise.all([
    BookingModel.findById(bookingId).select("bookingStatus guide"),
    UserModel.findById(guideId).select("role").lean(),
  ]);

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  if (!guide || guide.role !== UserRole.Guide) {
    throw new AppError(status.BAD_REQUEST, "Assigned user is not a guide");
  }

  if (booking.bookingStatus !== BookingStatus.Confirmed) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot assign a guide to a pending or cancelled or failed booking",
    );
  }

  booking.guide = guideId;

  return await booking.save();
};

export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getUserBookingsFromDB,
  getBookingByIdFromDB,
  updateBookingStatusIntoDB,
  assignGuideIntoDB,
};
