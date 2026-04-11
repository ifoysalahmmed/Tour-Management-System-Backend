import status from "http-status";
import { AppError } from "../../errors/AppError.js";
import type { IUser } from "./user.interface.js";
import { UserModel } from "./user.model.js";

const createUserIntoDB = async (payload: Pick<IUser, "name" | "email">) => {
  const { name, email } = payload as { name: string; email: string };

  if (!name || !email) {
    throw new AppError(status.BAD_REQUEST, "Name and Email are required");
  }

  return await UserModel.create(payload);
};

const getAllUsersFromDB = async () => {
  const users = await UserModel.find();
  const total = await UserModel.countDocuments();

  return {
    users,
    total: { total },
  };
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
};
