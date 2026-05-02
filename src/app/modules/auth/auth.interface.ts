import type { Types } from "mongoose";

import type { IUser } from "../user/user.interface.js";

export interface TTokenPayload {
  id: Types.ObjectId;
  email: IUser["email"];
  role: IUser["role"];
}

export interface TUserInput extends Pick<IUser, "email" | "role"> {
  _id: Types.ObjectId;
}
