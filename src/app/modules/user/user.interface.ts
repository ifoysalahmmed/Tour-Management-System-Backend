export enum UserRole {
  SuperAdmin = "SUPER_ADMIN",
  Admin = "ADMIN",
  User = "USER",
  Guide = "GUIDE",
}

export enum UserStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Blocked = "BLOCKED",
}

export interface IAuthProvider {
  providerId: string;
  provider: "google" | "credentials";
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  auths: IAuthProvider[];
  role: UserRole;
  phone?: string;
  picture?: string;
  address?: string;
  isVerified?: boolean;
  isActive?: UserStatus;
  isDeleted?: boolean;
  passwordChangedAt?: Date;
  passwordResetRequestedAt?: Date;
  createdAt?: Date;
}
