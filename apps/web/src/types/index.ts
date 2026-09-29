export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  analysisId: string;
  category: string;
  isEwaste: boolean;
  confidence: number;
  boundingBox: BoundingBox | null;
}

export interface Analysis {
  id: string;
  userId: string;
  imageUrl: string;
  isEwaste: boolean;
  createdAt: string;
  updatedAt: string;
  detections: Detection[];
}

export interface DashboardStats {
  totalAnalyses: number;
  ewasteCount: number;
  nonEwasteCount: number;
  ewastePercentage: number;
  mostFrequentCategory: string | null;
  recentAnalyses: Analysis[];
  categoryBreakdown: { category: string; count: number; isEwaste: boolean }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}
