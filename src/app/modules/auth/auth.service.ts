import bcrypt from "bcryptjs";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import {
  generateAccessTokenFromRefreshToken,
  generateAuthTokens,
} from "../../utils/userAuthTokens.js";
import type { IUser } from "../user/user.interface.js";
import { UserStatus } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";

const loginWithCredentials = async (
  payload: Pick<IUser, "email" | "password">,
) => {
  const { email, password } = payload;

  const isUserExist = await UserModel.findOne({ email, isDeleted: false })
    .select("+password")
    .lean();

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "Invalid credentials");
  }

  if (isUserExist.isActive === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "Your account has been blocked");
  }

  if (isUserExist.isActive === UserStatus.INACTIVE) {
    throw new AppError(status.FORBIDDEN, "Your account is inactive");
  }

  // OAuth-only users have no password — reject credential login
  const hasCredentialsProvider = isUserExist.auths.some(
    (auth) => auth.provider === "credentials",
  );
  if (!hasCredentialsProvider || !isUserExist.password) {
    throw new AppError(
      status.BAD_REQUEST,
      "This account uses a different sign-in method",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExist.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  const { password: _password, ...safeUser } = isUserExist;

  const { accessToken, refreshToken } = generateAuthTokens(isUserExist);

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

const refreshAccessToken = async (refreshToken: string) => {
  return await generateAccessTokenFromRefreshToken(refreshToken);
};

const generateNewPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  const user = await UserModel.findById(decodedToken.id).select("+password");

  const isOldPasswordMatched = await bcrypt.compare(
    oldPassword,
    user?.password as string,
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
  generateNewPassword,
};
