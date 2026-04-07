import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5000;
let server: Server;

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Connected to MongoDB using Mongoose");

    server = app.listen(PORT, () => {
      console.log(`Server is listening to PORT ${PORT}`);
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
