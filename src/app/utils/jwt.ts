import jwt, { type SignOptions } from "jsonwebtoken";
import type { TTokenPayload } from "../modules/auth/auth.interface.js";

export const generateAccessToken = (
  payload: TTokenPayload,
  secret: string,
  expiresIn: NonNullable<SignOptions["expiresIn"]>,
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as TTokenPayload;
};
