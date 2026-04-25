import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../modules/user/user.interface.js";
import { AppError } from "../errors/app.error.js";
import status from "http-status";
import { verifyAccessToken } from "../utils/jwt.js";
import { envVars } from "../config/env.js";

const checkAuth = (...allowedRoles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Access token is missing");
      }

      const verifiedToken = verifyAccessToken(
        accessToken,
        envVars.JWT_SECRET as string,
      );

      if (allowedRoles.length && !allowedRoles.includes(verifiedToken.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "You are not authorized to access this route",
        );
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
