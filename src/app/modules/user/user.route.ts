import { Router } from "express";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserControllers } from "./user.controller.js";
import { UserRole } from "./user.interface.js";
import { createUserZodSchema } from "./user.validation.js";
import { checkAuth } from "../../utils/jwt.js";

const router = Router();

router.post(
  "/register",
  validateBody(createUserZodSchema),
  UserControllers.createUser,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserControllers.getAllUsers,
);

export const UserRoutes = router;
