import status from "http-status";

import type { IInvoiceData } from "../../helpers/invoice/types.js";
import { AppError } from "../../errors/app.error.js";
import { generateInvoicePDF } from "../../utils/invoice.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { BookingStatus } from "../booking/booking.interface.js";
import { BookingModel } from "../booking/booking.model.js";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service.js";
import { UserModel } from "../user/user.model.js";
import { PaymentStatus } from "./payment.interface.js";
import { PaymentModel } from "./payment.model.js";

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

const paymentSucceeded = async (query: Record<string, string>) => {
  const session = await BookingModel.startSession();
  session.startTransaction();

  try {
    const payment = await PaymentModel.findOneAndUpdate(
      { transactionId: query.transactionId as string },
      { status: PaymentStatus.Paid },
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

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      payment.booking,
      { bookingStatus: BookingStatus.Confirmed },
      {
        runValidators: true,
        session,
        returnDocument: "after",
      },
    )
      .populate<{ user: { name: string; email: string } }>("user", "name email")
      .populate<{ tour: { title: string } }>("tour", "title")
      .lean();

    if (!updatedBooking) {
      throw new AppError(status.NOT_FOUND, "Booking not found");
    }

    const invoiceData: IInvoiceData = {
      transactionId: payment.transactionId,
      bookingDate: updatedBooking.createdAt,
      username: updatedBooking.user.name,
      tourTitle: updatedBooking.tour.title,
      guestCount: updatedBooking.guestCount,
      totalAmount: payment.amount,
    };

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    await sendEmail({
      to: updatedBooking.user.email,
      subject: "Booking Invoice",
      text: `Dear ${updatedBooking.user.name},\n\nThank you for your booking. Please find your invoice attached.\n\nBest regards,\nTour Management Team`,
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

    await session.commitTransaction();
    return {
      message: "Payment completed successfully and booking confirmed",
      amount: payment.amount,
      currency: payment.currency,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
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

export const PaymentServices = {
  initiatePayment,
  paymentSucceeded,
  paymentFailed,
  paymentCancelled,
};
