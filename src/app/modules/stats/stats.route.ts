import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { StatsControllers } from "./stats.controller.js";

const router = Router();

router.get(
  "/bookings",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  StatsControllers.getBookingStats,
);

router.get(
  "/payments",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  StatsControllers.getPaymentStats,
);

router.get(
  "/tours",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  StatsControllers.getTourStats,
);

router.get(
  "/users",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  StatsControllers.getUserStats,
);

export const StatsRoutes = router;
