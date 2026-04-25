import type { SignOptions } from "jsonwebtoken";
import type {
  TTokenPayload,
  TUserInput,
} from "../modules/auth/auth.interface.js";
import { envVars } from "../config/env.js";
import { generateAccessToken } from "./jwt.js";

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
