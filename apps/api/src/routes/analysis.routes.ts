import { Router } from "express";
import { analysisController } from "../controllers/analysis.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";

const router = Router();

// Rate-limited & authenticated analysis endpoints
router.post(
  "/",
  requireAuth,
  uploadMiddleware.single("image"),
  analysisController.create.bind(analysisController)
);

router.get("/", requireAuth, analysisController.list.bind(analysisController));

router.get("/:id", requireAuth, analysisController.getById.bind(analysisController));

router.delete("/:id", requireAuth, analysisController.delete.bind(analysisController));

export default router;
