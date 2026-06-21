import { Router } from "express";

import upload from "../../config/multer.config.js";
import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { TourControllers } from "./tour.controller.js";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation.js";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  upload.array("images"),
  validateBody(createTourZodSchema),
  TourControllers.createTour,
);

router.get("/", TourControllers.getAllTours);

router.get("/:slug", TourControllers.getATour);

router.patch(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  upload.array("images"),
  validateBody(updateTourZodSchema),
  TourControllers.updateTour,
);

router.delete(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  TourControllers.deleteTour,
);

export const TourRoutes = router;
