import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { PaymentControllers } from "./payment.controller.js";

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

export const PaymentRoutes = router;
