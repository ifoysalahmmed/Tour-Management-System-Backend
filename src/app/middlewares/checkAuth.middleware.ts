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
        throw new AppError(status.UNAUTHORIZED, "Access token is missing");
      }

      const verifiedToken = verifyAccessToken(
        accessToken,
        envVars.JWT_SECRET as string,
      );

      const isUserExist = await UserModel.findOne({
        email: verifiedToken.email,
      }).lean();

      if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "Invalid credentials");
      }

      if (isUserExist.isActive === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked");
      }

      if (isUserExist.isActive === UserStatus.INACTIVE) {
        throw new AppError(status.FORBIDDEN, "Your account is inactive");
      }

      if (isUserExist.isDeleted) {
        throw new AppError(status.BAD_GATEWAY, "User account has been deleted");
      }

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
