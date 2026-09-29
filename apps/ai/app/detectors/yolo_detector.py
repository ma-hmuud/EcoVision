import logging
import os
from typing import List
from PIL import Image

from app.detectors.base import WasteDetector
from app.detectors.mock_detector import MockWasteDetector
from app.schemas.detection import (
    BoundingBox,
    Detection,
    is_ewaste_category,
)

logger = logging.getLogger(__name__)


class YOLOWasteDetector(WasteDetector):
    """Real YOLO waste detector that loads weights from a .pt file.

    Falls back smoothly to MockWasteDetector if ultralytics is not installed
    or the model file is not yet present on disk.
    """

    def __init__(self, model_path: str = "models/waste_detector.pt"):
        self.model_path = model_path
        self.model = None
        self._fallback_detector = MockWasteDetector()

        if not os.path.exists(self.model_path):
            logger.warning(
                f"YOLO model weights not found at {self.model_path}. "
                "YOLOWasteDetector will operate in mock fallback mode until weights are provided."
            )
            return

        try:
            from ultralytics import YOLO  # type: ignore

            self.model = YOLO(self.model_path)
            logger.info(f"Loaded YOLO model successfully from {self.model_path}")
        except ImportError:
            logger.warning(
                "Package 'ultralytics' is not installed. Run 'pip install ultralytics' "
                "to enable real YOLO inference. Falling back to mock detector."
            )
        except Exception as e:
            logger.error(f"Failed to load YOLO model from {self.model_path}: {e}. Falling back to mock detector.")

    def predict(self, image: Image.Image) -> List[Detection]:
        if self.model is None:
            return self._fallback_detector.predict(image)

        # Run inference using ultralytics YOLO
        try:
            results = self.model(image)
            detections: List[Detection] = []

            for result in results:
                boxes = result.boxes
                for box in boxes:
                    # Coordinates in xywh format (center_x, center_y, width, height)
                    # Convert to top-left x, y, width, height
                    xywh = box.xywh[0].tolist()
                    cx, cy, w, h = xywh
                    x = max(0.0, cx - (w / 2.0))
                    y = max(0.0, cy - (h / 2.0))

                    conf = float(box.conf[0].item())
                    cls_id = int(box.cls[0].item())
                    class_name = result.names.get(cls_id, f"Object {cls_id}")

                    detections.append(
                        Detection(
                            category=class_name,
                            isEwaste=is_ewaste_category(class_name),
                            confidence=round(conf, 3),
                            boundingBox=BoundingBox(
                                x=round(x, 1),
                                y=round(y, 1),
                                width=round(w, 1),
                                height=round(h, 1),
                            ),
                        )
                    )

            return detections
        except Exception as err:
            logger.error(f"Error during YOLO prediction: {err}. Using fallback detector.")
            return self._fallback_detector.predict(image)
