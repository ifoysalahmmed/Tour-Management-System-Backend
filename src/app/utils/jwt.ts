import jwt , { type SignOptions } from "jsonwebtoken";

import type { ITokenPayload } from "../modules/auth/auth.interface.js";

export const generateAccessToken = (
  payload: ITokenPayload,
  secret: string,
  expiresIn: NonNullable<SignOptions["expiresIn"]>,
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as ITokenPayload;
};
