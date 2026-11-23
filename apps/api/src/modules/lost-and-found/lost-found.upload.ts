import type { RequestHandler } from "express";
import multer, { MulterError } from "multer";

const ALLOWED_IMAGE_TYPES: Record<string, string[]> = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
};

function getExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, callback) => {
    const extension = getExtension(file.originalname);
    const allowedMimes = ALLOWED_IMAGE_TYPES[extension];

    if (!allowedMimes || !allowedMimes.includes(file.mimetype.toLowerCase())) {
      callback(new Error("INVALID_PHOTO"));
      return;
    }

    callback(null, true);
  },
});

export const uploadLostFoundPhotos: RequestHandler = (req, res, next) => {
  upload.array("photos", 3)(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof MulterError) {
      if (
        error.code === "LIMIT_FILE_SIZE" ||
        error.code === "LIMIT_FILE_COUNT"
      ) {
        next(new Error(error.code === "LIMIT_FILE_SIZE" ? "PHOTO_TOO_LARGE" : "TOO_MANY_PHOTOS"));
        return;
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        next(new Error("TOO_MANY_PHOTOS"));
        return;
      }

      next(new Error("PHOTOS_UPLOAD_FAILED"));
      return;
    }

    next(error);
  });
};
