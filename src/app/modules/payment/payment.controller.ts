import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PaymentServices } from "./payment.service.js";

const initiatePayment = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const userId = (req.user as JwtPayload)?.id;

  const result = await PaymentServices.initiatePayment(
    bookingId as string,
    userId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

const paymentSucceeded = catchAsync(async (req, res) => {
  const query = req.query as Record<string, string>;
  const gatewayData = req.body as Record<string, string>;

  const result = await PaymentServices.paymentSucceeded(query, gatewayData);

  res.redirect(
    `${envVars.SSL.SUCCEEDED_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${result.amount}&currency=${result.currency}&status=success`,
  );
});

const paymentFailed = catchAsync(async (req, res) => {
  const query = req.query as Record<string, string>;

  const result = await PaymentServices.paymentFailed(query);

  res.redirect(
    `${envVars.SSL.FAILED_FRONTEND_URL}?transactionId=${result.transactionId}&message=${result.message}&status=failed`,
  );
});

const paymentCancelled = catchAsync(async (req, res) => {
  const query = req.query as Record<string, string>;

  const result = await PaymentServices.paymentCancelled(query);

  res.redirect(
    `${envVars.SSL.CANCELLED_FRONTEND_URL}?transactionId=${result.transactionId}&message=${result.message}&status=cancelled`,
  );
});

const getInvoiceDownloadUrl = catchAsync(async (req, res) => {
  const { paymentId } = req.params as { paymentId: string };
  const userId = (req.user as JwtPayload)?.id;

  const result = await PaymentServices.getInvoiceDownloadUrl(
    paymentId,
    userId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Invoice download URL retrieved successfully",
    data: result,
  });
});

export const PaymentControllers = {
  initiatePayment,
  paymentSucceeded,
  paymentFailed,
  paymentCancelled,
  getInvoiceDownloadUrl,
};
