import type { Types } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

/** Tracks how a user authenticated (e.g. credentials or OAuth) */
export interface IAuthProvider {
  provider: string; // "Credentials" | "Google"
  providerId: string; // OAuth provider's unique user ID (e.g. Google sub)
}

export interface IUser {
  name: string;
  email: string;
  password?: string; // Undefined for OAuth-only users
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: UserStatus;
  isVerified?: boolean;
  role: UserRole;
  auths: IAuthProvider[]; // Supports multiple auth providers per user
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
