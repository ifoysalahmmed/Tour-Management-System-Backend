import { v2 as cloudinary } from "cloudinary";

import { slugify } from "../utils/slugify.js";
import { envVars } from "./env.js";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET,
});

const GRAVITY_SUPPORTED_CROPS = new Set([
  "crop",
  "fill",
  "thumb",
  "lfill",
  "fill_pad",
  "auto",
  "auto_pad",
]);

const buildPublicId = (filename: string): string => {
  const lastDot = filename.lastIndexOf(".");
  const name = lastDot !== -1 ? filename.slice(0, lastDot) : filename;
  const base36 = Math.random().toString(36).slice(2);
  return `${base36}-${Date.now()}-${slugify(name)}`;
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) return;

  const resourceTypeMatch = url.slice(0, uploadIndex).match(/\/([^/]+)$/);
  const resourceType = resourceTypeMatch?.[1] ?? "image";

  const afterUpload = url.slice(uploadIndex + 8).replace(/^v\d+\//, "");
  const lastDot = afterUpload.lastIndexOf(".");
  const publicId = lastDot !== -1 ? afterUpload.slice(0, lastDot) : afterUpload;

  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

export const uploadToCloudinary = (
  buffer: Buffer,
  options?: { width?: number; height?: number; filename?: string },
): Promise<string> =>
  new Promise((resolve, reject) => {
    const crop = envVars.CLOUDINARY.IMAGE_CROP;
    const width = options?.width ?? envVars.CLOUDINARY.MAX_IMAGE_WIDTH;
    const height = options?.height ?? envVars.CLOUDINARY.MAX_IMAGE_HEIGHT;

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: envVars.CLOUDINARY.FOLDER_NAME,
        ...(options?.filename && {
          public_id: buildPublicId(options.filename),
        }),
        transformation: {
          width,
          height,
          crop,
          ...(GRAVITY_SUPPORTED_CROPS.has(crop) && {
            gravity: envVars.CLOUDINARY.IMAGE_GRAVITY,
          }),
          quality: envVars.CLOUDINARY.IMAGE_QUALITY,
        },
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Failed to upload to Cloudinary"));
        }

        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
