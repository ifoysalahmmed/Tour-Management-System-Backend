import type { Types } from "mongoose";

export enum PaymentStatus {
  Unpaid = "UNPAID",
  Paid = "PAID",
  Refunded = "REFUNDED",
  Cancelled = "CANCELLED",
  Failed = "FAILED",
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGateway?: any;
  invoiceUrl?: string;
  status: PaymentStatus;
}
