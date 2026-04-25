import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import setCookies from "../../utils/setCookies.js";
import { AuthServices } from "./auth.service.js";

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
    message: "Logged in successfully",
    data: refreshedAccessToken,
  });
});

export const AuthControllers = {
  loginWithCredentials,
  handleRefreshToken,
};
