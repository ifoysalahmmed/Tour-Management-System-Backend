import bcrypt from "bcryptjs";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { userSearchableFields } from "./user.constant.js";
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
    providerId: email,
    provider: "credentials",
  };

  return await UserModel.create({
    name,
    email,
    password: hashedPassword,
    auths: [authProvider],
  });
};

const getAllUsersFromDB = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(UserModel.find(), query);

  const data = queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .select()
    .paginate();

  const [users, meta] = await Promise.all([
    data.modelQuery,
    queryBuilder.getMetaData(),
  ]);

  return {
    users,
    meta,
  };
};

const getUserByEmailFromDB = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserIntoDB = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const targetUser = await UserModel.findById(userId);

  if (!targetUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (targetUser.isActive === UserStatus.Blocked) {
    throw new AppError(status.FORBIDDEN, "Cannot update a blocked user");
  }

  if (targetUser.isDeleted) {
    throw new AppError(status.FORBIDDEN, "Cannot update a deleted user");
  }

  const { email, auths, bookings, guides, ...safePayload } =
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
    if (requesterRole === UserRole.User || requesterRole === UserRole.Guide) {
      throw new AppError(status.FORBIDDEN, "Not authorized to update role");
    }

    if (isSelf) {
      throw new AppError(status.FORBIDDEN, "Cannot update your own role");
    }

    if (requesterRole === UserRole.Admin) {
      if (
        safePayload.role === UserRole.Admin ||
        safePayload.role === UserRole.SuperAdmin
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Admin can only assign user or guide roles",
        );
      }

      if (targetUser.role === UserRole.SuperAdmin) {
        throw new AppError(
          status.FORBIDDEN,
          "Admin cannot modify a super admin's account",
        );
      }
    }
  }

  if (
    safePayload.isVerified !== undefined ||
    safePayload.isActive !== undefined ||
    safePayload.isDeleted !== undefined
  ) {
    if (requesterRole === UserRole.User || requesterRole === UserRole.Guide) {
      throw new AppError(
        status.FORBIDDEN,
        "Not authorized to update user status",
      );
    }

    if (
      requesterRole === UserRole.Admin &&
      targetUser.role === UserRole.SuperAdmin
    ) {
      throw new AppError(
        status.FORBIDDEN,
        "Admin cannot modify a super admin's account",
      );
    }
  }

  return await UserModel.findByIdAndUpdate(userId, safePayload, {
    returnDocument: "after",
    runValidators: true,
  });
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByEmailFromDB,
  updateUserIntoDB,
};
