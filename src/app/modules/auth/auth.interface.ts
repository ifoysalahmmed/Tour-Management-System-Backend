import type { Types } from "mongoose";
import type { IUser } from "../user/user.interface.js";

export type TTokenPayload = {
  _id: Types.ObjectId;
  email: IUser["email"];
  role: IUser["role"];
};
