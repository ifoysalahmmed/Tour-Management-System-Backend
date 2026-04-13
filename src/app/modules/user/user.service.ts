import type { IAuthProvider, IUser } from "./user.interface.js";
import { UserModel } from "./user.model.js";

const createUserIntoDB = async (
  payload: Pick<IUser, "name" | "email" | "password">,
) => {
  const { name, email, password } = payload as {
    name: string;
    email: string;
    password: string;
  };

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  return await UserModel.create({
    name,
    email,
    password,
    auths: [authProvider],
  });
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
