import { Router } from "express";

import upload from "../../config/multer.config.js";
import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { DivisionControllers } from "./division.controller.js";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation.js";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  upload.single("thumbnail"),
  validateBody(createDivisionZodSchema),
  DivisionControllers.createDivision,
);

router.get("/", DivisionControllers.getAllDivisions);

router.get("/:slug", DivisionControllers.getADivision);

router.patch(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  upload.single("thumbnail"),
  validateBody(updateDivisionZodSchema),
  DivisionControllers.updateDivision,
);

router.delete(
  "/:id",
  checkAuth(UserRole.Admin, UserRole.SuperAdmin),
  DivisionControllers.deleteDivision,
);

export const DivisionRoutes = router;
