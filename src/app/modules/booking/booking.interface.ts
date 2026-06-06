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
  guide?: Types.ObjectId;
  guestCount: number;
  totalAmount: number;
  notes?: string;
  payment?: Types.ObjectId;
  status: BookingStatus;
}
