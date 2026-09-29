import { Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/better-auth.js";
import { env } from "../config/env.js";
import { AuthenticatedRequest } from "../types/index.js";
import { db } from "../db/index.js";
import { user } from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const headers = fromNodeHeaders(req.headers);
    const sessionData = await auth.api.getSession({
      headers,
    });

    if (sessionData && sessionData.user) {
      req.user = sessionData.user;
      req.session = sessionData.session;
      return next();
    }

    // Dev/testing fallback: Allow seamless testing in dev when Google OAuth credentials
    // are not yet provisioned in Google Cloud console.
    const isDev = env.NODE_ENV !== "production";
    const demoHeader = req.headers["x-demo-user-id"] as string;

    if (isDev && demoHeader) {
      // Find or create demo user
      let existingUser = await db
        .select()
        .from(user)
        .where(eq(user.id, demoHeader))
        .limit(1);

      if (existingUser.length === 0) {
        const newUser = {
          id: demoHeader,
          name: "EcoVision Explorer",
          email: "explorer@ecovision.dev",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await db.insert(user).values(newUser);
        existingUser = [newUser];
      }

      req.user = existingUser[0];
      req.session = {
        id: "demo-session-id",
        userId: existingUser[0].id,
        expiresAt: new Date(Date.now() + 86400000),
      };
      return next();
    }

    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication required to access this resource",
    });
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Session validation failed",
    });
  }
}
