import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { TourTypeControllers } from "../tour-type/tourType.controller.js";
import { createTourTypeZodSchema } from "../tour-type/tourType.validation.js";
import { UserRole } from "../user/user.interface.js";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createTourTypeZodSchema),
  TourTypeControllers.createTourType,
);

router.get(
  "/tour-types",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  TourTypeControllers.getAllTourTypes,
);

router.patch(
  "/tour-types/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createTourTypeZodSchema),
  TourTypeControllers.updateTourType,
);

export const TourRoutes = router;
