import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import passport from "passport";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import setCookies, { cookieOptions } from "../../utils/setCookies.js";
import { generateAuthTokens } from "../../utils/userAuthTokens.js";
import type { IUserInput } from "./auth.interface.js";
import { AuthServices } from "./auth.service.js";

const loginWithCredentials = catchAsync(async (req, res, next) => {
  passport.authenticate(
    "local",
    async (err: any, user: any, info: { message: string }) => {
      if (err) {
        return next(
          new AppError(
            status.UNAUTHORIZED,
            info.message || "Credential authentication failed",
          ),
        );
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

const logout = catchAsync(async (_req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logout completed successfully",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user as JwtPayload;

  await AuthServices.changePassword(oldPassword, newPassword, decodedToken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password updated successfully",
    data: null,
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
  handleRefreshToken,
  logout,
  resetPassword,
  handleGoogleCallback,
};
