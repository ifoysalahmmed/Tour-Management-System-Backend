import { Router } from "express";

import validateBody from "../../middlewares/validateBody.middleware.js";
import { divisionZodSchema } from "./division.validation.js";
import { DivisionControllers } from "./division.controller.js";
import checkAuth from "../../middlewares/checkAuth.middleware.js";
import { UserRole } from "../user/user.interface.js";

const router = Router();

router.post(
  "/create",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(divisionZodSchema),
  DivisionControllers.createDivision,
);

export const DivisionRoutes = router;
