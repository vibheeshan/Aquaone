"use client";

import { CheckCircle2, ShieldCheck, Droplets, Activity, Shield, BookOpen, Trophy, ShieldAlert, Layers } from "lucide-react";

export default function FeatureMappingPage() {
  const modules = [
    {
      domain: "Citizen Science",
      name: "Guided UX & Field Intake",
      component: "Smart Stream Assessment Wizard (/assess)",
      evidence: "Guided citizen workflow, plain-language turbidity questions, photo quality verification, GPS capture, and sensor input fields.",
      icon: Droplets,
    },
    {
      domain: "Data Analytics",
      name: "Data-to-Insight Engine",
      component: "Stream Health Dashboard & Trends (/dashboard, /insights, /streams)",
      evidence: "0-100 analytical health score index, 4 core sub-indicators (Water Quality, Pollution, Biodiversity, Ecosystem), spatial Leaflet map, and Recharts trend analysis.",
      icon: Activity,
    },
    {
      domain: "AI Verification",
      name: "AquaAI Validation & Review",
      component: "AquaAI Engine & Expert Review (/ai-review)",
      evidence: "7-agent orchestrator (Validation, Vision, Risk, Story, etc.), visual evidence confidence scoring, and expert human-in-the-loop review interface.",
      icon: Shield,
    },
    {
      domain: "Awareness & Education",
      name: "Storytelling & Learning",
      component: "AquaStory & Education Center (/stories, /learn)",
      evidence: "Automated narrative story cards, chronological watershed timelines, micro-learning quizzes, and personal impact tracking.",
      icon: BookOpen,
    },
    {
      domain: "Gamification",
      name: "Community Missions & Streaks",
      component: "Stream Guardian Missions & Leaderboard (/challenges, /community, /leaderboard, /badges)",
      evidence: "7-Day Guardian challenges, XP points, leveling system, streaks, and global community leaderboard.",
      icon: Trophy,
    },
    {
      domain: "Resilience ML",
      name: "Risk Engine & Early Warnings",
      component: "AquaPredict Risk Engine & Alerts (/predictions, /alerts)",
      evidence: "Baseline ML risk prediction model (XGBoost/scikit-learn), explainable feature importance, and automated early warning alert dispatch.",
      icon: ShieldAlert,
    },
    {
      domain: "Standards",
      name: "One Health & Interoperability",
      component: "One Health Interoperability Bridge (/one-health, /interop)",
      evidence: "HL7 FHIR R4 Observation JSON mapper conforming to LOINC 72109-2 (Water Turbidity) and RESTful OpenAPI endpoints.",
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Platform Architectural Matrix</span>
        </div>
        <h1 className="text-3xl font-black text-white">AquaOne Feature Architecture</h1>
        <p className="text-xs text-slate-400">
          Traceability table mapping core platform capability domains directly to implemented AquaOne modules & empirical evidence.
        </p>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
              <th className="p-4 font-bold">Capability Domain</th>
              <th className="p-4 font-bold">AquaOne Component</th>
              <th className="p-4 font-bold">Implementation Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {modules.map((m) => {
              const ModuleIcon = m.icon;
              return (
                <tr key={m.domain} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 font-bold text-cyan-400 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                        <ModuleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div>{m.domain}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{m.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white whitespace-nowrap">{m.component}</td>
                  <td className="p-4 text-slate-300 leading-relaxed">{m.evidence}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
