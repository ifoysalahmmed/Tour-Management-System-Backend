import type { Types } from "mongoose";

export enum BookingStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Cancelled = "CANCELLED",
  Failed = "FAILED",
}

export interface IBooking {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  guide?: Types.ObjectId;
  guestCount: number;
  notes?: string;
  payment?: Types.ObjectId;
  bookingStatus: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IBookingCreate = Omit<
  IBooking,
  "guide" | "payment" | "bookingStatus"
>;
