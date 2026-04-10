import type { IUser } from "./user.interface.js";
import { UserModel } from "./user.model.js";

const createUserIntoDB = async (payload: Pick<IUser, "name" | "email">) => {
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
