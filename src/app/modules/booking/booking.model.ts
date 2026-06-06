import { model, Schema } from "mongoose";

import { BookingStatus, type IBook } from "./booking.interface.js";

const bookingSchema = new Schema<IBook>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for booking"],
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Tour is required for booking"],
    },
    guide: {
      type: Schema.Types.ObjectId,
      ref: "Guide",
    },
    guestCount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const BookingModel = model<IBook>("Booking", bookingSchema);
