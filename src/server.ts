/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import nodeDns from "node:dns";

import app from "./app.js";
import { envVars } from "./app/config/env.js";
import { connectRedis } from "./app/config/redis.config.js";
import seedSuperAdmin from "./app/utils/seedSuperAdmin.js";

// Use reliable public DNS servers to reduce connection issues during startup
nodeDns.setServers(["1.1.1.1", "8.8.8.8"]);

let server: Server;

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(envVars.DATABASE_URL);
    console.log("MongoDB connection established successfully");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

const gracefulShutdown = (event: string, isError = false) => {
  return (reason?: Error | unknown): void => {
    if (isError) {
      console.error(`Unexpected ${event} detected:`, reason);
    } else {
      console.log(`${event} received. Starting graceful shutdown...`);
    }

    if (server) {
      server.close(() => {
        console.log(`HTTP server closed after ${event}`);

        mongoose.connection.close().then(() => {
          console.log("MongoDB connection closed successfully");
          process.exit(isError ? 1 : 0);
        });
      });
    } else {
      console.log("No active HTTP server found. Exiting process...");
      process.exit(isError ? 1 : 0);
    }
  };
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

process.on("SIGTERM", gracefulShutdown("SIGTERM"));
process.on("SIGINT", gracefulShutdown("SIGINT"));
process.on("unhandledRejection", gracefulShutdown("unhandledRejection", true));
process.on("uncaughtException", gracefulShutdown("uncaughtException", true));
