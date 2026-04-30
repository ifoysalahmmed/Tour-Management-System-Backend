import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Express, Request, Response } from "express";
import status from "http-status";
import passport from "passport";
import expressSession from "express-session";

import { envVars } from "./app/config/env.js";
import errorHandler from "./app/middlewares/error.middleware.js";
import notFound from "./app/middlewares/notFound.middleware.js";
import router from "./app/routes/index.js";
import sendResponse from "./app/utils/sendResponse.js";

const app: Express = express();

// Middlewares
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: envVars.ALLOWED_ORIGINS }));

// Routes
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Welcome to the Tour Management API",
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
