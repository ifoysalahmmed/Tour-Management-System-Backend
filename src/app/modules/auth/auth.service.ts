import status from "http-status";
import { AppError } from "../../errors/AppError.js";
import type { IUser } from "../user/user.interface.js";
import { UserModel } from "../user/user.model.js";
import bcrypt from "bcryptjs";

const loginWithCredentials = async (
  payload: Pick<IUser, "email" | "password">,
) => {
  const { email, password } = payload as { email: string; password: string };

  const isUserExist = await UserModel.findOne({ email })
    .select("+password")
    .lean();

  if (!isUserExist) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isPasswordMatched = bcrypt.compareSync(
    password,
    isUserExist.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  const { password: _, ...userWithoutPassword } = isUserExist;

  return {
    ...userWithoutPassword,
  };
};

export const AuthServices = {
  loginWithCredentials,
};
