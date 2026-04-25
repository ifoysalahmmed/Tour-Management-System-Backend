import type { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const cookieOptions = {
  httpOnly: true,
  secure: false,
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
