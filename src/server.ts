/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { envVars } from "./app/config/env.js";
import nodeDns from "node:dns";
import seedSuperAdmin from "./app/utils/seedSuperAdmin.js";

nodeDns.setServers(["1.1.1.1", "8.8.8.8"]); // Set custom DNS servers to avoid potential DNS resolution issues

let server: Server;

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(envVars.DATABASE_URL);
    console.log("Connected to MongoDB using Mongoose");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to PORT ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

const gracefulShutdown = (event: string, isError = false) => {
  return (reason?: Error | unknown): void => {
    if (isError) {
      console.error(`Received ${event}:`, reason);
    } else {
      console.log(`Received ${event}, shutting down gracefully...`);
    }

    if (server) {
      server.close(() => {
        console.log(`Server closed due to ${event}`);
        mongoose.connection.close().then(() => {
          console.log("MongoDB connection closed");
          process.exit(isError ? 1 : 0);
        });
      });
    } else {
      console.log("No server to close, exiting process");
      process.exit(isError ? 1 : 0);
    }
  };
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("SIGTERM", gracefulShutdown("SIGTERM"));
process.on("SIGINT", gracefulShutdown("SIGINT"));

process.on("unhandledRejection", gracefulShutdown("unhandledRejection", true));
process.on("uncaughtException", gracefulShutdown("uncaughtException", true));
