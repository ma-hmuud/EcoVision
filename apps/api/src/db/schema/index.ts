import { relations } from "drizzle-orm";
import { user, session, account, verification } from "./auth";
import { analysis } from "./analysis";
import { detection } from "./detection";

export * from "./auth";
export * from "./analysis";
export * from "./detection";

export const userRelations = relations(user, ({ many }) => ({
  analyses: many(analysis),
  sessions: many(session),
  accounts: many(account),
}));

export const analysisRelations = relations(analysis, ({ one, many }) => ({
  user: one(user, {
    fields: [analysis.userId],
    references: [user.id],
  }),
  detections: many(detection),
}));

export const detectionRelations = relations(detection, ({ one }) => ({
  analysis: one(analysis, {
    fields: [detection.analysisId],
    references: [analysis.id],
  }),
}));
