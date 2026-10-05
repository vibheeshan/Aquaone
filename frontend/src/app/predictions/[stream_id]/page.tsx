"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  ShieldAlert, ArrowLeft, Brain, Sparkles, AlertTriangle, 
  TrendingUp, Clock, CheckCircle2, Info, ChevronRight,
  BarChart2, Zap, Scale, Compass, Activity, Droplets
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, Cell 
} from "recharts";

export default function SinglePredictionPage() {
  const params = useParams();
  const router = useRouter();
  const streamId = params?.stream_id || "1";

  const [prediction, setPrediction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi(`/predictions/${streamId}`)
      .then(setPrediction)
      .catch((err) => console.error("Error fetching stream prediction:", err))
      .finally(() => setLoading(false));
  }, [streamId]);

  if (loading || !prediction) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        Loading AquaPredict ML Risk Model Telemetry...
      </div>
    );
  }

  const isHigh = prediction.risk_level === "HIGH";
  const isMed = prediction.risk_level === "MEDIUM";

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Back Link */}
      <Link 
        href="/predictions"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Stream Predictions</span>
      </Link>

      {/* Main Single-Stream Hero Banner */}
      <div className={`glass-card p-6 sm:p-8 rounded-3xl border space-y-6 ${
        isHigh 
          ? "border-red-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/20 shadow-2xl shadow-red-950/30" 
          : isMed 
          ? "border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20" 
          : "border-cyan-500/40"
      }`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Station Predictive Risk Deep-Dive
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              {prediction.stream_name}
              <span className={`text-xs px-3 py-1 rounded-full font-black border ${
                isHigh ? "bg-red-950 text-red-300 border-red-500 animate-pulse" :
                isMed ? "bg-amber-950 text-amber-300 border-amber-500" :
                "bg-emerald-950 text-emerald-300 border-emerald-500"
              }`}>
                {prediction.risk_level} RISK
              </span>
            </h1>
            <div className="text-xs text-slate-400">
              Analyzed with {prediction.model_metadata.model_architecture} • Accuracy: {prediction.model_metadata.accuracy_score * 100}%
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">RISK PROBABILITY</div>
              <div className="text-4xl font-black text-white">{Math.round(prediction.risk_probability * 100)}%</div>
              <div className="text-[10px] text-slate-500">Severity: {prediction.severity}</div>
            </div>
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40">
              <ShieldAlert className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Explainability XAI Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Explainable AI (XAI) Decision Attribution</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {prediction.xai_summary}
          </p>
        </div>

        {/* Probability Breakdown Distribution */}
        <div className="space-y-1.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Multi-Class Probability Distribution
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-red-500/30 text-center">
              <span className="text-slate-400 text-[10px]">High Risk</span>
              <div className="text-base font-black text-red-400">{Math.round(prediction.probability_breakdown.high_risk_prob * 100)}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-center">
              <span className="text-slate-400 text-[10px]">Medium Risk</span>
              <div className="text-base font-black text-amber-300">{Math.round(prediction.probability_breakdown.medium_risk_prob * 100)}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-center">
              <span className="text-slate-400 text-[10px]">Low Risk</span>
              <div className="text-base font-black text-emerald-400">{Math.round(prediction.probability_breakdown.low_risk_prob * 100)}%</div>
            </div>
          </div>
        </div>

      </div>

      {/* Multi-Horizon Forecast Outlook Cards */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Multi-Horizon Predictive Forecast Trajectories</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prediction.forecast_horizons.map((f: any, idx: number) => (
            <div key={idx} className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">{f.horizon}</span>
                <span className="text-cyan-400 font-bold">{f.confidence_pct}% Conf.</span>
              </div>
              <div className="text-2xl font-black text-white">
                {f.predicted_health} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Projected Trend: <strong className="text-cyan-300 uppercase">{f.trend}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance XAI Chart */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Feature Importance & Degradation Triggers</span>
            </h3>
            <p className="text-xs text-slate-400">Relative weight assigned by the Random Forest model to each input parameter.</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prediction.explainable_factors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
              <YAxis dataKey="factor" type="category" stroke="#64748b" fontSize={11} width={160} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
              <Bar dataKey="importance_percent" fill="#06b6d4" radius={[0, 6, 6, 0]} name="Importance (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Next Step Action: What-If Simulation */}
      <div className="p-6 rounded-3xl glass-card border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 to-slate-900">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">Simulate Intervention What-If Scenarios</h4>
          <p className="text-xs text-slate-300">
            Test how trash boom deployment, rainfall surges, and riparian buffers will alter this stream's risk trajectory.
          </p>
        </div>

        <Link
          href={`/scenarios?stream=${streamId}`}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch What-If Simulation</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
