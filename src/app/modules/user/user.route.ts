import { Router } from "express";
import { UserControllers } from "./user.controller.js";

const router = Router();

router.post("/register", UserControllers.createUser);

export const UserRoutes = router;
