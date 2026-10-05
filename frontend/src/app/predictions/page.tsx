"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  ShieldAlert, Brain, Sparkles, AlertTriangle, TrendingUp, Filter, 
  CheckCircle2, Info, ArrowRight, ShieldCheck, Activity, Layers,
  Compass, BarChart3, Clock, ChevronRight, Gauge, Cpu, Zap
} from "lucide-react";

export default function PredictionsOverviewPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  useEffect(() => {
    fetchApi("/predictions/overview/all")
      .then(setData)
      .catch((err) => console.error("Error fetching predictions overview:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPredictions = data?.predictions?.filter((p: any) => {
    if (filterLevel === "ALL") return true;
    return p.risk_level === filterLevel;
  }) || [];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Resilience Informatics & ML Risk Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">AquaPredict Risk Intelligence</h1>
          <p className="text-xs text-slate-400">
            Predictive machine learning risk forecasting, multi-horizon degradation modeling, and early warning analytics.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/alerts"
            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-xs transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Active Alerts (3)</span>
          </Link>
          <Link
            href="/scenarios"
            className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>What-If Studio</span>
          </Link>
          <Link
            href="/resilience"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resilience Matrix</span>
          </Link>
        </div>
      </div>

      {/* Mandatory Transparent Demo Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">SIMULATED PREDICTIVE INTELLIGENCE (DEMO / REFERENCE DATA)</span>
          <p className="text-[11px] text-slate-300">
            AquaPredict models risk probability using an ensemble Random Forest / Gradient Boosted model trained on multi-parameter environmental telemetry. Presented transparently for hackathon architecture evaluation and resilience planning.
          </p>
        </div>
      </div>

      {data && (
        <>
          {/* ML Model Performance & Monitoring Metrics Top Bar */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                <Cpu className="w-4 h-4" />
                <span>ML Model Architecture & Real-Time Monitoring Telemetry</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{data.model_metadata.training_framework}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">ROC-AUC Score</span>
                <div className="text-xl font-black text-cyan-300">{data.model_metadata.roc_auc_score}</div>
                <div className="text-[10px] text-emerald-400">High Discriminative Power</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Model Accuracy</span>
                <div className="text-xl font-black text-emerald-400">{data.model_metadata.accuracy_score * 100}%</div>
                <div className="text-[10px] text-slate-400">Cross-Validated</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">F1-Score</span>
                <div className="text-xl font-black text-purple-300">{data.model_metadata.f1_score}</div>
                <div className="text-[10px] text-slate-400">Harmonic Precision/Recall</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Inference Latency</span>
                <div className="text-xl font-black text-white">{data.model_metadata.inference_latency_ms} ms</div>
                <div className="text-[10px] text-emerald-400">Sub-20ms Real-Time</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Brier Score</span>
                <div className="text-xl font-black text-teal-300">{data.model_metadata.brier_loss}</div>
                <div className="text-[10px] text-slate-400">Calibration Accuracy</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Critical Stations</span>
                <div className="text-xl font-black text-red-400">{data.high_risk_stations_count} Station</div>
                <div className="text-[10px] text-red-300">Action Required</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-800 pb-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Watershed Monitoring Stations Risk Matrix ({data.stations_evaluated} Stations)
            </div>

            <div className="flex items-center gap-2 text-xs">
              {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-3 py-1 rounded-xl font-bold transition ${
                    filterLevel === lvl 
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" 
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {lvl} RISK
                </button>
              ))}
            </div>
          </div>

          {/* Station Prediction Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPredictions.map((pred: any) => {
              const isHigh = pred.risk_level === "HIGH";
              const isMed = pred.risk_level === "MEDIUM";

              return (
                <div 
                  key={pred.stream_id}
                  className={`glass-card p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition ${
                    isHigh 
                      ? "border-red-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/20 shadow-xl shadow-red-950/30" 
                      : isMed
                      ? "border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20"
                      : "border-emerald-500/30 bg-slate-900/80"
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Stream Name & Risk Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">{pred.stream_code}</span>
                        <h3 className="text-base font-bold text-white">{pred.stream_name}</h3>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                        isHigh ? "bg-red-950 text-red-300 border-red-500/60 animate-pulse" :
                        isMed ? "bg-amber-950 text-amber-300 border-amber-500/50" :
                        "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                      }`}>
                        {pred.risk_level} RISK
                      </span>
                    </div>

                    {/* Risk Probability Gauge */}
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Risk Probability</div>
                        <div className="text-2xl font-black text-white">{Math.round(pred.risk_probability * 100)}%</div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Health Score</div>
                        <div className="text-xl font-bold text-cyan-300">{pred.current_health_score}/100</div>
                      </div>
                    </div>

                    {/* XAI Driving Factors */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Top ML Driving Risk Factors (XAI)
                      </div>
                      <div className="space-y-1 text-[11px]">
                        {pred.explainable_factors.slice(0, 3).map((f: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-slate-300 bg-slate-950/60 px-2.5 py-1 rounded-lg">
                            <span>{f.factor}</span>
                            <span className="font-mono text-cyan-300 font-bold">{f.current_value} {f.trend_direction}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Short-Term 48h Outlook */}
                    <div className="text-[11px] text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>48-Hour Short Term Outlook</span>
                        <span className="text-cyan-400 font-semibold">{pred.forecast_horizons[0].confidence_pct}% Conf.</span>
                      </div>
                      <div className="font-bold text-white">
                        Projected Health: <span className={isHigh ? "text-red-400" : "text-emerald-400"}>{pred.forecast_horizons[0].predicted_health}/100</span>
                      </div>
                    </div>

                  </div>

                  {/* Deep Dive Action Link */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <Link
                      href={`/predictions/${pred.stream_id}`}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <span>Full Multi-Horizon Deep Dive</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}
