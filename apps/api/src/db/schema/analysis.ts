import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const analysis = pgTable(
  "analysis",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    isEwaste: boolean("is_ewaste").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("analysis_user_id_idx").on(table.userId),
    isEwasteIdx: index("analysis_is_ewaste_idx").on(table.isEwaste),
    createdAtIdx: index("analysis_created_at_idx").on(table.createdAt),
  })
);
