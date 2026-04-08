import type { IUser } from "./user.interface.js";
import { UserModel } from "./user.model.js";

const createUserIntoDB = async (payload: Pick<IUser, "name" | "email">) => {
  return await UserModel.create(payload);
};

export const UserServices = {
  createUserIntoDB,
};
