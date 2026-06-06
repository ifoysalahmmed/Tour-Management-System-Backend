import { model, Schema } from "mongoose";

import {
  CurrencyList,
  PaymentStatus,
  type IPayment,
} from "./payment.interface.js";

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required for payment"],
      unique: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: Object.values(CurrencyList),
      default: CurrencyList.BDT,
    },
    paymentMethod: {
      type: String,
    },
    paymentGateway: {
      type: Schema.Types.Mixed,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Unpaid,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const PaymentModel = model<IPayment>("Payment", paymentSchema);
