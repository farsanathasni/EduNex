import { randomUUID } from "node:crypto";

import { v2 as cloudinary } from "cloudinary";

export type UploadedResourceFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
};

export type StoredResourceFile = {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  bytes: number;
};

const DOCUMENT_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
]);

let configured = false;

function getClient() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("CLOUDINARY_CONFIG_MISSING");
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

function getExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function toPublicId(fileName: string): string {
  const base = fileName
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return `${base || "file"}-${Date.now()}-${randomUUID()}`;
}

export async function uploadResourceFile(
  file: UploadedResourceFile,
): Promise<StoredResourceFile> {
  const client = getClient();
  const extension = getExtension(file.originalname);
  const resourceType = DOCUMENT_EXTENSIONS.has(extension) ? "raw" : "auto";

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: "edunex/resources",
        public_id: toPublicId(file.originalname),
        resource_type: resourceType,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error("CLOUDINARY_UPLOAD_FAILED"));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          bytes: result.bytes,
        });
      },
    );

    stream.end(file.buffer);
  });
}

export async function deleteResourceFile(
  publicId: string,
  resourceType: string,
): Promise<void> {
  const client = getClient();
  const type =
    resourceType === "raw" || resourceType === "video" || resourceType === "image"
      ? resourceType
      : "auto";

  await client.uploader.destroy(publicId, {
    resource_type: type,
    invalidate: true,
  });
}
