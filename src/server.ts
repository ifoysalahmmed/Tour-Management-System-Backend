/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { envVars } from "./app/config/env.js";

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

const gracefulShutdown = (event: string) => {
  return (reason?: Error | unknown): void => {
    console.error(`Received ${event}:`, reason);

    if (server) {
      server.close(() => {
        console.log(`Server closed due to ${event}`);
        mongoose.connection.close().then(() => {
          console.log("MongoDB connection closed");
          process.exit(1);
        });
      });
    } else {
      console.log("No server to close, exiting process");
      process.exit(1);
    }
  };
};

startServer();

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");

  if (server) {
    server.close(() => {
      console.log("Server closed due to Signal Termination");
      mongoose.connection.close().then(() => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
  } else {
    console.log("No server to close, exiting process");
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");

  if (server) {
    server.close(() => {
      console.log("Server closed due to Signal Interruption");
      mongoose.connection.close().then(() => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
  } else {
    console.log("No server to close, exiting process");
    process.exit(0);
  }
});

process.on("unhandledRejection", gracefulShutdown("unhandledRejection"));
process.on("uncaughtException", gracefulShutdown("uncaughtException"));
