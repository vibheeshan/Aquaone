"use client";

import { useEffect, useState } from "react";
import { fetchApi, OneHealthInsight } from "@/lib/api";
import { Layers, Activity, ShieldAlert, Heart, ArrowRight, Info, CheckCircle2 } from "lucide-react";

export default function OneHealthPage() {
  const [insights, setInsights] = useState<OneHealthInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<OneHealthInsight[]>("/one-health/insights")
      .then((data) => setInsights(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>One Health Interoperability Bridge</span>
        </div>
        <h1 className="text-3xl font-black text-white">One Health Intelligence Matrix</h1>
        <p className="text-xs text-slate-400">
          Integrating stream health parameters with potential animal, ecological, and community exposure context.
        </p>
      </div>

      {/* Safety & Terminology Banner (Section 26 Requirement) */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-400" />
          Scientific Safety & Terminology Disclaimer:
        </div>
        <p className="text-[11px] text-amber-200/90 leading-relaxed">
          AquaOne provides analytical risk indicators ("potential exposure pathway", "environmental indicator"). We do not make direct medical diagnoses or claim causal illness link without laboratory clinical verification.
        </p>
      </div>

      {/* One Health Pipeline Diagram Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">One Health Multi-Agent Orchestration Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/30">
            <div className="font-bold text-cyan-400">1. Environment</div>
            <div className="text-[10px] text-slate-400 mt-1">Turbidity & Flow</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30">
            <div className="font-bold text-emerald-400">2. Ecosystem</div>
            <div className="text-[10px] text-slate-400 mt-1">Bio-indicators & Algae</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-purple-500/30">
            <div className="font-bold text-purple-400">3. Health Context</div>
            <div className="text-[10px] text-slate-400 mt-1">Waterborne Vectors</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30">
            <div className="font-bold text-amber-400">4. One Health Action</div>
            <div className="text-[10px] text-slate-400 mt-1">Recommended Interventions</div>
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Loading One Health insights...</div>
      ) : (
        <div className="space-y-6">
          {insights.map((ins) => (
            <div key={ins.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-cyan-400">{ins.title}</span>
                <span className="text-xs text-slate-400">{new Date(ins.created_at).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">Ecological Context</div>
                  <p className="text-slate-300">{ins.ecosystem_link}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">Animal Health Risk Indicator</div>
                  <p className="text-slate-300">{ins.animal_health_risk}</p>
                </div>

                <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-purple-400">Community Health Exposure Context</div>
                  <p className="text-slate-300">{ins.human_health_risk}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1">
                <div className="font-bold text-cyan-300">Recommended Intervention:</div>
                <p className="text-slate-200">{ins.recommended_intervention}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
