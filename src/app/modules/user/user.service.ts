import bcrypt from "bcryptjs";
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

  const hashedPassword = bcrypt.hashSync(password, 10);

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
