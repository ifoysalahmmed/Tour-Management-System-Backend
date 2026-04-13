import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { UserControllers } from "./user.controller.js";
import { createUserZodSchema } from "./user.validation.js";
import validateBody from "../../middlewares/validateBody.middleware.js";

const router = Router();

router.post(
  "/register",
  validateBody(createUserZodSchema),
  UserControllers.createUser,
);
router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;
