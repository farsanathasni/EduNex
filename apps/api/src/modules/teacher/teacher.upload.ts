import type { RequestHandler } from "express";
import multer, { MulterError } from "multer";

const ALLOWED_TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ppt: ["application/vnd.ms-powerpoint"],
  pptx: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  xls: ["application/vnd.ms-excel"],
  xlsx: [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  mp4: ["video/mp4"],
};

function getExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const extension = getExtension(file.originalname);
    const allowedMimes = ALLOWED_TYPES[extension];

    if (!allowedMimes || !allowedMimes.includes(file.mimetype.toLowerCase())) {
      callback(new Error("INVALID_FILE_TYPE"));
      return;
    }

    callback(null, true);
  },
});

const handleUpload: RequestHandler = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(new Error("FILE_TOO_LARGE"));
        return;
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        next(new Error("UNEXPECTED_FILE_FIELD"));
        return;
      }

      next(new Error("FILE_UPLOAD_FAILED"));
      return;
    }

    next(error);
  });
};

export const uploadMaterialFile = handleUpload;
