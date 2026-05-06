import { Router } from "express";

import checkAuth from "../../middlewares/checkAuth.middleware.js";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserRole } from "../user/user.interface.js";
import { DivisionControllers } from "./division.controller.js";
import { divisionZodSchema } from "./division.validation.js";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(divisionZodSchema),
  DivisionControllers.createDivision,
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DivisionControllers.getAllDivisions,
);

export const DivisionRoutes = router;
