import jwt from "jsonwebtoken";
import type { TTokenPayload } from "../modules/auth/auth.interface.js";
import { envVars } from "../config/env.js";

export const generateAccessToken = (payload: TTokenPayload) => {
  const accessToken = jwt.sign(
    {
      id: payload._id,
      email: payload.email,
      role: payload.role,
    },
    envVars.JWT_SECRET,
    {
      expiresIn: envVars.JWT_EXPIRES_IN as unknown as NonNullable<
        jwt.SignOptions["expiresIn"]
      >,
    },
  );

  return accessToken;
};

export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, envVars.JWT_SECRET) as TTokenPayload;
  return decoded;
};
