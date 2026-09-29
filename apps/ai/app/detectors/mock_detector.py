import hashlib
import random
from typing import List
from PIL import Image

from app.detectors.base import WasteDetector
from app.schemas.detection import (
    BoundingBox,
    Detection,
    is_ewaste_category,
)

PRESET_SCENARIOS = [
    [
        {"category": "Laptop", "confidence": 0.964, "rel_box": (0.15, 0.2, 0.65, 0.55)},
        {"category": "Cable", "confidence": 0.912, "rel_box": (0.6, 0.65, 0.32, 0.25)},
    ],
    [
        {"category": "Mobile phone", "confidence": 0.978, "rel_box": (0.28, 0.25, 0.44, 0.52)},
        {"category": "Charger", "confidence": 0.935, "rel_box": (0.68, 0.55, 0.25, 0.32)},
    ],
    [
        {"category": "Plastic", "confidence": 0.924, "rel_box": (0.2, 0.25, 0.45, 0.5)},
        {"category": "Cardboard", "confidence": 0.891, "rel_box": (0.55, 0.35, 0.38, 0.45)},
    ],
    [
        {"category": "Monitor", "confidence": 0.982, "rel_box": (0.1, 0.15, 0.75, 0.6)},
        {"category": "Keyboard", "confidence": 0.941, "rel_box": (0.18, 0.68, 0.64, 0.24)},
    ],
    [
        {"category": "Battery", "confidence": 0.957, "rel_box": (0.35, 0.3, 0.3, 0.4)},
        {"category": "Metal", "confidence": 0.884, "rel_box": (0.1, 0.45, 0.25, 0.35)},
    ],
    [
        {"category": "Computer components", "confidence": 0.969, "rel_box": (0.22, 0.18, 0.56, 0.58)},
        {"category": "Mouse", "confidence": 0.928, "rel_box": (0.7, 0.58, 0.22, 0.28)},
    ],
    [
        {"category": "Glass", "confidence": 0.915, "rel_box": (0.3, 0.22, 0.4, 0.6)},
    ],
    [
        {"category": "Tablet", "confidence": 0.972, "rel_box": (0.2, 0.18, 0.6, 0.62)},
    ],
]


class MockWasteDetector(WasteDetector):
    """Mock Waste Detector that simulates realistic object detection and classification

    without requiring a heavy neural network. Useful for local development and CI testing.
    """

    def predict(self, image: Image.Image) -> List[Detection]:
        img_width, img_height = image.size

        # Generate a pseudo-random seed based on image size and sample pixels
        # so the same image yields consistent results, but different images vary
        sample_bytes = image.resize((16, 16)).convert("RGB").tobytes()
        seed_hash = hashlib.sha256(sample_bytes + f"{img_width}x{img_height}".encode()).hexdigest()
        seed_int = int(seed_hash[:8], 16)
        rng = random.Random(seed_int)

        # Pick one scenario deterministically based on seed
        scenario_idx = seed_int % len(PRESET_SCENARIOS)
        scenario = PRESET_SCENARIOS[scenario_idx]

        detections: List[Detection] = []
        for item in scenario:
            rx, ry, rw, rh = item["rel_box"]
            # Apply slight jitter based on seed
            rx = max(0.02, min(0.9, rx + rng.uniform(-0.02, 0.02)))
            ry = max(0.02, min(0.9, ry + rng.uniform(-0.02, 0.02)))
            rw = max(0.05, min(1.0 - rx, rw + rng.uniform(-0.02, 0.02)))
            rh = max(0.05, min(1.0 - ry, rh + rng.uniform(-0.02, 0.02)))

            pixel_x = round(rx * img_width, 1)
            pixel_y = round(ry * img_height, 1)
            pixel_w = round(rw * img_width, 1)
            pixel_h = round(rh * img_height, 1)

            category = item["category"]
            is_ewaste = is_ewaste_category(category)
            conf = min(0.99, max(0.70, round(item["confidence"] + rng.uniform(-0.03, 0.02), 3)))

            bbox = BoundingBox(
                x=pixel_x,
                y=pixel_y,
                width=pixel_w,
                height=pixel_h,
            )

            detections.append(
                Detection(
                    category=category,
                    isEwaste=is_ewaste,
                    confidence=conf,
                    boundingBox=bbox,
                )
            )

        return detections
