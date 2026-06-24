import status from "http-status";

import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { OTPServices } from "./otp.service.js";

const sendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;

  await OTPServices.sendOTP(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OTP sent to email successfully",
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  await OTPServices.verifyOTP(email, otp);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OTP verified successfully",
  });
});

export const OTPControllers = {
  sendOTP,
  verifyOTP,
};
