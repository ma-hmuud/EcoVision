import { env } from "../config/env.js";
import { AiPredictResponse } from "../types/index.js";

export class AiService {
  private aiServiceUrl: string;

  constructor(aiServiceUrl: string = env.AI_SERVICE_URL) {
    this.aiServiceUrl = aiServiceUrl.replace(/\/$/, "");
  }

  async predictWaste(file: Express.Multer.File): Promise<AiPredictResponse> {
    const endpoint = `${this.aiServiceUrl}/predict`;

    try {
      const formData = new FormData();
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append("image", blob, file.originalname || "waste.jpg");

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `AI service responded with status ${response.status}: ${errorText}`
        );
      }

      const data = (await response.json()) as AiPredictResponse;

      if (!data || !Array.isArray(data.detections)) {
        throw new Error("Invalid response format received from AI service");
      }

      return data;
    } catch (err: any) {
      console.error(`AI service error calling ${endpoint}:`, err.message);
      throw new Error(`Failed to communicate with AI service: ${err.message}`);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const aiService = new AiService();
