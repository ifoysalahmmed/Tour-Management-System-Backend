import status from "http-status";

import { AppError } from "../errors/app.error.js";
import { UserStatus, type IUser } from "../modules/user/user.interface.js";

type UserStatusFields = Pick<IUser, "isVerified" | "isActive" | "isDeleted">;

export const assertUserStatus = (user: UserStatusFields) => {
  if (user.isVerified === false) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account is not verified yet. Please check your email for the verification link.",
    );
  }

  if (user.isActive === UserStatus.Inactive) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account is currently inactive. Please contact support.",
    );
  }

  if (user.isActive === UserStatus.Blocked) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account has been blocked. Please contact support.",
    );
  }

  if (user.isDeleted) {
    throw new AppError(status.FORBIDDEN, "Account has been deleted.");
  }
};
