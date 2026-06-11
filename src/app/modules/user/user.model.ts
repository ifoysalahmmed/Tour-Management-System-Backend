import { model, Schema } from "mongoose";

import type { IUser } from "./user.interface.js";
import { UserRole, UserStatus } from "./user.interface.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    auths: [
      {
        _id: false,
        providerId: {
          type: String,
          required: true,
        },
        provider: {
          type: String,
          required: true,
          enum: ["google", "credentials"],
        },
      },
    ],
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
    phone: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model<IUser>("User", userSchema);
