import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import { AppError } from "../../errors/app.error.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import setCookies from "../../utils/setCookies.js";
import { generateAuthTokens } from "../../utils/userAuthTokens.js";
import type { TUserInput } from "./auth.interface.js";
import { AuthServices } from "./auth.service.js";
import { envVars } from "../../config/env.js";

const loginWithCredentials = catchAsync(async (req, res) => {
  const loginResult = await AuthServices.loginWithCredentials(req.body);

  setCookies(res, loginResult);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully",
    data: loginResult,
  });
});

const handleRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const refreshedAccessToken = await AuthServices.refreshAccessToken(
    refreshToken as string,
  );

  setCookies(res, refreshedAccessToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: refreshedAccessToken,
  });
});

const logout = catchAsync(async (_req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logout successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user as JwtPayload;

  await AuthServices.generateNewPassword(
    oldPassword,
    newPassword,
    decodedToken,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password reset successfully",
    data: null,
  });
});

const handleGoogleCallback = catchAsync(async (req, res) => {
  const user = req.user as TUserInput;

  console.log("user from google:", user);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "Google authentication failed");
  }

  const token = generateAuthTokens(user);
  setCookies(res, token);

  res.redirect(envVars.FRONTEND_URL);
});

export const AuthControllers = {
  loginWithCredentials,
  handleRefreshToken,
  logout,
  resetPassword,
  handleGoogleCallback,
};
