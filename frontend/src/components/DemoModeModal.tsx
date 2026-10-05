"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Play, CheckCircle2, RefreshCw, X, Sparkles, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModeModal({ isOpen, onClose }: DemoModeModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunDemo = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await fetchApi("/demo/run-workflow?stream_id=1", {
        method: "POST",
      });
      setResult(data);
    } catch (err) {
      console.error("Demo run error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Unified 24-Step Demo Mode Execution
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                All 7 Tracks
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Watch a single citizen observation flow through Smart Assessment → AquaAI → Verification → Stream Intelligence → AquaPredict → AquaStory → Stream Guardian → One Health Bridge
            </p>
          </div>
        </div>

        {!result && !loading && (
          <div className="text-center py-10 bg-slate-900/50 rounded-xl border border-slate-800 p-6 my-4">
            <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-semibold text-white mb-2">Ready to trigger end-to-end platform simulation</h3>
            <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
              Clicking below executes a live citizen observation payload across our database, ML models, AI orchestrator, and FHIR mapper.
            </p>
            <button
              onClick={handleRunDemo}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white font-semibold shadow-lg hover:brightness-110 transition active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Run Unified Demo Workflow</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="py-16 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
            <p className="text-cyan-300 font-medium animate-pulse">
              Executing AquaAI Orchestrator & Multi-Track Pipeline...
            </p>
            <div className="text-xs text-slate-400">
              Assessing → Validating → Scoring → Predicting Risk → Generating Story & FHIR Mapping
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 mt-4">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Status: 200 OK</span>
                <h4 className="text-base font-bold text-white">{result.workflow}</h4>
                <p className="text-xs text-slate-400">{new Date(result.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={handleRunDemo}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run</span>
              </button>
            </div>

            {/* Steps Timeline Grid */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 max-h-60 overflow-y-auto space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Live Execution Audit Trace:</h5>
              {result.steps_summary?.map((step: string, i: number) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Output Tabs / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/20 space-y-2 text-xs">
                <div className="flex justify-between items-center text-cyan-400 font-semibold border-b border-slate-800 pb-1.5">
                  <span>AquaAI Validation Output</span>
                  <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded text-[10px]">
                    Conf: {Math.round((result.ai_validation?.confidence_score || 0.88) * 100)}%
                  </span>
                </div>
                <div><strong className="text-slate-200">Label:</strong> {result.ai_validation?.prediction_label}</div>
                <div><strong className="text-slate-200">Action:</strong> {result.ai_validation?.recommended_action}</div>
                <div className="text-slate-400 italic">"{result.ai_validation?.reasons_json?.[0]}"</div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-500/20 space-y-2 text-xs">
                <div className="flex justify-between items-center text-emerald-400 font-semibold border-b border-slate-800 pb-1.5">
                  <span>AquaPredict ML Risk Assessment</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    result.ml_risk_prediction?.risk_level === 'HIGH' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-300'
                  }`}>
                    Risk Level: {result.ml_risk_prediction?.risk_level}
                  </span>
                </div>
                <div><strong className="text-slate-200">Risk Probability:</strong> {Math.round((result.ml_risk_prediction?.risk_probability || 0.45) * 100)}%</div>
                <div><strong className="text-slate-200">Top Trigger:</strong> {result.ml_risk_prediction?.explainable_factors?.[0]?.factor}</div>
              </div>
            </div>

            {/* FHIR Code Preview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400 font-sans text-[11px] mb-1">
                <span>Standardized FHIR R4 JSON Output</span>
                <span className="text-emerald-400">Resource: Observation</span>
              </div>
              <pre className="text-cyan-300 overflow-x-auto max-h-36 p-2 bg-slate-900/90 rounded border border-slate-800">
                {JSON.stringify(result.fhir_interop_json, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
