import bcrypt from "bcryptjs";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import type { IAuthProvider, IUser } from "./user.interface.js";
import { UserRole, UserStatus } from "./user.interface.js";
import { UserModel } from "./user.model.js";

const createUserIntoDB = async (
  payload: Pick<IUser, "name" | "email" | "password">,
) => {
  const { name, email, password } = payload as {
    name: string;
    email: string;
    password: string;
  };

  const hashedPassword = await bcrypt.hash(
    password,
    envVars.BCRYPT_SALT_ROUNDS,
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  return await UserModel.create({
    name,
    email,
    password: hashedPassword,
    auths: [authProvider],
  });
};

const getAllUsersFromDB = async () => {
  const [users, total] = await Promise.all([
    UserModel.find(),
    UserModel.countDocuments(),
  ]); // Fetch users and total count in parallel

  return {
    users,
    total: { total },
  };
};

const updateUserInDB = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const targetUser = await UserModel.findById(userId);

  if (!targetUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (targetUser.isDeleted) {
    throw new AppError(status.FORBIDDEN, "Cannot update a deleted user");
  }

  if (targetUser.isActive === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "Cannot update a blocked user");
  }

  const { auths, email, bookings, guides, ...safePayload } =
    payload as IUser & {
      bookings?: unknown;
      guides?: unknown;
    };

  if (safePayload.password) {
    safePayload.password = await bcrypt.hash(
      safePayload.password,
      envVars.BCRYPT_SALT_ROUNDS,
    );
  }

  const requesterRole = decodedToken.role as UserRole;
  const requesterId = decodedToken.id as string;
  const isSelf = requesterId === userId;

  if (safePayload.role) {
    if (requesterRole === UserRole.USER || requesterRole === UserRole.GUIDE) {
      throw new AppError(status.FORBIDDEN, "Not authorized to update role");
    }

    if (isSelf) {
      throw new AppError(status.FORBIDDEN, "Cannot update your own role");
    }

    if (requesterRole === UserRole.ADMIN) {
      if (
        safePayload.role === UserRole.ADMIN ||
        safePayload.role === UserRole.SUPER_ADMIN
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Admin can only assign user or guide roles",
        );
      }

      if (targetUser.role === UserRole.SUPER_ADMIN) {
        throw new AppError(
          status.FORBIDDEN,
          "Admin cannot modify a super admin's account",
        );
      }
    }
  }

  if (
    safePayload.isActive !== undefined ||
    safePayload.isDeleted !== undefined ||
    safePayload.isVerified !== undefined
  ) {
    if (requesterRole === UserRole.USER || requesterRole === UserRole.GUIDE) {
      throw new AppError(
        status.FORBIDDEN,
        "Not authorized to update user status",
      );
    }

    if (
      requesterRole === UserRole.ADMIN &&
      targetUser.role === UserRole.SUPER_ADMIN
    ) {
      throw new AppError(
        status.FORBIDDEN,
        "Admin cannot modify a super admin's account",
      );
    }
  }

  return await UserModel.findByIdAndUpdate(userId, safePayload, {
    new: true,
    runValidators: true,
  });
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  updateUserInDB,
};
