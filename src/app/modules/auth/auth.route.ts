import { Router, type Request, type Response } from "express";
import passport from "passport";

import { envVars } from "../../config/env.js";
import checkAuth from "../../middlewares/checkAuth.middleware.js";
import checkResetToken from "../../middlewares/checkResetToken.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { AuthControllers } from "./auth.controller.js";
import {
  forgotPasswordZodSchema,
  loginZodSchema,
  resetPasswordZodSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/login",
  validateBody(loginZodSchema),
  AuthControllers.loginWithCredentials,
);

router.post("/logout", AuthControllers.logout);

router.post("/refresh-token", AuthControllers.handleRefreshToken);

router.post(
  "/change-password",
  checkAuth(...Object.values(UserRole)),
  AuthControllers.changePassword,
);

router.post(
  "/forgot-password",
  validateBody(forgotPasswordZodSchema),
  AuthControllers.forgotPassword,
);

router.post(
  "/reset-password",
  checkResetToken,
  validateBody(resetPasswordZodSchema),
  AuthControllers.resetPassword,
);

router.post(
  "/set-password",
  checkAuth(...Object.values(UserRole)),
  AuthControllers.setPassword,
);

router.get("/google", (req: Request, res: Response) => {
  const redirectURL = req.query.redirect || "/";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirectURL as string,
  })(req, res);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: envVars.FRONTEND_URL + "/login",
  }),
  AuthControllers.handleGoogleCallback,
);

export const AuthRoutes = router;
