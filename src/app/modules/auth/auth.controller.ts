import status from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AuthServices } from "./auth.service.js";

const loginWithCredentials = catchAsync(async (req, res) => {
  const loginResult = await AuthServices.loginWithCredentials(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully",
    data: loginResult,
  });
});

const refreshAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.headers.authorization;

  const newAccessToken = await AuthServices.generateNewAccessToken(
    refreshToken as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: newAccessToken,
  });
});

export const AuthControllers = {
  loginWithCredentials,
  refreshAccessToken,
};
