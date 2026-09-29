import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { analysisService } from "../services/analysis.service.js";
import {
  getAnalysesQuerySchema,
  analysisIdParamSchema,
} from "../schemas/analysis.schema.js";

export class AnalysisController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Missing image",
          message: "Please upload an image to analyze",
        });
      }

      const userId = req.user!.id;
      const result = await analysisService.createAnalysis(userId, req.file);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = getAnalysesQuerySchema.parse(req.query);
      const userId = req.user!.id;
      const result = await analysisService.getAnalyses(userId, query);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = analysisIdParamSchema.parse(req.params);
      const userId = req.user!.id;
      const result = await analysisService.getAnalysisById(userId, id);

      if (!result) {
        return res.status(404).json({
          error: "Not Found",
          message: "Analysis not found or you do not have permission to view it",
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = analysisIdParamSchema.parse(req.params);
      const userId = req.user!.id;
      const deleted = await analysisService.deleteAnalysis(userId, id);

      if (!deleted) {
        return res.status(404).json({
          error: "Not Found",
          message: "Analysis not found or you do not have permission to delete it",
        });
      }

      return res.status(200).json({
        message: "Analysis deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analysisController = new AnalysisController();
