import type { Types } from "mongoose";

export enum CurrencyList {
  BDT = "BDT",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

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
  currency: CurrencyList;
  paymentMethod?: string;
  paymentGateway?: Record<string, unknown>;
  invoiceUrl?: string;
  paidAt?: Date;
  status: PaymentStatus;
}
