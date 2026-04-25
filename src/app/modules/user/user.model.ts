import { model, Schema } from "mongoose";

import type { IUser } from "./user.interface.js";
import { UserRole, UserStatus } from "./user.interface.js";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    auths: [
      {
        _id: false,
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = model<IUser>("User", userSchema);
