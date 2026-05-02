import type { Response } from "express";

import { envVars } from "../config/env.js";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const cookieOptions = {
  httpOnly: true,
  secure: envVars.NODE_ENV === "production",
  sameSite: "lax" as const,
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
