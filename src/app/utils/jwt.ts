import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import type { TTokenPayload } from "../modules/auth/auth.interface.js";
import { UserRole } from "../modules/user/user.interface.js";
import { envVars } from "../config/env.js";
import { AppError } from "../errors/app.error.js";

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

export const checkAuth = (...allowedRoles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Access token is missing");
      }

      const verifiedToken = verifyAccessToken(accessToken);

      if (allowedRoles.length && !allowedRoles.includes(verifiedToken.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "You are not authorized to access this route",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
