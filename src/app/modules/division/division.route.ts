import { Router } from "express";

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
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createDivisionZodSchema),
  DivisionControllers.createDivision,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DivisionControllers.getAllDivisions,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(updateDivisionZodSchema),
  DivisionControllers.updateDivision,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DivisionControllers.deleteDivision,
);

export const DivisionRoutes = router;
