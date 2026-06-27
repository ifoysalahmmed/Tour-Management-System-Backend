import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Express, Request, Response } from "express";
import expressSession from "express-session";
import status from "http-status";
import passport from "passport";

import "./app/config/passport.js";
import { envVars } from "./app/config/env.js";
import errorHandler from "./app/middlewares/error.middleware.js";
import notFound from "./app/middlewares/notFound.middleware.js";
import router from "./app/routes/index.js";
import sendResponse from "./app/utils/sendResponse.js";

const app: Express = express();

// Configure session for short-lived OAuth authentication flow
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000, // Session expires after 5 minutes during OAuth handshake
    },
  }),
);

// Register global application middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(
  cors({
    origin: envVars.ALLOWED_ORIGINS,
    credentials: true,
  }),
);

// Register API routes
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Tour Management API is running successfully",
  });
});

// Handle requests to undefined routes
app.use(notFound);

// Handle application errors globally
app.use(errorHandler);

export default app;
