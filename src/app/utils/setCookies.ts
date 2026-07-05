import type { Response } from "express";

import { envVars } from "../config/env.js";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const isProduction = envVars.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

const setCookies = (res: Response, tokens: AuthTokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, cookieOptions);
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
  }
};

export default setCookies;
