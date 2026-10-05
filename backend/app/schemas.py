from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[str] = "citizen"
    avatar: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    points: int
    level: str
    badge_count: int
    current_streak: Optional[int] = 1
    longest_streak: Optional[int] = 1
    is_verified: Optional[bool] = True
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Stream Schemas
class StreamBase(BaseModel):
    name: str
    code: str
    location_name: str
    latitude: float
    longitude: float
    description: Optional[str] = None

class StreamCreate(StreamBase):
    pass

class StreamResponse(StreamBase):
    id: int
    health_score: float
    status: str
    water_quality_index: float
    pollution_index: float
    biodiversity_index: float
    ecosystem_index: float
    flora_info: Optional[str] = None
    fauna_info: Optional[str] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Observation Schemas
class ObservationCreate(BaseModel):
    stream_id: int
    user_id: Optional[int] = 1
    water_clarity: str
    odor: Optional[str] = "None"
    waste_level: Optional[str] = "None"
    algae_level: Optional[str] = "None"
    flow_speed: Optional[str] = "Medium"
    wildlife_seen: Optional[str] = "Insects"
    water_temp_c: Optional[float] = 24.5
    ph_level: Optional[float] = 7.2
    dissolved_oxygen: Optional[float] = 6.5
    rainfall_mm: Optional[float] = 0.0
    latitude: float
    longitude: float
    difficulty_level: Optional[str] = "beginner"
    bank_stability: Optional[str] = "Stable"
    bank_erosion_level: Optional[str] = "None"
    erosion_detected: Optional[bool] = False
    accessibility_rating: Optional[float] = 4.5
    image_url: Optional[str] = None
    notes: Optional[str] = None

class ObservationResponse(BaseModel):
    id: int
    stream_id: int
    user_id: int
    water_clarity: str
    turbidity_ntu: Optional[float]
    odor: str
    waste_level: str
    algae_level: str
    flow_speed: str
    wildlife_seen: str
    water_temp_c: Optional[float]
    ph_level: Optional[float]
    dissolved_oxygen: Optional[float]
    rainfall_mm: float
    difficulty_level: Optional[str] = "beginner"
    bank_stability: Optional[str] = "Stable"
    bank_erosion_level: Optional[str] = "None"
    erosion_detected: Optional[bool] = False
    accessibility_rating: Optional[float] = 4.5
    quality_score: Optional[float] = 85.0
    is_duplicate: Optional[bool] = False
    duplicate_of_id: Optional[int] = None
    latitude: float
    longitude: float
    image_url: Optional[str]
    notes: Optional[str]
    status: str
    is_demo: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# AI Validation Schema
class AIValidationResponse(BaseModel):
    id: int
    observation_id: int
    is_valid: bool
    confidence_score: float
    prediction_label: str
    reasons_json: List[str]
    recommended_action: str
    flagged_for_human: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Human Review Schema
class HumanReviewCreate(BaseModel):
    observation_id: int
    reviewer_id: int
    action: str # accepted, rejected, edited
    notes: Optional[str] = None

# Risk Prediction Schema
class RiskPredictionResponse(BaseModel):
    id: int
    stream_id: int
    risk_level: str
    risk_probability: float
    explainable_factors_json: List[Dict[str, Any]]
    ecosystem_stress_forecast: Optional[float] = 35.0
    biodiversity_risk_forecast: Optional[float] = 25.0
    predicted_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Alert Schema
class AlertResponse(BaseModel):
    id: int
    stream_id: int
    severity: str
    title: str
    message: str
    assigned_to: Optional[str] = "Regional Response Team A"
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Story Schema
class StoryResponse(BaseModel):
    id: int
    stream_id: int
    title: str
    summary: str
    content_md: str
    key_changes: Optional[List[str]] = None
    one_health_impact: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Community Challenge & Leaderboard Schema
class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    target_count: int
    reward_points: int
    badge_unlocked: Optional[str]

    model_config = ConfigDict(from_attributes=True)

class LeaderboardUser(BaseModel):
    id: int
    name: str
    avatar: Optional[str]
    points: int
    level: str
    badge_count: int
    rank: int

# One Health Insight Schema
class OneHealthInsightResponse(BaseModel):
    id: int
    stream_id: int
    title: str
    ecosystem_link: str
    human_health_risk: str
    animal_health_risk: str
    recommended_intervention: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Quiz Schemas
class QuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    options: List[str]
    explanation: Optional[str] = None

class QuizResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    reward_points: int
    questions: List[QuizQuestionResponse]

class QuizSubmitRequest(BaseModel):
    quiz_id: int
    selected_option_index: int
    user_id: Optional[int] = 1

class QuizResultResponse(BaseModel):
    is_correct: bool
    score: int
    points_awarded: int
    explanation: str
    correct_option_index: int

# Poll Schemas
class PollOptionResponse(BaseModel):
    id: int
    option_text: str
    votes_count: int

class PollResponse(BaseModel):
    id: int
    title: str
    question: str
    is_active: bool
    total_votes: int
    options: List[PollOptionResponse]

class PollVoteRequest(BaseModel):
    poll_id: int
    option_id: int
    user_id: Optional[int] = 1

# Volunteer Opportunity Schemas
class VolunteerOpportunityResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    event_date: datetime
    organizer: str
    capacity: int
    registered_count: int
    status: str

# Team Schemas
class TeamResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    total_xp: int
    total_observations: int
    member_count: int
    created_at: datetime

class TeamCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    user_id: Optional[int] = 1

# Intervention Schemas
class InterventionResponse(BaseModel):
    id: int
    stream_id: int
    title: str
    description: str
    owner: str
    priority: str
    status: str
    progress: int
    start_date: datetime
    deadline: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class InterventionCreateRequest(BaseModel):
    stream_id: int
    title: str
    description: str
    owner: Optional[str] = "Municipal Environmental Agency"
    priority: Optional[str] = "High"
    deadline_days: Optional[int] = 30

# System Config & API Key Schemas
class SystemConfigResponse(BaseModel):
    key: str
    value: str
    category: str
    description: Optional[str] = None

class APIKeyResponse(BaseModel):
    id: int
    name: str
    masked_key: str
    role: str
    is_active: bool
    created_at: datetime

class APIKeyCreateRequest(BaseModel):
    name: str
    role: Optional[str] = "expert"

class NotificationResponse(BaseModel):
    id: int
    type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime
