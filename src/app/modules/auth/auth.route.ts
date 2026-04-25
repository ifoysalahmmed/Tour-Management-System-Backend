import { Router } from "express";

import validateBody from "../../middlewares/validateBody.middleware.js";
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

export const AuthRoutes = router;
