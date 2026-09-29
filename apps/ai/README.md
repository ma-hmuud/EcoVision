# EcoVision AI Service

The EcoVision AI service is a lightweight, high-performance FastAPI microservice responsible for waste detection, classification, and electronic waste (E-waste) determination.

## Features

- **Waste Detection**: Detects waste items from image inputs.
- **E-waste Classification**: Evaluates each detected item to determine if it is electronic waste.
- **Bounding Boxes**: Provides bounding box coordinates (`x`, `y`, `width`, `height`) for detected items.
- **Pluggable Architecture**: Implements a `WasteDetector` abstraction, allowing seamless transition from `MockWasteDetector` to `YOLOWasteDetector` without changing any API contracts.

## API Endpoints

### 1. Health Check
- **`GET /health`** or **`GET /`**
- Response:
  ```json
  {
    "status": "ok",
    "service": "EcoVision AI",
    "detector": "MockWasteDetector"
  }
  ```

### 2. Predict Waste
- **`POST /predict`**
- Content-Type: `multipart/form-data`
- Body: `image=<file>` (JPEG, PNG, WEBP, up to 10MB)
- Response:
  ```json
  {
    "detections": [
      {
        "category": "Laptop",
        "isEwaste": true,
        "confidence": 0.964,
        "boundingBox": {
          "x": 120.0,
          "y": 80.0,
          "width": 450.0,
          "height": 300.0
        }
      }
    ]
  }
  ```

## Local Development

```bash
# Create and activate virtualenv
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run service
uvicorn app.main:app --reload --port 8000
```

## Running with YOLO

To use a trained YOLO model:
1. Place your model weights file at `models/waste_detector.pt` (or specify `MODEL_PATH=/path/to/weights.pt`).
2. Install ultralytics:
   ```bash
   pip install ultralytics
   ```
3. Set `USE_YOLO=true` in your environment.
4. Restart the service. The service will automatically load your weights.
