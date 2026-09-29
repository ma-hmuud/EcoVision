import multer from "multer";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

// 10 MB limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
      return cb(
        new Error(
          `Invalid file format: ${file.mimetype}. Allowed formats: JPG, JPEG, PNG, WEBP`
        )
      );
    }
    cb(null, true);
  },
});
