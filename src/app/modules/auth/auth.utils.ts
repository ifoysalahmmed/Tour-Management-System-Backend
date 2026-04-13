import jwt from "jsonwebtoken";
import { envVars } from "../../config/env.js";
import type { TTokenPayload } from "./auth.interface.js";

const generateAccessToken = (payload: TTokenPayload) => {
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

export default generateAccessToken;
