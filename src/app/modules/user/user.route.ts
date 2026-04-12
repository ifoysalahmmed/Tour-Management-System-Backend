import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { UserControllers } from "./user.controller.js";
import createUserZodSchema from "./user.validation.js";

const router = Router();

router.post(
  "/register",
  async (_req: Request, res: Response, _next: NextFunction) => {
    _req.body = await createUserZodSchema.parseAsync(_req.body);

    console.log(_req.body);

    UserControllers.createUser(_req, res, _next);
  },
);
router.get("/", UserControllers.getAllUsers);

export const UserRoutes = router;
