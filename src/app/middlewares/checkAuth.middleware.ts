import type { NextFunction, Request, Response } from "express";
import status from "http-status";

import { envVars } from "../config/env.js";
import { AppError } from "../errors/app.error.js";
import { UserStatus, type UserRole } from "../modules/user/user.interface.js";
import { UserModel } from "../modules/user/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

const checkAuth = (...allowedRoles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Authorization token is required",
        );
      }

      const verifiedToken = verifyAccessToken(
        accessToken,
        envVars.JWT_SECRET as string,
      );

      const user = await UserModel.findOne({
        email: verifiedToken.email,
      }).lean();

      if (!user) {
        throw new AppError(
          status.NOT_FOUND,
          "No user account found for the provided credentials",
        );
      }

      if (user.isActive === UserStatus.BLOCKED) {
        throw new AppError(
          status.FORBIDDEN,
          "Your account has been blocked. Please contact support.",
        );
      }

      if (user.isActive === UserStatus.INACTIVE) {
        throw new AppError(
          status.FORBIDDEN,
          "Your account is currently inactive.",
        );
      }

      if (user.isDeleted) {
        throw new AppError(
          status.FORBIDDEN,
          "This user account has been deleted.",
        );
      }

      if (allowedRoles.length && !allowedRoles.includes(verifiedToken.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "You do not have permission to access this resource",
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
