import bcrypt from "bcryptjs";
import { envVars } from "../config/env.js";
import { UserModel } from "../modules/user/user.model.js";
import { UserRole } from "../modules/user/user.interface.js";
import { AppError } from "../errors/app.error.js";
import status from "http-status";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await UserModel.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super admin already exists. Skipping seeding.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      envVars.BCRYPT_SALT_ROUNDS,
    );

    const superAdmin = new UserModel({
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
      auths: [
        { provider: "credentials", providerId: envVars.SUPER_ADMIN_EMAIL },
      ],
    });

    await superAdmin.save();
    console.log("Super admin seeded successfully.");
  } catch (error) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to seed super admin",
    );
  }
};

export default seedSuperAdmin;
