import { cloudinary } from "../../config/cloudinary.config.js";
import { envVars } from "../../config/env.js";
import { slugify } from "../../utils/slugify.js";

const GRAVITY_SUPPORTED_CROPS = new Set([
  "crop",
  "fill",
  "thumb",
  "lfill",
  "fill_pad",
  "auto",
  "auto_pad",
]);

const FOLDER_MAP: Record<string, string> = {
  image: "images",
  video: "videos",
  raw: "files",
  auto: "images",
};

const buildPublicId = (filename: string, keepExtension = false): string => {
  const lastDot = filename.lastIndexOf(".");
  const ext = lastDot !== -1 ? filename.slice(lastDot) : "";
  const name = lastDot !== -1 ? filename.slice(0, lastDot) : filename;
  const base36 = Math.random().toString(36).slice(2);

  return `${base36}-${Date.now()}-${slugify(name)}${keepExtension ? ext : ""}`;
};

export const uploadToCloudinary = (
  buffer: Buffer,
  options?: {
    width?: number;
    height?: number;
    filename?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
  },
): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const resourceType = options?.resourceType ?? "auto";
      const isImage = resourceType === "image" || resourceType === "auto";

      const crop = envVars.CLOUDINARY.IMAGE_CROP;
      const width = options?.width ?? envVars.CLOUDINARY.MAX_IMAGE_WIDTH;
      const height = options?.height ?? envVars.CLOUDINARY.MAX_IMAGE_HEIGHT;

      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: `${envVars.CLOUDINARY.FOLDER_NAME}/${FOLDER_MAP[resourceType]}`,
          ...(options?.filename && {
            public_id: buildPublicId(options.filename, resourceType === "raw"),
          }),
          ...(isImage && {
            transformation: {
              width,
              height,
              crop,
              ...(GRAVITY_SUPPORTED_CROPS.has(crop) && {
                gravity: envVars.CLOUDINARY.IMAGE_GRAVITY,
              }),
              quality: envVars.CLOUDINARY.IMAGE_QUALITY,
            },
          }),
        },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error("Failed to upload to Cloudinary"));
          }

          resolve(result.secure_url);
        },
      );

      stream.end(buffer);
    } catch (error) {
      reject(
        new Error(
          `Cloudinary upload failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });
