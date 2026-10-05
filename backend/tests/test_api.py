from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "AquaOne" in response.json()["platform"]

def test_get_streams():
    response = client.get("/api/v1/streams")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5

def test_get_observations():
    response = client.get("/api/v1/observations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_create_observation_and_ai_pipeline():
    payload = {
        "stream_id": 1,
        "user_id": 1,
        "water_clarity": "Slightly cloudy",
        "odor": "None",
        "waste_level": "Low",
        "algae_level": "None",
        "flow_speed": "Medium",
        "wildlife_seen": "Fish",
        "water_temp_c": 24.5,
        "ph_level": 7.2,
        "dissolved_oxygen": 7.1,
        "rainfall_mm": 5.0,
        "latitude": 13.038,
        "longitude": 80.156,
        "notes": "Test automated integration observation."
    }
    response = client.post("/api/v1/observations", json=payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "SUCCESS"
    assert "ai_validation" in res_data
    assert "ml_risk_prediction" in res_data

def test_interop_fhir():
    response = client.get("/api/v1/interop/fhir/Observation?obs_id=1")
    assert response.status_code == 200
    fhir = response.json()
    assert fhir["resourceType"] == "Observation"
    assert "AquaOne" in fhir["id"]

def test_demo_mode_workflow():
    response = client.post("/api/v1/demo/run-workflow?stream_id=1")
    assert response.status_code == 200
    workflow = response.json()
    assert "steps_summary" in workflow
    assert len(workflow["steps_summary"]) >= 10
