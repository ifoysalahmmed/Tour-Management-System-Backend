import status from "http-status";
import type { SignOptions } from "jsonwebtoken";

import { envVars } from "../config/env.js";
import { AppError } from "../errors/app.error.js";
import type {
  TTokenPayload,
  TUserInput,
} from "../modules/auth/auth.interface.js";
import { UserStatus } from "../modules/user/user.interface.js";
import { UserModel } from "../modules/user/user.model.js";
import { generateAccessToken, verifyAccessToken } from "./jwt.js";

export const generateAuthTokens = (user: TUserInput) => {
  const jwtPayload: TTokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
  );

  const refreshToken = generateAccessToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
  );

  return { accessToken, refreshToken };
};

export const generateAccessTokenFromRefreshToken = async (refreshToken: string) => {
  const verifiedToken = await verifyAccessToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET,
  );

  const isUserExist = await UserModel.findOne({
    email: verifiedToken.email,
  }).lean();

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "Invalid credentials");
  }

  if (isUserExist.isActive === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "Your account has been blocked");
  }

  if (isUserExist.isActive === UserStatus.INACTIVE) {
    throw new AppError(status.FORBIDDEN, "Your account is inactive");
  }

  if (isUserExist.isDeleted) {
    throw new AppError(status.BAD_GATEWAY, "User account has been deleted");
  }

  const { accessToken } = generateAuthTokens(isUserExist);

  return {
    accessToken,
  };
};
