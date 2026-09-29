import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { supabaseClient } from "../config/supabase.js";
import { env } from "../config/env.js";

export interface FileStorageService {
  upload(file: Express.Multer.File): Promise<string>;
  delete(pathOrUrl: string): Promise<void>;
}

export class SupabaseStorageService implements FileStorageService {
  private bucket: string;

  constructor(bucket: string = env.SUPABASE_STORAGE_BUCKET) {
    this.bucket = bucket;
  }

  async upload(file: Express.Multer.File): Promise<string> {
    if (!supabaseClient) {
      throw new Error("Supabase client is not configured");
    }

    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueFilename = `${crypto.randomUUID()}${ext}`;
    const filePath = `waste-images/${uniqueFilename}`;

    const { data, error } = await supabaseClient.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload image to Supabase: ${error.message}`);
    }

    const { data: urlData } = supabaseClient.storage
      .from(this.bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async delete(pathOrUrl: string): Promise<void> {
    if (!supabaseClient) {
      return;
    }

    try {
      // Extract file path inside bucket from URL
      let relativePath = pathOrUrl;
      const bucketMarker = `/${this.bucket}/`;
      if (pathOrUrl.includes(bucketMarker)) {
        relativePath = pathOrUrl.split(bucketMarker)[1];
      }

      const { error } = await supabaseClient.storage
        .from(this.bucket)
        .remove([relativePath]);

      if (error) {
        console.error(`Failed to delete file from Supabase storage: ${error.message}`);
      }
    } catch (err) {
      console.error("Error deleting file from Supabase storage:", err);
    }
  }
}

export class LocalFileStorageService implements FileStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), "uploads");
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create local uploads directory:", err);
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    await this.ensureUploadDir();
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueFilename = `${crypto.randomUUID()}${ext}`;
    const targetPath = path.join(this.uploadDir, uniqueFilename);

    await fs.writeFile(targetPath, file.buffer);

    // Return absolute URL reachable from frontend
    const baseUrl = env.BETTER_AUTH_URL.replace(/\/$/, "");
    return `${baseUrl}/uploads/${uniqueFilename}`;
  }

  async delete(pathOrUrl: string): Promise<void> {
    try {
      const filename = path.basename(pathOrUrl);
      const targetPath = path.join(this.uploadDir, filename);
      await fs.unlink(targetPath);
    } catch (err) {
      // Ignore if file doesn't exist
    }
  }
}

// Storage service singleton factory
let storageInstance: FileStorageService | null = null;

export function getStorageService(): FileStorageService {
  if (!storageInstance) {
    if (supabaseClient) {
      console.log("Using SupabaseStorageService for image uploads");
      storageInstance = new SupabaseStorageService();
    } else {
      console.log("Using LocalFileStorageService for image uploads (Supabase credentials not set)");
      storageInstance = new LocalFileStorageService();
    }
  }
  return storageInstance;
}
