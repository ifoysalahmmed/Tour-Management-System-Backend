import type { SignOptions } from "jsonwebtoken";

import { envVars } from "../config/env.js";
import type {
  ITokenPayload,
  IUserInput,
} from "../modules/auth/auth.interface.js";
import { generateAccessToken } from "./jwt.js";

export const generateAuthTokens = (user: IUserInput) => {
  const jwtPayload: ITokenPayload = {
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
