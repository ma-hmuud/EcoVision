import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/ecovision"),
  BETTER_AUTH_SECRET: z.string().default("ecovision-super-secret-key-32chars-min-change-in-prod"),
  BETTER_AUTH_URL: z.string().default("http://localhost:5000"),
  GOOGLE_CLIENT_ID: z.string().default("demo-google-client-id"),
  GOOGLE_CLIENT_SECRET: z.string().default("demo-google-client-secret"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  AI_SERVICE_URL: z.string().default("http://localhost:8000"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("ecovision-images"),
});

export const env = envSchema.parse(process.env);
