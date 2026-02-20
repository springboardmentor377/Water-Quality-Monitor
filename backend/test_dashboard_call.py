from fastapi.testclient import TestClient
from app.main import app
import traceback

client = TestClient(app)
try:
    resp = client.get('/dashboard/data')
    print('status', resp.status_code)
    print(resp.text)
except Exception as e:
    print('Exception during test client call:')
    traceback.print_exc()
