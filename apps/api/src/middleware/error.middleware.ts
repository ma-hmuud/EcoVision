import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { env } from "../config/env.js";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      issues: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "Image must not exceed 10 MB in size",
      });
    }
    return res.status(400).json({
      error: "Upload error",
      message: err.message,
    });
  }

  // File filter errors
  if (err && err.message && err.message.includes("Invalid file format")) {
    return res.status(400).json({
      error: "Invalid file type",
      message: err.message,
    });
  }

  // Default server error
  console.error("Unhandled error:", err);
  const isProduction = env.NODE_ENV === "production";
  return res.status(500).json({
    error: "Internal Server Error",
    message: isProduction
      ? "An unexpected error occurred. Please try again later."
      : err.message || "Unknown error",
  });
}
