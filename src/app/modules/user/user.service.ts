import type { IUser } from "./user.interface.js";
import { UserModel } from "./user.model.js";

const createUserIntoDB = async (payload: Pick<IUser, "name" | "email">) => {
  return await UserModel.create(payload);
};

const getAllUsersFromDB = async () => {
  return await UserModel.find();
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
};
