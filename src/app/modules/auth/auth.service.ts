import bcrypt from "bcryptjs";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import { assertUserStatus } from "../../utils/assertUserStatus.js";
import { verifyAccessToken } from "../../utils/jwt.js";
import { generateAuthTokens } from "../../utils/userAuthTokens.js";
import { type IAuthProvider } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";

const refreshAccessToken = async (refreshToken: string) => {
  const verifiedToken = await verifyAccessToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET,
  );

  const user = await UserModel.findOne({
    email: verifiedToken.email,
  }).lean();

  if (!user) {
    throw new AppError(
      status.NOT_FOUND,
      "No user account found for the provided refresh token",
    );
  }

  assertUserStatus(user);

  const { accessToken } = generateAuthTokens(user);

  return {
    accessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await UserModel.findById(decodedToken.id).select("+password");

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User account was not found");
  }

  const isOldPasswordMatched = await bcrypt.compare(
    oldPassword,
    user.password as string,
  );

  if (!isOldPasswordMatched) {
    throw new AppError(status.BAD_REQUEST, "Current password is incorrect");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUNDS),
  );

  await user!.save();
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await UserModel.findById(decodedToken.id).select("+password");

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User account was not found");
  }

  const isOldPasswordMatched = await bcrypt.compare(
    oldPassword,
    user.password as string,
  );

  if (!isOldPasswordMatched) {
    throw new AppError(status.BAD_REQUEST, "Current password is incorrect");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUNDS),
  );

  await user!.save();
};

const setPassword = async (decodedToken: JwtPayload, newPassword: string) => {
  const user = await UserModel.findById(decodedToken.id);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User account was not found");
  }

  if (user.password) {
    throw new AppError(
      status.BAD_REQUEST,
      "Password is already set for this account. Use change password instead.",
    );
  }

  const isGoogleUser = user.auths.some((auth) => auth.provider === "google");

  if (!isGoogleUser) {
    throw new AppError(
      status.BAD_REQUEST,
      "Password can only be set for users authenticated via Google",
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUNDS),
  );

  const auths: IAuthProvider[] = [
    ...user.auths,
    { provider: "credentials", providerId: user.email },
  ];

  user.password = hashedPassword;
  user.auths = auths;

  await user.save();
};

export const AuthServices = {
  refreshAccessToken,
  changePassword,
  resetPassword,
  setPassword,
};
