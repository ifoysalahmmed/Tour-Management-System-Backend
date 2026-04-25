import status from "http-status";
import bcrypt from "bcryptjs";
import { AppError } from "../../errors/app.error.js";
import { type IUser, UserStatus } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";
import { verifyAccessToken } from "../../utils/jwt.js";
import { envVars } from "../../config/env.js";
import { generateAuthTokens } from "../../utils/userAuthTokens.js";

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

const generateNewAccessToken = async (refreshToken: string) => {
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

export const AuthServices = {
  loginWithCredentials,
  generateNewAccessToken,
};
