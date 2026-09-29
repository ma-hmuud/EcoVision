import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { analysis, detection } from "../db/schema/index.js";
import { getStorageService } from "./storage.service.js";
import { aiService } from "./ai.service.js";
import {
  AnalysisDTO,
  DetectionDTO,
  DashboardStats,
} from "../types/index.js";
import { GetAnalysesQuery } from "../schemas/analysis.schema.js";

export class AnalysisService {
  async createAnalysis(
    userId: string,
    file: Express.Multer.File
  ): Promise<AnalysisDTO> {
    const storage = getStorageService();

    // 1. Upload image to storage (Supabase or Local)
    const imageUrl = await storage.upload(file);

    // 2. Call AI service for waste detection
    const aiResult = await aiService.predictWaste(file);

    // 3. Determine if overall analysis has e-waste
    const isEwaste = aiResult.detections.some((d) => d.isEwaste);

    // 4. Save to database using transaction
    const analysisId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(analysis).values({
        id: analysisId,
        userId,
        imageUrl,
        isEwaste,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (aiResult.detections.length > 0) {
        const detectionRows = aiResult.detections.map((d) => ({
          id: crypto.randomUUID(),
          analysisId,
          category: d.category,
          isEwaste: d.isEwaste,
          confidence: d.confidence,
          boundingBoxX: d.boundingBox ? d.boundingBox.x : null,
          boundingBoxY: d.boundingBox ? d.boundingBox.y : null,
          boundingBoxWidth: d.boundingBox ? d.boundingBox.width : null,
          boundingBoxHeight: d.boundingBox ? d.boundingBox.height : null,
        }));

        await tx.insert(detection).values(detectionRows);
      }
    });

    const created = await this.getAnalysisById(userId, analysisId);
    if (!created) {
      throw new Error("Failed to retrieve created analysis");
    }
    return created;
  }

  async getAnalyses(
    userId: string,
    params: GetAnalysesQuery
  ): Promise<{ analyses: AnalysisDTO[]; total: number }> {
    const conditions = [eq(analysis.userId, userId)];

    if (params.filter === "ewaste") {
      conditions.push(eq(analysis.isEwaste, true));
    } else if (params.filter === "non-ewaste") {
      conditions.push(eq(analysis.isEwaste, false));
    }

    const orderBy =
      params.sort === "oldest" ? asc(analysis.createdAt) : desc(analysis.createdAt);

    // Fetch user analyses
    const rows = await db
      .select()
      .from(analysis)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(params.limit)
      .offset(params.offset);

    // Map detections for each analysis
    const analyses: AnalysisDTO[] = [];
    for (const row of rows) {
      const detections = await db
        .select()
        .from(detection)
        .where(eq(detection.analysisId, row.id));

      // Filter by search term if requested
      if (params.search) {
        const term = params.search.toLowerCase();
        const matchesCategory = detections.some((d) =>
          d.category.toLowerCase().includes(term)
        );
        const matchesId = row.id.toLowerCase().includes(term);
        if (!matchesCategory && !matchesId) {
          continue;
        }
      }

      analyses.push(this.formatAnalysis(row, detections));
    }

    return {
      analyses,
      total: analyses.length,
    };
  }

  async getAnalysisById(
    userId: string,
    id: string
  ): Promise<AnalysisDTO | null> {
    const rows = await db
      .select()
      .from(analysis)
      .where(and(eq(analysis.id, id), eq(analysis.userId, userId)))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];
    const detections = await db
      .select()
      .from(detection)
      .where(eq(detection.analysisId, row.id));

    return this.formatAnalysis(row, detections);
  }

  async deleteAnalysis(userId: string, id: string): Promise<boolean> {
    const existing = await this.getAnalysisById(userId, id);
    if (!existing) {
      return false;
    }

    // Delete image from storage
    const storage = getStorageService();
    await storage.delete(existing.imageUrl);

    // Delete from database (detection records deleted via cascade)
    await db
      .delete(analysis)
      .where(and(eq(analysis.id, id), eq(analysis.userId, userId)));

    return true;
  }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // 1. Get all analyses for this user
    const userAnalyses = await db
      .select()
      .from(analysis)
      .where(eq(analysis.userId, userId))
      .orderBy(desc(analysis.createdAt));

    const totalAnalyses = userAnalyses.length;
    const ewasteCount = userAnalyses.filter((a) => a.isEwaste).length;
    const nonEwasteCount = totalAnalyses - ewasteCount;
    const ewastePercentage =
      totalAnalyses > 0 ? Math.round((ewasteCount / totalAnalyses) * 1000) / 10 : 0;

    // 2. Get all detections for this user to aggregate categories
    const allDetections = totalAnalyses > 0
      ? await db
          .select({
            category: detection.category,
            isEwaste: detection.isEwaste,
          })
          .from(detection)
          .innerJoin(analysis, eq(detection.analysisId, analysis.id))
          .where(eq(analysis.userId, userId))
      : [];

    const categoryMap = new Map<string, { count: number; isEwaste: boolean }>();
    for (const d of allDetections) {
      const curr = categoryMap.get(d.category) || { count: 0, isEwaste: d.isEwaste };
      curr.count += 1;
      categoryMap.set(d.category, curr);
    }

    let mostFrequentCategory: string | null = null;
    let maxCount = 0;
    const categoryBreakdown: { category: string; count: number; isEwaste: boolean }[] = [];

    for (const [cat, data] of categoryMap.entries()) {
      categoryBreakdown.push({
        category: cat,
        count: data.count,
        isEwaste: data.isEwaste,
      });
      if (data.count > maxCount) {
        maxCount = data.count;
        mostFrequentCategory = cat;
      }
    }

    categoryBreakdown.sort((a, b) => b.count - a.count);

    // 3. Get recent 5 analyses with their detections
    const recentRows = userAnalyses.slice(0, 5);
    const recentAnalyses: AnalysisDTO[] = [];
    for (const row of recentRows) {
      const detections = await db
        .select()
        .from(detection)
        .where(eq(detection.analysisId, row.id));
      recentAnalyses.push(this.formatAnalysis(row, detections));
    }

    return {
      totalAnalyses,
      ewasteCount,
      nonEwasteCount,
      ewastePercentage,
      mostFrequentCategory,
      recentAnalyses,
      categoryBreakdown,
    };
  }

  private formatAnalysis(
    row: typeof analysis.$inferSelect,
    detections: (typeof detection.$inferSelect)[]
  ): AnalysisDTO {
    const formattedDetections: DetectionDTO[] = detections.map((d) => ({
      id: d.id,
      analysisId: d.analysisId,
      category: d.category,
      isEwaste: d.isEwaste,
      confidence: d.confidence,
      boundingBox:
        d.boundingBoxX !== null &&
        d.boundingBoxY !== null &&
        d.boundingBoxWidth !== null &&
        d.boundingBoxHeight !== null
          ? {
              x: d.boundingBoxX,
              y: d.boundingBoxY,
              width: d.boundingBoxWidth,
              height: d.boundingBoxHeight,
            }
          : null,
    }));

    return {
      id: row.id,
      userId: row.userId,
      imageUrl: row.imageUrl,
      isEwaste: row.isEwaste,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      detections: formattedDetections,
    };
  }
}

export const analysisService = new AnalysisService();
