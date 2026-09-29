import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index.js";
import { analysisService } from "../services/analysis.service.js";

export class DashboardController {
  async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const stats = await analysisService.getDashboardStats(userId);
      return res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
