from fastapi.testclient import TestClient
from app.main import app
from app.core.database import init_db
import pytest

init_db()
client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Unified SD-WAN Platform API"}

def test_get_edges():
    response = client.get("/api/edges/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_policies():
    response = client.get("/api/policies/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
