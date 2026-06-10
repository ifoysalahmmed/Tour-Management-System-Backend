import { Router } from "express";

import { AuthRoutes } from "../modules/auth/auth.route.js";
import { BookingRoutes } from "../modules/booking/booking.route.js";
import { DivisionRoutes } from "../modules/division/division.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";
import { TourRoutes } from "../modules/tour/tour.route.js";
import { TourTypeRoutes } from "../modules/tour-type/tourType.route.js";
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
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/tour-types",
    route: TourTypeRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
