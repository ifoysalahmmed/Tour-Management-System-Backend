import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { PaymentControllers } from "./payment.controller.js";
import { validateIPNZodSchema } from "./payment.validation.js";

const router = Router();

router.post(
  "/init-payment/:bookingId",
  checkAuth(UserRole.User, UserRole.Guide),
  PaymentControllers.initiatePayment,
);

router.post("/succeeded", PaymentControllers.paymentSucceeded);

router.post("/failed", PaymentControllers.paymentFailed);

router.post("/cancelled", PaymentControllers.paymentCancelled);

router.get(
  "/invoice/:paymentId",
  checkAuth(...Object.values(UserRole)),
  PaymentControllers.getInvoiceDownloadUrl,
);

router.post(
  "/validate-payment",
  validateBody(validateIPNZodSchema),
  PaymentControllers.validatePayment,
);

export const PaymentRoutes = router;
