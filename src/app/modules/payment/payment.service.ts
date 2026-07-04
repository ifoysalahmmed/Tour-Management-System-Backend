import status from "http-status";
import type { Types } from "mongoose";

import type { IInvoiceData } from "../../helpers/invoice/types.js";
import { AppError } from "../../errors/app.error.js";
import { uploadToCloudinary } from "../../helpers/cloudinary/index.js";
import { generateInvoicePDF } from "../../utils/invoice.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { BookingStatus } from "../booking/booking.interface.js";
import { BookingModel } from "../booking/booking.model.js";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service.js";
import { UserModel } from "../user/user.model.js";
import {
  CurrencyList,
  PaymentStatus,
  type IPayment,
} from "./payment.interface.js";
import { PaymentModel } from "./payment.model.js";
import { PaymentUtils } from "./payment.utils.js";

const initiatePayment = async (bookingId: string, userId: string) => {
  const [payment, user] = await Promise.all([
    PaymentModel.findOne({ booking: bookingId })
      .select("amount currency transactionId")
      .lean(),
    UserModel.findById(userId).select("name email phone address").lean(),
  ]);

  if (!payment) {
    throw new AppError(
      status.BAD_REQUEST,
      "No payment record found for the given booking ID",
    );
  }

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!user.phone || !user.address) {
    throw new AppError(
      status.BAD_REQUEST,
      "User profile is incomplete (missing phone or address)",
    );
  }

  try {
    const sslPayment = await SSLCommerzServices.initiatePayment({
      name: user.name,
      email: user.email,
      phone: user.phone!,
      address: user.address!,
      amount: payment.amount,
      currency: payment.currency,
      transactionId: payment.transactionId,
    });

    return {
      paymentUrl: sslPayment.GatewayPageURL,
    };
  } catch (error) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment gateway initialization failed",
    );
  }
};

const paymentSucceeded = async (
  query: Record<string, string>,
  gatewayData: Record<string, string>,
) => {
  const preCheck = await PaymentModel.findOne({
    transactionId: query.transactionId as string,
  })
    .select("status amount currency")
    .lean();

  if (!preCheck) {
    throw new AppError(
      status.NOT_FOUND,
      "Payment record not found for the given transaction ID",
    );
  }

  if (preCheck.status === PaymentStatus.Paid) {
    return {
      message: "Payment already processed",
      amount: preCheck.amount,
      currency: preCheck.currency,
    };
  }

  if (preCheck.status !== PaymentStatus.Unpaid) {
    throw new AppError(
      status.BAD_REQUEST,
      `Payment cannot be confirmed: current status is ${preCheck.status}`,
    );
  }

  let paymentId!: Types.ObjectId;
  let transactionId!: string;
  let amount!: number;
  let currency!: CurrencyList;
  let userEmail!: string;
  let userName!: string;
  let invoiceData!: IInvoiceData;

  const session = await BookingModel.startSession();
  try {
    session.startTransaction();

    const paymentUpdate: Partial<IPayment> = {
      status: PaymentStatus.Paid,
      paymentMethod: gatewayData.card_type || "N/A",
      paymentGateway: PaymentUtils.mapGatewayData(gatewayData),
    };

    const payment = await PaymentModel.findOneAndUpdate(
      {
        transactionId: query.transactionId as string,
        status: PaymentStatus.Unpaid,
      },
      paymentUpdate,
      { runValidators: true, session },
    ).lean();

    if (!payment) {
      throw new AppError(
        status.CONFLICT,
        "Payment status changed concurrently — duplicate webhook or race condition",
      );
    }

    paymentId = payment._id as Types.ObjectId;
    transactionId = payment.transactionId;
    amount = payment.amount;
    currency = payment.currency;

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      payment.booking,
      { bookingStatus: BookingStatus.Confirmed },
      { runValidators: true, session, returnDocument: "after" },
    )
      .populate<{ user: { name: string; email: string } }>("user", "name email")
      .populate<{ tour: { title: string } }>("tour", "title")
      .lean();

    if (!updatedBooking) {
      throw new AppError(status.NOT_FOUND, "Booking not found");
    }

    userEmail = updatedBooking.user.email;
    userName = updatedBooking.user.name;

    invoiceData = {
      transactionId: payment.transactionId,
      bookingDate: updatedBooking.createdAt,
      username: updatedBooking.user.name,
      tourTitle: updatedBooking.tour.title,
      guestCount: updatedBooking.guestCount,
      totalAmount: payment.amount,
    };

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  try {
    const pdfBuffer = await generateInvoicePDF(invoiceData);

    const invoiceUrl = await uploadToCloudinary(pdfBuffer, {
      filename: `invoice-${transactionId}.pdf`,
      resourceType: "raw",
    });

    await PaymentModel.findByIdAndUpdate(paymentId, {
      invoiceUrl,
      paidAt: new Date(),
    });

    await sendEmail({
      to: userEmail,
      subject: "Booking Invoice",
      text: `Dear ${userName},\n\nThank you for your booking. Please find your invoice attached.\n\nBest regards,\nTour Management Team`,
      template: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (invoiceError) {
    console.error("Post-payment invoice/email delivery failed:", invoiceError);
  }

  return {
    message: "Payment completed successfully and booking confirmed",
    amount,
    currency,
  };
};

const paymentFailed = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    const payment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId as string },
      { status: PaymentStatus.Failed },
      {
        runValidators: true,
        session,
      },
    );

    if (!payment) {
      throw new AppError(
        status.BAD_REQUEST,
        "Payment record not found for the given transaction ID",
      );
    }

    await BookingModel.findByIdAndUpdate(
      payment.booking,
      { bookingStatus: BookingStatus.Failed },
      {
        runValidators: true,
        session,
      },
    );

    await session.commitTransaction();
    return {
      message: "Payment failed. Please try again.",
      transactionId: payment.transactionId,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const paymentCancelled = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    const payment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId as string },
      { status: PaymentStatus.Cancelled },
      {
        runValidators: true,
        session,
      },
    );

    if (!payment) {
      throw new AppError(
        status.BAD_REQUEST,
        "Payment record not found for the given transaction ID",
      );
    }

    await BookingModel.findByIdAndUpdate(
      payment.booking,
      { bookingStatus: BookingStatus.Cancelled },
      {
        runValidators: true,
        session,
      },
    );

    await session.commitTransaction();
    return {
      message: "Payment was cancelled.",
      transactionId: payment.transactionId,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getInvoiceDownloadUrl = async (paymentId: string, userId: string) => {
  const payment = await PaymentModel.findById(paymentId)
    .select("invoiceUrl booking")
    .populate<{ booking: { user: Types.ObjectId } }>("booking", "user");

  if (!payment) {
    throw new AppError(
      status.NOT_FOUND,
      "Payment record not found for the given payment ID",
    );
  }

  if (!payment.booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found for this payment");
  }

  if (payment.booking.user.toString() !== userId) {
    throw new AppError(
      status.FORBIDDEN,
      "You are not authorized to access this invoice",
    );
  }

  if (!payment.invoiceUrl) {
    throw new AppError(
      status.NOT_FOUND,
      "Invoice not generated for this payment yet",
    );
  }

  return {
    downloadUrl: payment.invoiceUrl,
  };
};

export const PaymentServices = {
  initiatePayment,
  paymentSucceeded,
  paymentFailed,
  paymentCancelled,
  getInvoiceDownloadUrl,
};
