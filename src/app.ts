import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { UserRoutes } from "./app/modules/user/user.route.js";
import cors from "cors";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/v1/users", UserRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Tour Management API",
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;
