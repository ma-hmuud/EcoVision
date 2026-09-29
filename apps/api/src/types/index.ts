import { Request } from "express";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AiDetection {
  category: string;
  isEwaste: boolean;
  confidence: number;
  boundingBox?: BoundingBox | null;
}

export interface AiPredictResponse {
  detections: AiDetection[];
}

export interface DetectionDTO {
  id: string;
  analysisId: string;
  category: string;
  isEwaste: boolean;
  confidence: number;
  boundingBox: BoundingBox | null;
}

export interface AnalysisDTO {
  id: string;
  userId: string;
  imageUrl: string;
  isEwaste: boolean;
  createdAt: Date;
  updatedAt: Date;
  detections: DetectionDTO[];
}

export interface DashboardStats {
  totalAnalyses: number;
  ewasteCount: number;
  nonEwasteCount: number;
  ewastePercentage: number;
  mostFrequentCategory: string | null;
  recentAnalyses: AnalysisDTO[];
  categoryBreakdown: { category: string; count: number; isEwaste: boolean }[];
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  session?: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}
