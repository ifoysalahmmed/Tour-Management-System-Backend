import dotenv from "dotenv";

dotenv.config({ override: true });

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  ALLOWED_ORIGINS: string[];
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_RESET_SECRET: string;
  FORGET_PASSWORD_LIMIT_MIN: number;
  BCRYPT_SALT_ROUNDS: number;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_PHONE: string;
  SUPER_ADMIN_PICTURE: string;
  SUPER_ADMIN_ADDRESS: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  SSL: {
    STORE_ID: string;
    STORE_PASSWORD: string;
    PAYMENT_URL: string;
    VALIDATION_URL: string;
    SUCCEEDED_FRONTEND_URL: string;
    FAILED_FRONTEND_URL: string;
    CANCELLED_FRONTEND_URL: string;
    SUCCEEDED_BACKEND_URL: string;
    FAILED_BACKEND_URL: string;
    CANCELLED_BACKEND_URL: string;
  };
  CLOUDINARY: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
    FOLDER_NAME: string;
    MAX_FILE_SIZE: number;
    ALLOWED_FORMATS: string[];
    MAX_IMAGE_WIDTH: number;
    MAX_IMAGE_HEIGHT: number;
    IMAGE_QUALITY: number;
    IMAGE_CROP: string;
    IMAGE_GRAVITY: string;
  };
  EMAIL_SENDER: {
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM_EMAIL: string;
  };
  REDIS: {
    USERNAME: string;
    PASSWORD: string;
    HOST: string;
    PORT: number;
  };
}

const loadEnvVars = (): EnvVars => {
  const requiredVars = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "ALLOWED_ORIGINS",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    "JWT_RESET_SECRET",
    "FORGET_PASSWORD_LIMIT_MIN",
    "BCRYPT_SALT_ROUNDS",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_PHONE",
    "SUPER_ADMIN_PICTURE",
    "SUPER_ADMIN_ADDRESS",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "SSL_STORE_ID",
    "SSL_STORE_PASSWORD",
    "SSL_PAYMENT_URL",
    "SSL_VALIDATION_URL",
    "SSL_SUCCEEDED_FRONTEND_URL",
    "SSL_FAILED_FRONTEND_URL",
    "SSL_CANCELLED_FRONTEND_URL",
    "SSL_SUCCEEDED_BACKEND_URL",
    "SSL_FAILED_BACKEND_URL",
    "SSL_CANCELLED_BACKEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_FOLDER_NAME",
    "CLOUDINARY_MAX_FILE_SIZE",
    "CLOUDINARY_ALLOWED_FORMATS",
    "CLOUDINARY_MAX_IMAGE_WIDTH",
    "CLOUDINARY_MAX_IMAGE_HEIGHT",
    "CLOUDINARY_IMAGE_QUALITY",
    "CLOUDINARY_IMAGE_CROP",
    "CLOUDINARY_IMAGE_GRAVITY",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM_EMAIL",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
    "REDIS_HOST",
    "REDIS_PORT",
  ];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `The following required environment variables are missing: ${missingVars.join(", ")}`,
    );
  }

  return {
    PORT: Number(process.env.PORT) || 5000,
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS as string)
      .split(",")
      .map((origin) => origin.trim()),
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    JWT_RESET_SECRET: process.env.JWT_RESET_SECRET as string,
    FORGET_PASSWORD_LIMIT_MIN:
      Number(process.env.FORGET_PASSWORD_LIMIT_MIN) || 30,
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
    SUPER_ADMIN_PICTURE: process.env.SUPER_ADMIN_PICTURE as string,
    SUPER_ADMIN_ADDRESS: process.env.SUPER_ADMIN_ADDRESS as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    SSL: {
      STORE_ID: process.env.SSL_STORE_ID as string,
      STORE_PASSWORD: process.env.SSL_STORE_PASSWORD as string,
      PAYMENT_URL: process.env.SSL_PAYMENT_URL as string,
      VALIDATION_URL: process.env.SSL_VALIDATION_URL as string,
      SUCCEEDED_FRONTEND_URL: process.env.SSL_SUCCEEDED_FRONTEND_URL as string,
      FAILED_FRONTEND_URL: process.env.SSL_FAILED_FRONTEND_URL as string,
      CANCELLED_FRONTEND_URL: process.env.SSL_CANCELLED_FRONTEND_URL as string,
      SUCCEEDED_BACKEND_URL: process.env.SSL_SUCCEEDED_BACKEND_URL as string,
      FAILED_BACKEND_URL: process.env.SSL_FAILED_BACKEND_URL as string,
      CANCELLED_BACKEND_URL: process.env.SSL_CANCELLED_BACKEND_URL as string,
    },
    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      API_KEY: process.env.CLOUDINARY_API_KEY as string,
      API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
      FOLDER_NAME: process.env.CLOUDINARY_FOLDER_NAME as string,
      MAX_FILE_SIZE: Number(process.env.CLOUDINARY_MAX_FILE_SIZE),
      ALLOWED_FORMATS: (process.env.CLOUDINARY_ALLOWED_FORMATS as string)
        .split(",")
        .map((f) => f.trim()),
      MAX_IMAGE_WIDTH: Number(process.env.CLOUDINARY_MAX_IMAGE_WIDTH),
      MAX_IMAGE_HEIGHT: Number(process.env.CLOUDINARY_MAX_IMAGE_HEIGHT),
      IMAGE_QUALITY: Number(process.env.CLOUDINARY_IMAGE_QUALITY),
      IMAGE_CROP: process.env.CLOUDINARY_IMAGE_CROP as string,
      IMAGE_GRAVITY: process.env.CLOUDINARY_IMAGE_GRAVITY as string,
    },
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: Number(process.env.SMTP_PORT),
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL as string,
    },
    REDIS: {
      USERNAME: process.env.REDIS_USERNAME as string,
      PASSWORD: process.env.REDIS_PASSWORD as string,
      HOST: process.env.REDIS_HOST as string,
      PORT: Number(process.env.REDIS_PORT),
    },
  };
};

export const envVars: EnvVars = loadEnvVars();
