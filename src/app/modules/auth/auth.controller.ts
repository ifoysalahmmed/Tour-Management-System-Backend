import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";
import passport from "passport";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import setCookies, { cookieOptions } from "../../utils/setCookies.js";
import { generateAuthTokens } from "../../utils/userAuthTokens.js";
import type { IUserInput } from "./auth.interface.js";
import { AuthServices } from "./auth.service.js";
import type { IUser } from "../user/user.interface.js";

type IAuthenticatedUser = IUser & { _id: Types.ObjectId };

const loginWithCredentials = catchAsync(async (req, res, next) => {
  passport.authenticate(
    "local",
    async (
      err: Error | null,
      user: IAuthenticatedUser | false,
      info: { message: string },
    ) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(
          new AppError(
            status.UNAUTHORIZED,
            info.message || "Invalid email or password",
          ),
        );
      }

      const { password: _password, ...safeUser } = user;
      const tokens = generateAuthTokens(user);

      setCookies(res, tokens);

      sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Login completed successfully",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: safeUser,
        },
      });
    },
  )(req, res, next);
});

const logout = catchAsync(async (_req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logout completed successfully",
  });
});

const handleRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Refresh token is required");
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

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user as JwtPayload;

  await AuthServices.changePassword(oldPassword, newPassword, decodedToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password updated successfully",
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthServices.forgotPassword(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent.",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { password } = req.body;
  const decodedToken = req.user as JwtPayload;

  await AuthServices.resetPassword(password, decodedToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password reset successfully",
  });
});

const setPassword = catchAsync(async (req, res) => {
  const { password } = req.body;
  const decodedToken = req.user as JwtPayload;

  await AuthServices.setPassword(decodedToken, password);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message:
      "Password set successfully. You can now sign in with your email and password.",
  });
});

const handleGoogleCallback = catchAsync(async (req, res) => {
  let redirectTo = req.query.state ? (req.query.state as string) : "";

  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  }

  const user = req.user as IUserInput;

  if (!user) {
    throw new AppError(status.NOT_FOUND, "Google authentication failed");
  }

  const token = generateAuthTokens(user);

  setCookies(res, token);
  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});

export const AuthControllers = {
  loginWithCredentials,
  logout,
  handleRefreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  setPassword,
  handleGoogleCallback,
};
