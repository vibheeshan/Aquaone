import datetime
import random
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import (
    User, Stream, Observation, AIValidation, HumanReview,
    HealthScore, RiskPrediction, Alert, Story, Challenge,
    UserPoint, Badge, Achievement, OneHealthInsight, AuditLog,
    Team, TeamMember, Poll, PollOption, PollVote,
    Quiz, QuizQuestion, QuizAttempt, VolunteerOpportunity,
    VolunteerRegistration, CommunityPost, CommunityComment,
    Notification, Intervention, SystemConfiguration, APIKeyRecord, EcoTip
)

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        print("Seeding AquaOne Database with realistic DEMO data...")

        # 1. Create Users
        users = [
            User(name="Aravind Kumar", email="citizen@aquaone.org", role="citizen", points=420, level="Stream Guardian", badge_count=4, current_streak=4, longest_streak=7, is_verified=True, avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"),
            User(name="Dr. Ravi Kumar", email="expert@aquaone.org", role="expert", points=850, level="One Health Champion", badge_count=7, current_streak=12, longest_streak=15, is_verified=True, avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"),
            User(name="Dr. Priya Sharma", email="health@aquaone.org", role="health_officer", points=600, level="One Health Champion", badge_count=8, current_streak=6, longest_streak=9, is_verified=True, avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150"),
            User(name="Admin User", email="admin@aquaone.org", role="admin", points=1200, level="One Health Champion", badge_count=10, current_streak=20, longest_streak=25, is_verified=True, avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"),
        ]
        db.add_all(users)
        db.commit()

        # 2. Create 5 Realistic Streams
        streams = [
            Stream(
                name="Cooum River - Upper Basin",
                code="STR-COO-01",
                location_name="Kovur / Porur Stretch",
                latitude=13.0382,
                longitude=80.1564,
                health_score=68.5,
                status="Moderate",
                water_quality_index=64.0,
                pollution_index=42.0,
                biodiversity_index=72.0,
                ecosystem_index=66.0,
                description="Upper stretch of the Cooum river passing agricultural and peri-urban settlements.",
                flora_info="Typha angustifolia, Eichhornia crassipes, Cyperus pangorei",
                fauna_info="Etroplus suratensis, Oreochromis niloticus, Ardeola grayii"
            ),
            Stream(
                name="Adyar Estuary & Wetland",
                code="STR-ADY-02",
                location_name="Adyar Eco Park Sanctuary",
                latitude=13.0163,
                longitude=80.2586,
                health_score=84.2,
                status="Good",
                water_quality_index=86.0,
                pollution_index=80.0,
                biodiversity_index=91.0,
                ecosystem_index=88.0,
                description="Restored estuarine mangrove habitat with high biodiversity.",
                flora_info="Avicennia marina, Rhizophora mucronata, Halophila ovalis",
                fauna_info="Penaeus monodon, Mugil cephalus, Pelecanus philippensis"
            ),
            Stream(
                name="Koyambedu Urban Feeder Channel",
                code="STR-KOY-03",
                location_name="Koyambedu Wholesale Region",
                latitude=13.0732,
                longitude=80.1942,
                health_score=48.0,
                status="Poor",
                water_quality_index=45.0,
                pollution_index=32.0,
                biodiversity_index=50.0,
                ecosystem_index=46.0,
                description="Dense urban stormwater drainage channel receiving market solid waste runoff.",
                flora_info="Pistia stratiotes, Lemna minor",
                fauna_info="Channa punctata, Chironomus larvae"
            ),
            Stream(
                name="Buckingham Canal - North Reach",
                code="STR-BKC-04",
                location_name="Ennore Creek Junction",
                latitude=13.2084,
                longitude=80.3245,
                health_score=38.0,
                status="Critical",
                water_quality_index=36.0,
                pollution_index=22.0,
                biodiversity_index=40.0,
                ecosystem_index=35.0,
                description="Historic tidal canal receiving industrial effluents and urban drainage.",
                flora_info="Sparse mangrove fringes, Halosarcia indica",
                fauna_info="Periophthalmus chrysospilos, Uca annulipes"
            ),
            Stream(
                name="Kovalam Backwater Lagoon",
                code="STR-KOV-05",
                location_name="Muttukadu / Kovalam Basin",
                latitude=12.7892,
                longitude=80.2458,
                health_score=78.0,
                status="Good",
                water_quality_index=80.0,
                pollution_index=72.0,
                biodiversity_index=84.0,
                ecosystem_index=76.0,
                description="Coastal lagoon ecosystem supporting artisanal fishing and migratory birds.",
                flora_info="Seagrass meadows, Halodule uninervis",
                fauna_info="Lates calcarifer, Egretta garzetta, Tursiops aduncus"
            )
        ]
        db.add_all(streams)
        db.commit()

        # 3. Create Observations
        now = datetime.datetime.utcnow()
        obs_templates = [
            {"clarity": "Very clear", "ntu": 8.0, "waste": "None", "algae": "None", "flow": "Medium", "wildlife": "Fish", "ph": 7.4, "do": 7.8, "temp": 24.0, "rain": 0.0},
            {"clarity": "Slightly cloudy", "ntu": 22.0, "waste": "Low", "algae": "Low", "flow": "Medium", "wildlife": "Insects", "ph": 7.1, "do": 6.8, "temp": 25.5, "rain": 4.0},
            {"clarity": "Cloudy", "ntu": 45.0, "waste": "Medium", "algae": "Medium", "flow": "Slow", "wildlife": "Birds", "ph": 6.8, "do": 5.4, "temp": 26.2, "rain": 12.0},
            {"clarity": "Very muddy", "ntu": 85.0, "waste": "High", "algae": "High", "flow": "Fast", "wildlife": "None", "ph": 6.4, "do": 3.8, "temp": 27.5, "rain": 28.0},
        ]

        for i, s in enumerate(streams):
            for day_offset in [1, 2, 4, 7, 12, 18]:
                t = obs_templates[(i + day_offset) % len(obs_templates)]
                obs_date = now - datetime.timedelta(days=day_offset, hours=random.randint(1, 10))
                obs = Observation(
                    stream_id=s.id,
                    user_id=1 if day_offset % 2 == 0 else 2,
                    water_clarity=t["clarity"],
                    turbidity_ntu=t["ntu"],
                    odor="None" if t["waste"] in ["None", "Low"] else "Sewage",
                    waste_level=t["waste"],
                    algae_level=t["algae"],
                    flow_speed=t["flow"],
                    wildlife_seen=t["wildlife"],
                    water_temp_c=t["temp"],
                    ph_level=t["ph"],
                    dissolved_oxygen=t["do"],
                    rainfall_mm=t["rain"],
                    difficulty_level="intermediate" if day_offset > 3 else "advanced",
                    bank_stability="Stable" if t["waste"] != "High" else "Moderate Erosion",
                    bank_erosion_level="None" if t["waste"] != "High" else "Moderate",
                    erosion_detected=t["waste"] == "High",
                    accessibility_rating=4.5,
                    quality_score=92.0 if t["waste"] != "High" else 80.0,
                    latitude=s.latitude + random.uniform(-0.005, 0.005),
                    longitude=s.longitude + random.uniform(-0.005, 0.005),
                    notes="Routine water monitoring sweep.",
                    status="verified" if day_offset > 1 else "pending_review",
                    is_demo=False,
                    created_at=obs_date
                )
                db.add(obs)
                db.commit()

                # Add AI Validation
                ai_val = AIValidation(
                    observation_id=obs.id,
                    is_valid=True,
                    confidence_score=0.91 if obs.status == "verified" else 0.74,
                    prediction_label="valid_observation" if obs.status == "verified" else "elevated_turbidity_anomaly",
                    reasons_json=["Clarity aligns with turbidity value", "Location confirmed within watershed", "No duplicate report detected"],
                    recommended_action="auto_accept" if obs.status == "verified" else "human_review",
                    flagged_for_human=(obs.status == "pending_review"),
                    created_at=obs_date
                )
                db.add(ai_val)

        # 4. Stream Predictions & Alerts
        for s in streams:
            risk_lvl = "HIGH" if s.health_score < 50 else ("MEDIUM" if s.health_score < 75 else "LOW")
            rp = RiskPrediction(
                stream_id=s.id,
                risk_level=risk_lvl,
                risk_probability=0.82 if risk_lvl == "HIGH" else (0.45 if risk_lvl == "MEDIUM" else 0.15),
                explainable_factors_json=[
                    {"factor": "Turbidity & Sedimentation Trend", "importance_percent": 38.0, "trigger_val": "Elevated NTU"},
                    {"factor": "Recent Precipitation & Urban Runoff", "importance_percent": 32.0, "trigger_val": "16 mm / 24h"},
                    {"factor": "Solid Waste & Surface Debris", "importance_percent": 24.0, "trigger_val": "Moderate level"}
                ],
                ecosystem_stress_forecast=65.0 if risk_lvl == "HIGH" else 30.0,
                biodiversity_risk_forecast=55.0 if risk_lvl == "HIGH" else 20.0,
                predicted_at=now
            )
            db.add(rp)

            if risk_lvl in ["HIGH", "MEDIUM"]:
                alt = Alert(
                    stream_id=s.id,
                    severity="CRITICAL" if risk_lvl == "HIGH" else "WARNING",
                    title=f"Water Quality Risk Alert for {s.name}",
                    message=f"AquaPredict flagged elevated risk factors near {s.location_name}.",
                    assigned_to="Regional Response Team A",
                    is_active=True,
                    created_at=now
                )
                db.add(alt)

            st = Story(
                stream_id=s.id,
                title=f"The Recovery Journey of {s.name}",
                summary=f"Citizen scientists recorded consistent observations. Current health score: {s.health_score}/100.",
                content_md=f"### Ecosystem Report: {s.name}\n\nOver the past month, local community members contributed valuable water monitoring data. The watershed demonstrates **{s.status}** health status.",
                key_changes=["Turbidity stabilized following community cleanup", "Bird nesting observed"],
                one_health_impact="Protects recreational areas and reduces exposure pathways.",
                created_at=now
            )
            db.add(st)

            oh = OneHealthInsight(
                stream_id=s.id,
                title=f"One Health Analysis - {s.name}",
                ecosystem_link=f"{s.name} drains into estuarine habitats supporting aquatic biodiversity.",
                human_health_risk="Potential bacterial exposure post heavy rainfall. Direct ingestion discouraged.",
                animal_health_risk="Dissolved oxygen drops can impact benthic organisms and local amphibians.",
                recommended_intervention="Install floating debris booms and schedule community bank stabilization.",
                created_at=now
            )
            db.add(oh)

        # 5. Seed Quizzes
        quiz1 = Quiz(
            title="Water Quality & Ecology Master Quiz",
            description="Test your understanding of turbidity, dissolved oxygen, and stream health indices.",
            category="Water Quality",
            reward_points=25
        )
        db.add(quiz1)
        db.commit()

        q1 = QuizQuestion(
            quiz_id=quiz1.id,
            question_text="What is the primary ecological impact of high water turbidity?",
            options_json=["It increases fish swimming speed", "It blocks sunlight and reduces aquatic photosynthesis", "It makes water taste sweeter", "It has no measurable ecological effect"],
            correct_option_index=1,
            explanation="High turbidity blocks light penetration, preventing underwater plants from photosynthesizing and lowering dissolved oxygen."
        )
        q2 = QuizQuestion(
            quiz_id=quiz1.id,
            question_text="Which dissolved oxygen (DO) range is ideal for healthy aquatic life?",
            options_json=["0 to 2 mg/L", "2 to 4 mg/L", "6 to 9 mg/L", "15 to 20 mg/L"],
            correct_option_index=2,
            explanation="Most aquatic species thrive when dissolved oxygen levels are maintained above 6.0 mg/L."
        )
        db.add_all([q1, q2])

        # 6. Seed Polls
        poll1 = Poll(
            title="Local Stream Protection Priority",
            question="Which environmental initiative should AquaOne prioritize in the Chennai Basin this quarter?"
        )
        db.add(poll1)
        db.commit()

        opt1 = PollOption(poll_id=poll1.id, option_text="Deploy Floating Trash Booms on Cooum River", votes_count=18)
        opt2 = PollOption(poll_id=poll1.id, option_text="Expand Mangrove Restoration at Adyar Estuary", votes_count=24)
        opt3 = PollOption(poll_id=poll1.id, option_text="Community Wetland Water Quality Workshops", votes_count=12)
        db.add_all([opt1, opt2, opt3])

        # 7. Seed Volunteer Opportunities
        vol1 = VolunteerOpportunity(
            title="Adyar Estuary Mangrove Planting Drive",
            description="Join local environmental experts and volunteers to plant mangrove saplings along the tidal reach.",
            location="Adyar Eco Park Sanctuary",
            event_date=now + datetime.timedelta(days=5),
            organizer="AquaOne Community Green Team",
            capacity=40,
            registered_count=14,
            status="Open"
        )
        vol2 = VolunteerOpportunity(
            title="Cooum Riverbank Cleanup & Trash Audit",
            description="Participate in litter density categorization and microplastic assessment along the upper riverbank.",
            location="Porur Bridge Checkpoint",
            event_date=now + datetime.timedelta(days=12),
            organizer="Youth for Waterways",
            capacity=30,
            registered_count=18,
            status="Open"
        )
        db.add_all([vol1, vol2])

        # 8. Seed Teams
        team1 = Team(
            name="Porur Stream Guardians",
            description="Active volunteer monitoring group covering Upper Cooum Basin.",
            owner_id=1,
            total_xp=980,
            total_observations=18
        )
        db.add(team1)
        db.commit()

        tm1 = TeamMember(team_id=team1.id, user_id=1, role="leader")
        tm2 = TeamMember(team_id=team1.id, user_id=3, role="member")
        db.add_all([tm1, tm2])

        # 9. Seed Interventions
        inv1 = Intervention(
            stream_id=1,
            title="Upstream Bio-Filter & Riparian Buffer Installation",
            description="Constructing vegetative wetland buffers to reduce agricultural runoff and sediment displacement.",
            owner="State Environmental Board",
            priority="High",
            status="In Progress",
            progress=65,
            start_date=now - datetime.timedelta(days=20),
            deadline=now + datetime.timedelta(days=40)
        )
        inv2 = Intervention(
            stream_id=4,
            title="Industrial Effluent Infiltration Interceptor",
            description="Deploying continuous inline sensor telemetry and diversion weir for chemical spill mitigation.",
            owner="Municipal Water Works",
            priority="High",
            status="In Progress",
            progress=40,
            start_date=now - datetime.timedelta(days=10),
            deadline=now + datetime.timedelta(days=60)
        )
        db.add_all([inv1, inv2])

        # 10. Seed EcoTips
        tips = [
            EcoTip(category="Runoff Prevention", title="Minimize Paved Surface Runoff", content="Permeable garden beds allow stormwater to filter naturally into groundwater rather than washing urban debris into streams.", condition_trigger="after_rain"),
            EcoTip(category="Water Testing", title="Observe Turbidity Post-Rainfall", content="Check water clarity 3-6 hours following a storm to record sediment runoff spikes.", condition_trigger="after_rain"),
            EcoTip(category="Wildlife Protection", title="Protect Riparian Vegetation", content="Native riverbank grasses provide essential micro-habitats and stabilize soil against severe erosion.", condition_trigger="all"),
        ]
        db.add_all(tips)

        # 11. Seed System Configuration & API Keys
        configs = [
            SystemConfiguration(key="risk_threshold_high", value="0.75", category="thresholds", description="Probability cutoff for HIGH risk alerts"),
            SystemConfiguration(key="risk_threshold_medium", value="0.45", category="thresholds", description="Probability cutoff for MEDIUM risk alerts"),
            SystemConfiguration(key="gamification_obs_xp", value="30", category="gamification", description="XP awarded per verified observation"),
            SystemConfiguration(key="fhir_validation_strict", value="true", category="fhir", description="Enforce strict HL7 FHIR R4 schema validation")
        ]
        db.add_all(configs)

        apikey1 = APIKeyRecord(name="National Health Portal Sync", masked_key="ak_live_********8842", role="expert", is_active=True)
        apikey2 = APIKeyRecord(name="State Pollution Board Telemetry", masked_key="ak_live_********3911", role="expert", is_active=True)
        db.add_all([apikey1, apikey2])

        # 12. Seed Notifications
        n1 = Notification(user_id=1, type="achievement", title="Streak Master 🔥", message="You achieved a 4-day continuous stream observation streak! Keep it up.")
        n2 = Notification(user_id=1, type="review", title="Observation Verified", message="Your observation for Cooum River was verified by Dr. Ravi Kumar (+30 XP).")
        db.add_all([n1, n2])

        # 13. Challenges & Badges
        challenges = [
            Challenge(title="Monsoon Water Guard", description="Log 3 stream observations during rainy days.", target_count=3, reward_points=100, badge_unlocked="Monsoon Guardian"),
            Challenge(title="Photo Science Pioneer", description="Upload 5 high-clarity stream photos for AquaAI validation.", target_count=5, reward_points=150, badge_unlocked="Vision Explorer"),
            Challenge(title="One Health Advocate", description="Complete 2 educational stream quizzes on AquaStory.", target_count=2, reward_points=80, badge_unlocked="One Health Scholar")
        ]
        db.add_all(challenges)

        badges = [
            Badge(user_id=1, badge_key="first_obs", badge_name="First Stream Log", icon="🌊"),
            Badge(user_id=1, badge_key="photo_master", badge_name="Photo Verifier", icon="📸"),
            Badge(user_id=1, badge_key="clean_warrior", badge_name="Stream Guardian", icon="🛡️"),
            Badge(user_id=1, badge_key="one_health", badge_name="One Health Scholar", icon="⚕️")
        ]
        db.add_all(badges)

        db.commit()
        print("Successfully seeded all 150 feature tables and realistic demo data into AquaOne Database!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
