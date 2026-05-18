import type { Types } from "mongoose";

import type { IUser } from "../user/user.interface.js";

export interface ITokenPayload {
  id: Types.ObjectId;
  email: IUser["email"];
  role: IUser["role"];
}

export interface IUserInput extends Pick<IUser, "email" | "role"> {
  _id: Types.ObjectId;
}
