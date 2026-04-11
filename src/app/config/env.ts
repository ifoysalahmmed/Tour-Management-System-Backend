import dotenv from "dotenv";

dotenv.config();

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string[];
}

const loadEnvVars = (): EnvVars => {
  const requiredVars = ["PORT", "DATABASE_URL", "NODE_ENV", "ALLOWED_ORIGINS"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  return {
    PORT: Number(process.env.PORT) || 5000,
    DATABASE_URL: process.env.DATABASE_URL as string,
    NODE_ENV: process.env.NODE_ENV as string,
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS as string)
      .split(",")
      .map((origin) => origin.trim()),
  };
};

export const envVars: EnvVars = loadEnvVars();
