from typing import Dict, Any
from app.ai.agents import (
    AssessmentAgent,
    ValidationAgent,
    VisionAgent,
    InsightAgent,
    RiskAgent,
    StoryAgent,
    OneHealthAgent
)

class AquaAIOrchestrator:
    """Central AquaAI Orchestrator that coordinates the 7 specialized AI agents."""
    def __init__(self):
        self.assessment_agent = AssessmentAgent()
        self.validation_agent = ValidationAgent()
        self.vision_agent = VisionAgent()
        self.insight_agent = InsightAgent()
        self.risk_agent = RiskAgent()
        self.story_agent = StoryAgent()
        self.one_health_agent = OneHealthAgent()

    def process_observation_pipeline(self, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """Runs the complete multi-agent pipeline for a single observation."""
        # 1. Assessment agent mapping
        assess_res = self.assessment_agent.run(raw_input)
        
        # Enrich raw input with mapped turbidity
        raw_input["turbidity_ntu"] = assess_res["mapped_turbidity_ntu"]
        
        # 2. Validation agent check
        val_res = self.validation_agent.run(raw_input)
        
        # 3. Vision agent scan
        image_url = raw_input.get("image_url", "https://images.unsplash.com/photo-1500382017468-9049fed747ef")
        vision_res = self.vision_agent.run(
            image_url,
            raw_input.get("water_clarity", "Cloudy"),
            raw_input.get("waste_level", "Low")
        )
        
        # 4. Synthesize multi-agent result
        return {
            "orchestrator_status": "COMPLETED",
            "assessment": assess_res,
            "validation": val_res,
            "vision": vision_res
        }

    def generate_full_intelligence(self, stream_name: str, health_score: float, risk_level: str, factors: list, recent_turbidity: float) -> Dict[str, Any]:
        """Runs downstream agents: Insight, Risk, Story, and One Health."""
        insight = self.insight_agent.run(stream_name, health_score, "improving", "turbidity")
        risk = self.risk_agent.run(stream_name, risk_level, factors)
        story = self.story_agent.run(stream_name, health_score, recent_turbidity)
        one_health = self.one_health_agent.run(stream_name, health_score, risk_level)

        return {
            "insight": insight,
            "risk_explanation": risk,
            "story": story,
            "one_health": one_health
        }

orchestrator = AquaAIOrchestrator()
