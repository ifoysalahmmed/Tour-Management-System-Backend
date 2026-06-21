import type { NextFunction, Request, Response } from "express";
import status from "http-status";

import { envVars } from "../config/env.js";
import { AppError } from "../errors/app.error.js";
import { UserModel } from "../modules/user/user.model.js";
import { assertUserStatus } from "../utils/assertUserStatus.js";
import { verifyAccessToken } from "../utils/jwt.js";

const checkResetToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const resetToken = req.headers.authorization;

    if (!resetToken) {
      throw new AppError(status.UNAUTHORIZED, "Reset token is required");
    }

    const verifiedToken = verifyAccessToken(resetToken, envVars.JWT_RESET_SECRET);

    const user = await UserModel.findOne({ email: verifiedToken.email }).lean();

    if (!user) {
      throw new AppError(
        status.NOT_FOUND,
        "No user account found for the provided reset token",
      );
    }

    assertUserStatus(user);

    req.user = verifiedToken;

    next();
  } catch (error) {
    next(error);
  }
};

export default checkResetToken;
