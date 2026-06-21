import multer from "multer";

import { envVars } from "./env.js";

const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const allowedFileMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, done) => {
    if (allowedImageMimeTypes.includes(file.mimetype)) {
      done(null, true);
    } else {
      done(new Error("Only image files are allowed"));
    }
  },
  limits: { fileSize: envVars.CLOUDINARY.MAX_FILE_SIZE },
});

export const uploadFile = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, done) => {
    if (allowedFileMimeTypes.includes(file.mimetype)) {
      done(null, true);
    } else {
      done(new Error("Only PDF and Word documents are allowed"));
    }
  },
  limits: { fileSize: envVars.CLOUDINARY.MAX_FILE_SIZE },
});

export default uploadImage;
