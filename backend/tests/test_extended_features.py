import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_smart_recommendations():
    response = client.get("/api/v1/recommendations/smart?stream_id=1")
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0

def test_eco_tips():
    response = client.get("/api/v1/eco-tips")
    assert response.status_code == 200
    tips = response.json()
    assert len(tips) > 0

def test_quizzes_and_attempt():
    response = client.get("/api/v1/quizzes")
    assert response.status_code == 200
    quizzes = response.json()
    assert len(quizzes) > 0
    quiz_id = quizzes[0]["id"]
    
    attempt_resp = client.post(f"/api/v1/quizzes/{quiz_id}/attempt", json={
        "quiz_id": quiz_id,
        "selected_option_index": 1,
        "user_id": 1
    })
    assert attempt_resp.status_code == 200
    assert "is_correct" in attempt_resp.json()

def test_polls_and_voting():
    import time
    # Create test user for voting
    unique_email = f"voter_{int(time.time()*1000)}@aquaone.org"
    reg_resp = client.post("/api/v1/auth/register", json={
        "name": "Poll Voter",
        "email": unique_email,
        "role": "citizen"
    })
    assert reg_resp.status_code == 200
    voter_id = reg_resp.json()["id"]

    response = client.get("/api/v1/polls")
    assert response.status_code == 200
    polls = response.json()
    assert len(polls) > 0
    poll = polls[0]
    opt_id = poll["options"][0]["id"]
    
    vote_resp = client.post("/api/v1/polls/vote", json={
        "poll_id": poll["id"],
        "option_id": opt_id,
        "user_id": voter_id
    })
    assert vote_resp.status_code == 200
    assert vote_resp.json()["status"] == "VOTE_RECORDED"

def test_teams_and_progress():
    response = client.get("/api/v1/teams")
    assert response.status_code == 200
    teams = response.json()
    assert len(teams) > 0
    team_id = teams[0]["id"]
    
    prog_resp = client.get(f"/api/v1/teams/{team_id}/progress")
    assert prog_resp.status_code == 200
    assert "total_xp" in prog_resp.json()

def test_volunteers():
    response = client.get("/api/v1/volunteers/opportunities")
    assert response.status_code == 200
    opps = response.json()
    assert len(opps) > 0

def test_command_center_analytics():
    # Freshness
    fresh_resp = client.get("/api/v1/analytics/freshness")
    assert fresh_resp.status_code == 200
    assert "freshness_status" in fresh_resp.json()
    
    # Data Quality
    dq_resp = client.get("/api/v1/analytics/data-quality")
    assert dq_resp.status_code == 200
    assert "completeness_score" in dq_resp.json()
    
    # Correlation Matrix
    corr_resp = client.get("/api/v1/analytics/correlation-matrix")
    assert corr_resp.status_code == 200
    assert "matrix" in corr_resp.json()
    
    # Rainfall Correlation
    rain_resp = client.get("/api/v1/analytics/rainfall-correlation")
    assert rain_resp.status_code == 200
    assert "correlation_coefficient" in rain_resp.json()

    # Heatmaps
    heat_resp = client.get("/api/v1/analytics/heatmap")
    assert heat_resp.status_code == 200
    assert "heatmap_points" in heat_resp.json()

def test_one_health_and_admin():
    # GIS Risk Map
    gis_resp = client.get("/api/v1/one-health/gis-risk-map")
    assert gis_resp.status_code == 200
    assert "risk_layers" in gis_resp.json()
    
    # Hotspots
    hot_resp = client.get("/api/v1/one-health/hotspots")
    assert hot_resp.status_code == 200
    assert "hotspots" in hot_resp.json()
    
    # API Keys
    keys_resp = client.get("/api/v1/admin/api-keys")
    assert keys_resp.status_code == 200
    assert len(keys_resp.json()) > 0
    assert "masked_key" in keys_resp.json()[0]

    # Interoperability Score
    interop_resp = client.get("/api/v1/interop/score")
    assert interop_resp.status_code == 200
    assert interop_resp.json()["interoperability_score"] >= 90.0
