from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_predict_endpoint_unauthorized():
    response = client.get("/analytics/predict?station_id=BH72")
    # Should fail without token
    assert response.status_code == 401

# Note: comprehensive testing would require mocking authentication and DB
# or using a dedicated test DB setup.
