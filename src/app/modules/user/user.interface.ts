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
  providerId: string; // OAuth provider's unique user ID (e.g. Google subject) or email for credentials
  provider: "google" | "credentials"; // "Credentials" | "Google"
}

export interface IUser {
  name: string;
  email: string;
  password?: string; // Undefined for OAuth-only users
  auths: IAuthProvider[]; // Supports multiple auth providers per user
  role: UserRole;
  phone?: string;
  picture?: string;
  address?: string;
  isVerified?: boolean;
  isActive?: UserStatus;
  isDeleted?: boolean;
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
