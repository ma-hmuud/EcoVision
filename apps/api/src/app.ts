import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";

import { env } from "./config/env.js";
import { auth } from "./config/better-auth.js";
import analysisRoutes from "./routes/analysis.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();

  // Trust first proxy when running in Docker or behind reverse proxies
  app.set("trust proxy", 1);

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    env.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true); // Dev-friendly fallback
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-demo-user-id"],
    })
  );

  // Logging
  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Serve locally uploaded images
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  app.use("/uploads", express.static(uploadsDir));

  // Better Auth handler - Official Node / Express handler
  app.all("/api/auth/*", toNodeHandler(auth));

  // Body parsers for remaining application endpoints
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // General rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  });
  app.use("/api", generalLimiter);

  // Specific rate limiter for analysis creation (prevent spam uploads)
  const analysisUploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many upload requests. Please wait a moment." },
  });

  // Application Routes
  app.use("/api/analyses", analysisUploadLimiter, analysisRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "EcoVision API",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // 404 Handler
  app.use((_req, res) => {
    res.status(404).json({
      error: "Not Found",
      message: "The requested route does not exist",
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
