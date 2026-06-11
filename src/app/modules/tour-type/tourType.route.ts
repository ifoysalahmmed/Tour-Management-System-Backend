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
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  validateBody(createTourTypeZodSchema),
  TourTypeControllers.createTourType,
);

router.get(
  "/",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  TourTypeControllers.getAllTourTypes,
);

router.get(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  TourTypeControllers.getTourTypeById,
);

router.patch(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  validateBody(updateTourTypeZodSchema),
  TourTypeControllers.updateTourType,
);

router.delete(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  TourTypeControllers.deleteTourType,
);

export const TourTypeRoutes = router;
