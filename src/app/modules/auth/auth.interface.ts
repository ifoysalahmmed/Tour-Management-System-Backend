import type { Types } from "mongoose";
import type { IUser } from "../user/user.interface.js";

export type TTokenPayload = {
  id: Types.ObjectId;
  email: IUser["email"];
  role: IUser["role"];
};

export type TUserInput = Pick<IUser, "email" | "role"> & {
  _id: Types.ObjectId;
};
