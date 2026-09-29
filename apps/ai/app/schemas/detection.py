from typing import List, Optional
from pydantic import BaseModel, Field

E_WASTE_CATEGORIES = {
    "Mobile phone",
    "Laptop",
    "Tablet",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Printer",
    "Charger",
    "Power adapter",
    "Cable",
    "Battery",
    "Computer components",
    "Other electronic device",
}

NON_E_WASTE_CATEGORIES = {
    "Plastic",
    "Paper",
    "Cardboard",
    "Glass",
    "Metal",
    "Food waste",
    "Organic waste",
    "General waste",
    "Other",
}


def is_ewaste_category(category: str) -> bool:
    """Check if the given category belongs to e-waste."""
    # Match case-insensitively or directly
    cat_lower = category.strip().lower()
    for ew in E_WASTE_CATEGORIES:
        if ew.lower() == cat_lower:
            return True
    return False


class BoundingBox(BaseModel):
    x: float = Field(..., description="Top-left X coordinate in pixels")
    y: float = Field(..., description="Top-left Y coordinate in pixels")
    width: float = Field(..., description="Width of bounding box in pixels")
    height: float = Field(..., description="Height of bounding box in pixels")


class Detection(BaseModel):
    category: str = Field(..., description="Detected category name")
    isEwaste: bool = Field(..., description="Whether this item is e-waste")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    boundingBox: Optional[BoundingBox] = Field(None, description="Bounding box if available")


class PredictResponse(BaseModel):
    detections: List[Detection] = Field(default_factory=list, description="List of detected waste objects")
