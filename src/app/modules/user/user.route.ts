import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import validateBody from "../../middlewares/validateBody.middleware.js";
import { UserControllers } from "./user.controller.js";
import { UserRole } from "./user.interface.js";
import { createUserZodSchema } from "./user.validation.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env.js";
import { AppError } from "../../errors/app.error.js";
import status from "http-status";

const router = Router();

router.post(
  "/register",
  validateBody(createUserZodSchema),
  UserControllers.createUser,
);
router.get(
  "/",
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "Access token is missing");
      }

      const verifiedToken = jwt.verify(accessToken, envVars.JWT_SECRET);

      const role = (verifiedToken as JwtPayload).role;
      if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
        throw new AppError(
          status.FORBIDDEN,
          "You are not authorized to access this route",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  UserControllers.getAllUsers,
);

export const UserRoutes = router;
