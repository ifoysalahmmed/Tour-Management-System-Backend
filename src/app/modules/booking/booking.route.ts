import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { BookingControllers } from "./booking.controller.js";
import { createBookingZodSchema } from "./booking.validation.js";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(UserRole)),
  validateBody(createBookingZodSchema),
  BookingControllers.createBooking,
);

export const BookingRoutes = router;
