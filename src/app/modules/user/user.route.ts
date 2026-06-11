import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserControllers } from "./user.controller.js";
import { UserRole } from "./user.interface.js";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation.js";

const router = Router();

router.post(
  "/register",
  validateBody(createUserZodSchema),
  UserControllers.createUser,
);

router.get(
  "/",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  UserControllers.getAllUsers,
);

router.get(
  "/:email",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  UserControllers.getAUser,
);

router.patch(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  validateBody(updateUserZodSchema),
  UserControllers.updateUser,
);

export const UserRoutes = router;
