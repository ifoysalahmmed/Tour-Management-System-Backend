import dotenv from "dotenv";

dotenv.config({ override: true });

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: string;
  ALLOWED_ORIGINS: string[];
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
}

const loadEnvVars = (): EnvVars => {
  const requiredVars = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "ALLOWED_ORIGINS",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "BCRYPT_SALT_ROUNDS",
  ];
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
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  };
};

export const envVars: EnvVars = loadEnvVars();
