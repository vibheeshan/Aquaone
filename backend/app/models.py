import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="citizen") # citizen, expert, health_officer, admin
    avatar = Column(String, nullable=True)
    points = Column(Integer, default=0)
    level = Column(String, default="Explorer") # Explorer, Stream Observer, Citizen Scientist, Stream Guardian, One Health Champion
    badge_count = Column(Integer, default=0)
    current_streak = Column(Integer, default=1)
    longest_streak = Column(Integer, default=1)
    last_activity_date = Column(DateTime, default=datetime.datetime.utcnow)
    is_verified = Column(Boolean, default=True)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    observations = relationship("Observation", back_populates="user")
    reviews = relationship("HumanReview", back_populates="reviewer")
    user_points = relationship("UserPoint", back_populates="user")
    badges = relationship("Badge", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")
    team_memberships = relationship("TeamMember", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")
    poll_votes = relationship("PollVote", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    member_count = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_xp = Column(Integer, default=0)
    total_observations = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, default="member") # leader, member
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")


class Stream(Base):
    __tablename__ = "streams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True)
    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    health_score = Column(Float, default=75.0)
    status = Column(String, default="Moderate") # Good, Moderate, Poor, Critical
    water_quality_index = Column(Float, default=75.0)
    pollution_index = Column(Float, default=20.0)
    biodiversity_index = Column(Float, default=80.0)
    ecosystem_index = Column(Float, default=70.0)
    description = Column(Text, nullable=True)
    flora_info = Column(Text, nullable=True)
    fauna_info = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    observations = relationship("Observation", back_populates="stream")
    health_scores = relationship("HealthScore", back_populates="stream")
    risk_predictions = relationship("RiskPrediction", back_populates="stream")
    alerts = relationship("Alert", back_populates="stream")
    stories = relationship("Story", back_populates="stream")
    one_health_insights = relationship("OneHealthInsight", back_populates="stream")
    interventions = relationship("Intervention", back_populates="stream")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Citizen inputs (Track 1)
    water_clarity = Column(String, nullable=False) # Very clear, Slightly cloudy, Cloudy, Very muddy
    turbidity_ntu = Column(Float, nullable=True)
    odor = Column(String, default="None") # None, Mild, Strong, Chemical
    waste_level = Column(String, default="None") # None, Low, Medium, High
    algae_level = Column(String, default="None") # None, Low, Medium, High
    flow_speed = Column(String, default="Medium") # Slow, Medium, Fast
    wildlife_seen = Column(String, default="Insects") # Fish, Insects, Birds, None
    water_temp_c = Column(Float, nullable=True)
    ph_level = Column(Float, nullable=True)
    dissolved_oxygen = Column(Float, nullable=True)
    rainfall_mm = Column(Float, default=0.0)
    
    # Structured Extended Physical Fields
    difficulty_level = Column(String, default="beginner") # beginner, intermediate, advanced
    bank_stability = Column(String, default="Stable") # Stable, Moderate Erosion, Collapsing
    bank_erosion_level = Column(String, default="None") # None, Moderate, Severe
    erosion_detected = Column(Boolean, default=False)
    accessibility_rating = Column(Float, default=4.5) # 1.0 to 5.0
    quality_score = Column(Float, default=85.0) # 0 to 100
    is_duplicate = Column(Boolean, default=False)
    duplicate_of_id = Column(Integer, nullable=True)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    is_draft = Column(Boolean, default=False)
    
    # Status (Track 3 workflow)
    status = Column(String, default="verified") # pending_review, verified, rejected
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("Stream", back_populates="observations")
    user = relationship("User", back_populates="observations")
    images = relationship("ObservationImage", back_populates="observation")
    ai_validation = relationship("AIValidation", back_populates="observation", uselist=False)
    human_review = relationship("HumanReview", back_populates="observation", uselist=False)


class ObservationImage(Base):
    __tablename__ = "observation_images"

    id = Column(Integer, primary_key=True, index=True)
    observation_id = Column(Integer, ForeignKey("observations.id"), nullable=False)
    image_url = Column(String, nullable=False)
    detected_labels = Column(JSON, nullable=True)
    ai_confidence = Column(Float, default=0.85)
    quality_score = Column(Float, default=0.92) # Image clarity check
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    observation = relationship("Observation", back_populates="images")


class AIValidation(Base):
    __tablename__ = "ai_validations"

    id = Column(Integer, primary_key=True, index=True)
    observation_id = Column(Integer, ForeignKey("observations.id"), nullable=False)
    is_valid = Column(Boolean, default=True)
    confidence_score = Column(Float, default=0.85) # 0.0 to 1.0
    prediction_label = Column(String, default="valid_observation") # valid_observation, possible_pollution, anomaly, suspicious
    reasons_json = Column(JSON, nullable=False) # List of explanations
    recommended_action = Column(String, default="auto_accept") # auto_accept, human_review, flag_reject
    flagged_for_human = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    observation = relationship("Observation", back_populates="ai_validation")


class HumanReview(Base):
    __tablename__ = "human_reviews"

    id = Column(Integer, primary_key=True, index=True)
    observation_id = Column(Integer, ForeignKey("observations.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False) # accepted, rejected, edited
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    observation = relationship("Observation", back_populates="human_review")
    reviewer = relationship("User", back_populates="reviews")


class HealthScore(Base):
    __tablename__ = "health_scores"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    score = Column(Float, nullable=False) # 0 to 100
    water_quality_sub = Column(Float, default=80.0)
    pollution_sub = Column(Float, default=80.0) # higher is better cleanliness
    biodiversity_sub = Column(Float, default=80.0)
    ecosystem_sub = Column(Float, default=80.0)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("Stream", back_populates="health_scores")


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    risk_level = Column(String, nullable=False) # LOW, MEDIUM, HIGH
    risk_probability = Column(Float, nullable=False) # 0.0 to 1.0
    explainable_factors_json = Column(JSON, nullable=False)
    ecosystem_stress_forecast = Column(Float, default=35.0)
    biodiversity_risk_forecast = Column(Float, default=25.0)
    predicted_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("Stream", back_populates="risk_predictions")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    severity = Column(String, nullable=False) # INFO, WARNING, CRITICAL
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    assigned_to = Column(String, default="Regional Response Team A")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("Stream", back_populates="alerts")


class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    content_md = Column(Text, nullable=False)
    key_changes = Column(JSON, nullable=True)
    one_health_impact = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("Stream", back_populates="stories")


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    target_count = Column(Integer, default=5)
    reward_points = Column(Integer, default=50)
    badge_unlocked = Column(String, nullable=True)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, default=datetime.datetime.utcnow)


class UserPoint(Base):
    __tablename__ = "user_points"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points_earned = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="user_points")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_key = Column(String, nullable=False)
    badge_name = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    awarded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="badges")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=False)
    unlocked_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="achievements")


class OneHealthInsight(Base):
    __tablename__ = "one_health_insights"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    title = Column(String, nullable=False)
    ecosystem_link = Column(Text, nullable=False)
    human_health_risk = Column(Text, nullable=False)
    animal_health_risk = Column(Text, nullable=False)
    recommended_intervention = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    stream = relationship("Stream", back_populates="one_health_insights")


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    owner = Column(String, default="Municipal Environmental Agency")
    priority = Column(String, default="High") # High, Medium, Low
    status = Column(String, default="In Progress") # Not Started, In Progress, Completed, Cancelled
    progress = Column(Integer, default=45) # 0 to 100
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    deadline = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    stream = relationship("Stream", back_populates="interventions")


class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    question = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    options = relationship("PollOption", back_populates="poll", cascade="all, delete-orphan")
    votes = relationship("PollVote", back_populates="poll", cascade="all, delete-orphan")


class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    option_text = Column(String, nullable=False)
    votes_count = Column(Integer, default=0)

    poll = relationship("Poll", back_populates="options")
    votes = relationship("PollVote", back_populates="option")


class PollVote(Base):
    __tablename__ = "poll_votes"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("poll_options.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    voted_at = Column(DateTime, default=datetime.datetime.utcnow)

    poll = relationship("Poll", back_populates="votes")
    option = relationship("PollOption", back_populates="votes")
    user = relationship("User", back_populates="poll_votes")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, default="Water Quality")
    reward_points = Column(Integer, default=25)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(String, nullable=False)
    options_json = Column(JSON, nullable=False) # list of string choices
    correct_option_index = Column(Integer, nullable=False) # 0 to 3
    explanation = Column(Text, nullable=True)

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, default=1)
    max_score = Column(Integer, default=1)
    passed = Column(Boolean, default=True)
    points_awarded = Column(Integer, default=25)
    attempted_at = Column(DateTime, default=datetime.datetime.utcnow)

    quiz = relationship("Quiz", back_populates="attempts")
    user = relationship("User", back_populates="quiz_attempts")


class VolunteerOpportunity(Base):
    __tablename__ = "volunteer_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    event_date = Column(DateTime, default=datetime.datetime.utcnow)
    organizer = Column(String, default="AquaOne Community Outreach")
    capacity = Column(Integer, default=30)
    registered_count = Column(Integer, default=8)
    status = Column(String, default="Open") # Open, Full, Completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    registrations = relationship("VolunteerRegistration", back_populates="opportunity", cascade="all, delete-orphan")


class VolunteerRegistration(Base):
    __tablename__ = "volunteer_registrations"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("volunteer_opportunities.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Confirmed") # Confirmed, Cancelled

    opportunity = relationship("VolunteerOpportunity", back_populates="registrations")


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    likes_count = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    comments = relationship("CommunityComment", back_populates="post", cascade="all, delete-orphan")


class CommunityComment(Base):
    __tablename__ = "community_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    post = relationship("CommunityPost", back_populates="comments")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, default="achievement") # achievement, alert, system, review
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class SystemConfiguration(Base):
    __tablename__ = "system_configurations"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(String, nullable=False)
    category = Column(String, default="thresholds") # thresholds, alerts, gamification, fhir
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_by = Column(String, default="admin")


class APIKeyRecord(Base):
    __tablename__ = "api_key_records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    masked_key = Column(String, nullable=False)
    key_hash = Column(String, nullable=True)  # hashed/raw representation for rotation
    role = Column(String, default="expert")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)


class EcoTip(Base):
    __tablename__ = "eco_tips"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, default="General")
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    condition_trigger = Column(String, default="all") # low_health, after_rain, high_turbidity, all


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(Integer, nullable=True)
    details_json = Column(JSON, nullable=True)  # rich audit context (old/new role, etc.)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)  # kept for legacy compatibility
