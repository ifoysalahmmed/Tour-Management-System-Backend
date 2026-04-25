import status from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthServices } from "./auth.service.js";
import { AppError } from "../../errors/app.error.js";

const loginWithCredentials = catchAsync(async (req, res) => {
  const loginResult = await AuthServices.loginWithCredentials(req.body);

  res.cookie("accessToken", loginResult.accessToken, {
    httpOnly: true,
    secure: false,
  });

  res.cookie("refreshToken", loginResult.refreshToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully",
    data: loginResult,
  });
});

const refreshAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const newAccessToken = await AuthServices.generateNewAccessToken(
    refreshToken as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully",
    data: newAccessToken,
  });
});

export const AuthControllers = {
  loginWithCredentials,
  refreshAccessToken,
};
