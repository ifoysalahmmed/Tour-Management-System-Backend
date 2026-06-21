import status from "http-status";

import { cloudinary } from "../../config/cloudinary.config.js";
import { AppError } from "../../errors/app.error.js";

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error)
    return String((error as { message: unknown }).message);

  return JSON.stringify(error);
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return;

  const resourceTypeMatch = url.slice(0, uploadIndex).match(/\/([^/]+)$/);
  const resourceType = resourceTypeMatch?.[1] ?? "image";

  const afterUpload = url.slice(uploadIndex + 8).replace(/^v\d+\//, "");
  const lastDot = afterUpload.lastIndexOf(".");
  const publicId = lastDot !== -1 ? afterUpload.slice(0, lastDot) : afterUpload;

  let result;

  try {
    result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new AppError(
      status.BAD_REQUEST,
      `Cloudinary delete failed: ${extractErrorMessage(error)}`,
    );
  }

  if (result.result !== "ok" && result.result !== "not found") {
    throw new AppError(
      status.BAD_REQUEST,
      `Failed to delete resource "${publicId}" from Cloudinary (status: ${result.result})`,
    );
  }
};
