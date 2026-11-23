import {
  deleteResourceFile,
  uploadResourceFile,
  type UploadedResourceFile,
} from "../../lib/cloudinary.js";
import type { LostFoundPhoto } from "./lost-and-found.types.js";

const LOST_FOUND_FOLDER = "edunex/lost-found";

export interface LostFoundStorage {
  store(files: UploadedResourceFile[]): Promise<LostFoundPhoto[]>;
  remove(photos: LostFoundPhoto[]): Promise<void>;
}

export const lostFoundStorage: LostFoundStorage = {
  async store(files) {
    const stored: LostFoundPhoto[] = [];

    try {
      for (const file of files) {
        const result = await uploadResourceFile(file, LOST_FOUND_FOLDER);

        stored.push({
          url: result.secureUrl,
          publicId: result.publicId,
          resourceType: result.resourceType,
          bytes: result.bytes,
        });
      }

      return stored;
    } catch (error) {
      await this.remove(stored);
      throw error;
    }
  },

  async remove(photos) {
    await Promise.all(
      photos.map((photo) =>
        deleteResourceFile(photo.publicId, photo.resourceType).catch(
          () => undefined,
        ),
      ),
    );
  },
};
