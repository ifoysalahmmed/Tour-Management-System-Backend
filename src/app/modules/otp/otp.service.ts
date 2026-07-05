import crypto from "crypto";
import status from "http-status";

import { redisClient } from "../../config/redis.config.js";
import { AppError } from "../../errors/app.error.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { UserModel } from "../user/user.model.js";

const OTP_EXPIRATION_MS = 2 * 60 * 1000;
const OTP_RESEND_DELAY_MS = 5 * 60 * 1000;

const generateOTP = (length = 6) => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

const sendOTP = async (email: string) => {
  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    throw new AppError(status.NOT_FOUND, "No account found with this email");
  }

  if (user.isVerified) {
    throw new AppError(status.BAD_REQUEST, "This account is already verified");
  }

  const rateLimitKey = `otp:ratelimit:${email}`;
  const redisKey = `otp:${email}`;

  const isRateLimited = await redisClient.exists(rateLimitKey);
  if (isRateLimited) {
    throw new AppError(
      status.TOO_MANY_REQUESTS,
      "Please wait 5 minutes before requesting a new OTP",
    );
  }

  const otp = generateOTP();

  await Promise.all([
    redisClient.set(rateLimitKey, "1", {
      expiration: { type: "PX", value: OTP_RESEND_DELAY_MS },
    }),
    redisClient.set(redisKey, otp, {
      expiration: { type: "PX", value: OTP_EXPIRATION_MS },
    }),
  ]);

  try {
    await sendEmail({
      to: email,
      subject: "OTP Code",
      text: `Hello ${user.name},\n\nYour OTP code is: ${otp}\n\nThis code will expire in 2 minutes.\n\nIf you did not request this code, please ignore this email.`,
      template: "otp",
      templateData: {
        name: user.name,
        otp: otp,
      },
    });
  } catch (err) {
    await Promise.all([
      redisClient.del(rateLimitKey),
      redisClient.del(redisKey),
    ]);
    throw err;
  }
};

const verifyOTP = async (email: string, otp: number) => {
  const user = await UserModel.exists({ email, isVerified: false });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "No account found with this email");
  }

  const redisKey = `otp:${email}`;

  const storedOTP = await redisClient.get(redisKey);

  if (!storedOTP) {
    throw new AppError(status.NOT_FOUND, "Expired OTP");
  }

  if (storedOTP !== otp.toString()) {
    throw new AppError(status.BAD_REQUEST, "Invalid OTP");
  }

  await Promise.all([
    UserModel.updateOne({ email }, { isVerified: true }),
    redisClient.del(redisKey),
  ]);
};

export const OTPServices = {
  sendOTP,
  verifyOTP,
};
