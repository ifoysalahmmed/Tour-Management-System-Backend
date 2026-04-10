import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import status from "http-status";
import router from "./app/routes/index.js";
import notFound from "./app/middlewares/notFound.middleware.js";
import errorHandler from "./app/middlewares/error.middleware.js";
import { envVars } from "./app/config/env.js";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: envVars.ALLOWED_ORIGINS }));

// Routes
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: "Welcome to the Tour Management API",
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
