import { v2 as cloudinary } from "cloudinary";

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

export const uploadToCloudinary = (
  buffer: Buffer,
  options?: { width?: number; height?: number },
): Promise<string> =>
  new Promise((resolve, reject) => {
    const crop = envVars.CLOUDINARY.IMAGE_CROP;
    const width = options?.width ?? envVars.CLOUDINARY.MAX_IMAGE_WIDTH;
    const height = options?.height ?? envVars.CLOUDINARY.MAX_IMAGE_HEIGHT;

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: envVars.CLOUDINARY.FOLDER_NAME,
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
