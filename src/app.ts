import express, { type Express, type Request, type Response } from "express";

const app: Express = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Tour Management API",
  });
});

export default app;
