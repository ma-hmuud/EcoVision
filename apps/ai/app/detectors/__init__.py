from .base import WasteDetector
from .mock_detector import MockWasteDetector
from .yolo_detector import YOLOWasteDetector

__all__ = ["WasteDetector", "MockWasteDetector", "YOLOWasteDetector"]
