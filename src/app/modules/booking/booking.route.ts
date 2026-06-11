import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { BookingControllers } from "./booking.controller.js";
import {
  assignGuideZodSchema,
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.validation.js";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.User, UserRole.Guide),
  validateBody(createBookingZodSchema),
  BookingControllers.createBooking,
);

router.get(
  "/",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  BookingControllers.getAllBookings,
);

router.get(
  "/my-bookings",
  checkAuth(...Object.values(UserRole)),
  BookingControllers.getUserBookings,
);

router.get(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  BookingControllers.getBookingById,
);

router.patch(
  "/:id/status",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  validateBody(updateBookingStatusZodSchema),
  BookingControllers.updateBookingStatus,
);

router.patch(
  "/:id/assign-guide",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  validateBody(assignGuideZodSchema),
  BookingControllers.assignGuide,
);

export const BookingRoutes = router;
