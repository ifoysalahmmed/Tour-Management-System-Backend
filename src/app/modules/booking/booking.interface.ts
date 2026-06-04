// User -> Booking -> userId, tourId, guideId?, paymentId?, paymentStatus, bookingDate, bookingStatus, guestNo, totalAmount, notes?

// Flow: User -> Booking (pending) -> Payment (unpaid) -> SSLCommerz -> Booking update = confirmed -> Payment update = paid

import type { Types } from "mongoose";

export enum BookingStatus {
  Pending = "PENDING",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
  Failed = "FAILED",
}

export interface IBook {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  payment?: Types.ObjectId;
  guestCount: number;
  status: BookingStatus;
}
