import { Router } from "express";

import validateBody from "../../middlewares/validateBody.middleware.js";
import { OTPControllers } from "./otp.controller.js";
import { sendOTPZodSchema, verifyOTPZodSchema } from "./otp.validation.js";

const router = Router();

router.post("/send", validateBody(sendOTPZodSchema), OTPControllers.sendOTP);

router.post(
  "/verify",
  validateBody(verifyOTPZodSchema),
  OTPControllers.verifyOTP,
);

export const OTPRoutes = router;
