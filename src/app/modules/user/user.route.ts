import { Router } from "express";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserControllers } from "./user.controller.js";
import { createUserZodSchema } from "./user.validation.js";

const router = Router();

router.post(
  "/register",
  validateBody(createUserZodSchema),
  UserControllers.createUser,
);
router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;
