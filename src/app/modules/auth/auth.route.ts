import { Router } from "express";

import validateBody from "../../middlewares/validateBody.middleware.js";
import checkAuth from "../../middlewares/checkAuth.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { AuthControllers } from "./auth.controller.js";
import { loginZodSchema } from "./auth.validation.js";

const router = Router();

router.post(
  "/login",
  validateBody(loginZodSchema),
  AuthControllers.loginWithCredentials,
);

router.post("/refresh-token", AuthControllers.handleRefreshToken);

router.post("/logout", AuthControllers.logout);

router.post(
  "/reset-password",
  checkAuth(...Object.values(UserRole)),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
