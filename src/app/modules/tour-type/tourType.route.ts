import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { TourTypeControllers } from "./tourType.controller.js";
import {
  createTourTypeZodSchema,
  updateTourTypeZodSchema,
} from "./tourType.validation.js";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createTourTypeZodSchema),
  TourTypeControllers.createTourType,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourTypeControllers.getAllTourTypes,
);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourTypeControllers.getTourTypeById,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(updateTourTypeZodSchema),
  TourTypeControllers.updateTourType,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourTypeControllers.deleteTourType,
);

export const TourTypeRoutes = router;
