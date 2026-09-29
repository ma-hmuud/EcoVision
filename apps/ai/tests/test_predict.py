import io
from fastapi.testclient import TestClient
from PIL import Image
import pytest

from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def create_test_image(width=400, height=300, color=(100, 150, 200)) -> bytes:
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "EcoVision AI"


def test_predict_success(client):
    image_bytes = create_test_image()
    files = {"image": ("test.jpg", image_bytes, "image/jpeg")}
    response = client.post("/predict", files=files)

    assert response.status_code == 200
    data = response.json()
    assert "detections" in data
    assert len(data["detections"]) > 0

    first = data["detections"][0]
    assert "category" in first
    assert "isEwaste" in first
    assert "confidence" in first
    assert 0.0 <= first["confidence"] <= 1.0

    if first["boundingBox"]:
        box = first["boundingBox"]
        assert box["x"] >= 0
        assert box["y"] >= 0
        assert box["width"] > 0
        assert box["height"] > 0


def test_predict_invalid_mimetype(client):
    files = {"image": ("doc.txt", b"plain text content", "text/plain")}
    response = client.post("/predict", files=files)
    assert response.status_code == 400
