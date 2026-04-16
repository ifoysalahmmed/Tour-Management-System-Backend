import { Router } from "express";
import { AuthControllers } from "./auth.controller.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { loginZodSchema } from "./auth.validation.js";

const router = Router();

router.post(
  "/login",
  validateBody(loginZodSchema),
  AuthControllers.loginWithCredentials,
);

export const AuthRoutes = router;
