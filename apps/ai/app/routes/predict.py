import io
import logging
from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status
from PIL import Image

from app.schemas.detection import PredictResponse

router = APIRouter()
logger = logging.getLogger(__name__)

SUPPORTED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@router.post("/predict", response_model=PredictResponse)
async def predict_waste(
    request: Request,
    image: UploadFile = File(..., description="Waste image file to analyze"),
):
    """Analyze uploaded waste image and return detected objects, e-waste classification,

    confidence scores, and bounding boxes.
    """
    if image.content_type and image.content_type not in SUPPORTED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {image.content_type}. Supported types: JPEG, PNG, WEBP",
        )

    try:
        contents = await image.read()
        if not contents:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty image file received",
            )

        try:
            pil_image = Image.open(io.BytesIO(contents))
            pil_image.verify()  # Verify integrity
            # Reopen after verify
            pil_image = Image.open(io.BytesIO(contents))
        except Exception as img_err:
            logger.warning(f"Invalid image format: {img_err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Corrupted or unreadable image file",
            )

        detector = request.app.state.detector
        detections = detector.predict(pil_image)

        return PredictResponse(detections=detections)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error predicting waste: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze image",
        )
