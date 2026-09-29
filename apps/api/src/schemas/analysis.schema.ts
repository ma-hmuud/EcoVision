import { z } from "zod";

export const getAnalysesQuerySchema = z.object({
  search: z.string().optional(),
  filter: z.enum(["all", "ewaste", "non-ewaste"]).default("all"),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export const analysisIdParamSchema = z.object({
  id: z.string().min(1, "Analysis ID is required"),
});

export type GetAnalysesQuery = z.infer<typeof getAnalysesQuerySchema>;
export type AnalysisIdParam = z.infer<typeof analysisIdParamSchema>;
