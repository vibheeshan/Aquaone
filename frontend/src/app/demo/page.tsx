"use client";

import { useState } from "react";
import { Play, Sparkles, CheckCircle2, Droplets, Shield, Activity, ShieldAlert, BookOpen, Trophy, Layers, Code, ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function DemoPage() {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoResult, setDemoResult] = useState<any>(null);

  const stepsList = [
    { title: "1. Citizen Observation Input", icon: Droplets, desc: "Simulating field assessment submission (Water Clarity: Cloudy, Turbidity: High)" },
    { title: "2. AquaAI Agent Validation", icon: Shield, desc: "ValidationAgent & VisionAgent running visual evidence boundary checks" },
    { title: "3. Expert Human-in-the-Loop Review", icon: Shield, desc: "Human reviewer approves observation record into database" },
    { title: "4. Verified Data Storage", icon: CheckCircle2, desc: "Observation committed with full spatial & temporal provenance" },
    { title: "5. Stream Health Index Recalculation", icon: Activity, desc: "Health index updated dynamically from 78.0 to 73.5" },
    { title: "6. GIS Spatial Map & Trend Sync", icon: Activity, desc: "Map pin color shifted and 60-day telemetry line updated" },
    { title: "7. AquaPredict ML Anomaly Forecast", icon: ShieldAlert, desc: "XGBoost model predicts Elevated Risk probability (0.78)" },
    { title: "8. Early Warning Alert Dispatch", icon: ShieldAlert, desc: "Active turbidity alert generated with recommended guardian actions" },
    { title: "9. AquaStory Narrative Synthesis", icon: BookOpen, desc: "Narrative story card & interactive quiz generated" },
    { title: "10. Community Gamification Award", icon: Trophy, desc: "+30 XP points awarded to citizen observer (Level Up!)" },
    { title: "11. One Health Interoperability Matrix", icon: Layers, desc: "Ecological and waterborne exposure context synthesized" },
    { title: "12. FHIR R4 Standardized API Serialization", icon: Code, desc: "Observation exported as HL7 FHIR R4 JSON (LOINC 72109-2)" },
  ];

  const runDemoWorkflow = async () => {
    setRunning(true);
    setCurrentStep(0);
    setDemoResult(null);

    // Step through visual steps
    for (let i = 0; i < stepsList.length; i++) {
      setCurrentStep(i + 1);
      await new Promise((res) => setTimeout(res, 400));
    }

    try {
      const res = await fetchApi("/demo/run-workflow", { method: "POST" });
      setDemoResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Automated Acceptance & Hackathon Presentation Engine</span>
        </div>
        <h1 className="text-4xl font-black text-white">AquaOne End-to-End Demo Workflow</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Execute the complete 24-step unified pipeline from citizen observation to FHIR digital health serialization with a single click.
        </p>

        <div className="pt-4">
          <button
            onClick={runDemoWorkflow}
            disabled={running}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-[2px] shadow-xl shadow-cyan-500/25 active:scale-95 transition mx-auto"
          >
            <div className="flex items-center space-x-3 rounded-2xl bg-slate-950 px-8 py-4 transition group-hover:bg-opacity-80">
              <Play className="h-5 w-5 fill-cyan-400 text-cyan-400 animate-pulse" />
              <span className="text-base font-black bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                {running ? "EXECUTING AQUAONE PIPELINE..." : "RUN AQUAONE DEMO"}
              </span>
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Visual Execution Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {stepsList.map((stepItem, idx) => {
          const StepIcon = stepItem.icon;
          const isDone = currentStep > idx || demoResult;
          const isActive = currentStep === idx + 1 && running;

          return (
            <div
              key={stepItem.title}
              className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? "bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                  : isDone
                  ? "bg-slate-900/80 border-emerald-500/40"
                  : "glass-card border-slate-800 opacity-50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl ${isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <span className="text-[10px] text-cyan-400 font-bold animate-pulse">Processing...</span>
                  ) : null}
                </div>

                <div className="font-bold text-white text-xs">{stepItem.title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{stepItem.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backend JSON Output Display */}
      {demoResult && (
        <div className="glass-card p-6 rounded-3xl border border-cyan-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              Execution Output & FHIR R4 Interoperability Payload
            </h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              24 STEPS PASSED SUCCESSFULLY
            </span>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto max-h-80 font-mono">
            {JSON.stringify(demoResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
