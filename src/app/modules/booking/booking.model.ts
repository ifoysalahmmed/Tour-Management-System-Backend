import { model, Schema } from "mongoose";

import { BookingStatus, type IBooking } from "./booking.interface.js";

const bookingSchema = new Schema<IBooking>(
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
      ref: "User",
    },
    guestCount: {
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
    bookingStatus: {
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

export const BookingModel = model<IBooking>("Booking", bookingSchema);
