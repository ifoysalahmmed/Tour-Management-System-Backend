import { Router } from "express";

import { AuthRoutes } from "../modules/auth/auth.route.js";
import { BookingRoutes } from "../modules/booking/booking.route.js";
import { DivisionRoutes } from "../modules/division/division.route.js";
import { OTPRoutes } from "../modules/otp/otp.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";
import { StatsRoutes } from "../modules/stats/stats.route.js";
import { TourTypeRoutes } from "../modules/tour-type/tourType.route.js";
import { TourRoutes } from "../modules/tour/tour.route.js";
import { UserRoutes } from "../modules/user/user.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/otp",
    route: OTPRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
  {
    path: "/tour-types",
    route: TourTypeRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
