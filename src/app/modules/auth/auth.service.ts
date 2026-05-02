import bcrypt from "bcryptjs";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import { verifyAccessToken } from "../../utils/jwt.js";
import { generateAuthTokens } from "../../utils/userAuthTokens.js";
import type { IUser } from "../user/user.interface.js";
import { UserStatus } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";

const loginWithCredentials = async (
  payload: Pick<IUser, "email" | "password">,
) => {
  const { email, password } = payload;

  const user = await UserModel.findOne({ email, isDeleted: false })
    .select("+password")
    .lean();

  if (!user) {
    throw new AppError(status.NOT_FOUND, "Invalid credentials");
  }

  if (user.isActive === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "Your account has been blocked");
  }

  if (user.isActive === UserStatus.INACTIVE) {
    throw new AppError(status.FORBIDDEN, "Your account is inactive");
  }

  // OAuth-only users have no password — reject credential login
  const hasCredentialsProvider = user.auths.some(
    (auth) => auth.provider === "credentials",
  );

  if (!hasCredentialsProvider || !user.password) {
    throw new AppError(
      status.BAD_REQUEST,
      "This account uses a different sign-in method",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  const { password: _password, ...safeUser } = user;

  const { accessToken, refreshToken } = generateAuthTokens(user);

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

const refreshAccessToken = async (refreshToken: string) => {
  const verifiedToken = await verifyAccessToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET,
  );

  const user = await UserModel.findOne({
    email: verifiedToken.email,
  }).lean();

  if (!user) {
    throw new AppError(status.NOT_FOUND, "Invalid credentials");
  }

  if (user.isActive === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "Your account has been blocked");
  }

  if (user.isActive === UserStatus.INACTIVE) {
    throw new AppError(status.FORBIDDEN, "Your account is inactive");
  }

  if (user.isDeleted) {
    throw new AppError(status.BAD_GATEWAY, "User account has been deleted");
  }

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
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isOldPasswordMatched = await bcrypt.compare(
    oldPassword,
    user.password as string,
  );

  if (!isOldPasswordMatched) {
    throw new AppError(status.BAD_REQUEST, "Old password is incorrect");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUNDS),
  );

  await user!.save();
};

export const AuthServices = {
  loginWithCredentials,
  refreshAccessToken,
  changePassword,
};
