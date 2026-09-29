from abc import ABC, abstractmethod
from typing import List
from PIL import Image
from app.schemas.detection import Detection


class WasteDetector(ABC):
    """Abstract base class for waste detection algorithms."""

    @abstractmethod
    def predict(self, image: Image.Image) -> List[Detection]:
        """Analyze an image and return waste detections.

        Args:
            image: A PIL Image object.

        Returns:
            A list of Detection objects with category, isEwaste, confidence, and boundingBox.
        """
        raise NotImplementedError
