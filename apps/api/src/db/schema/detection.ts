import { pgTable, text, boolean, doublePrecision, index } from "drizzle-orm/pg-core";
import { analysis } from "./analysis";

export const detection = pgTable(
  "detection",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    analysisId: text("analysis_id")
      .notNull()
      .references(() => analysis.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    isEwaste: boolean("is_ewaste").notNull().default(false),
    confidence: doublePrecision("confidence").notNull(),
    boundingBoxX: doublePrecision("bounding_box_x"),
    boundingBoxY: doublePrecision("bounding_box_y"),
    boundingBoxWidth: doublePrecision("bounding_box_width"),
    boundingBoxHeight: doublePrecision("bounding_box_height"),
  },
  (table) => ({
    analysisIdIdx: index("detection_analysis_id_idx").on(table.analysisId),
    categoryIdx: index("detection_category_idx").on(table.category),
    isEwasteIdx: index("detection_is_ewaste_idx").on(table.isEwaste),
  })
);
