import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { TourControllers } from "./tour.controller.js";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation.js";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createTourZodSchema),
  TourControllers.createTour,
);

router.get("/", TourControllers.getAllTours);

router.get("/:slug", TourControllers.getATour);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(updateTourZodSchema),
  TourControllers.updateTour,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourControllers.deleteTour,
);

export const TourRoutes = router;
