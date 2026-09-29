import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.detectors import MockWasteDetector, WasteDetector, YOLOWasteDetector
from app.routes.predict import router as predict_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("ecovision-ai")


def create_detector() -> WasteDetector:
    """Factory to initialize the appropriate waste detector based on environment configuration."""
    model_path = os.getenv("MODEL_PATH", "models/waste_detector.pt")
    use_yolo = os.getenv("USE_YOLO", "false").lower() in ("true", "1", "yes")

    if use_yolo or os.path.exists(model_path):
        logger.info(f"Initializing YOLOWasteDetector (model path: {model_path})")
        return YOLOWasteDetector(model_path=model_path)

    logger.info("Initializing MockWasteDetector for development/testing")
    return MockWasteDetector()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup detector on app state
    app.state.detector = create_detector()
    yield


app = FastAPI(
    title="EcoVision AI Waste Detection Service",
    description="AI service for detecting waste categories, e-waste classification, and bounding boxes.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(predict_router)


@app.get("/")
@app.get("/health")
async def health_check():
    detector_type = app.state.detector.__class__.__name__ if hasattr(app.state, "detector") else "Unknown"
    return {
        "status": "ok",
        "service": "EcoVision AI",
        "detector": detector_type,
    }
