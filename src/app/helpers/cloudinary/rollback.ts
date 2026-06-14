import { deleteFromCloudinary } from "./delete.js";
import { uploadToCloudinary } from "./upload.js";

type UploadableFile = { buffer: Buffer; originalname: string };

export const uploadFilesWithRollback = async <T>(
  files: UploadableFile | UploadableFile[],
  operation: (urls: string[]) => Promise<T>,
): Promise<T> => {
  const fileArray = Array.isArray(files) ? files : [files];

  const urls = await Promise.all(
    fileArray.map((file) =>
      uploadToCloudinary(file.buffer, { filename: file.originalname }),
    ),
  );

  try {
    return await operation(urls);
  } catch (error) {
    await Promise.allSettled(urls.map(deleteFromCloudinary));
    throw error;
  }
};
