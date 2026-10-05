"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi, Stream } from "@/lib/api";
import { 
  Sparkles, Brain, AlertTriangle, TrendingUp, TrendingDown, 
  Layers, Compass, Scale, ShieldAlert, ArrowRight, CheckCircle2,
  HelpCircle, RefreshCw, BarChart2, Filter, Activity, FileText,
  Clock, HeartPulse, Info, Flame, ChevronRight, Zap
} from "lucide-react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, PieChart, Pie, Cell 
} from "recharts";

export default function StreamInsightsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<number>(1);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  useEffect(() => {
    fetchApi<Stream[]>("/streams")
      .then((data) => {
        setStreams(data);
        if (data.length > 0) setSelectedStreamId(data[0].id);
      })
      .catch((err) => console.error("Error fetching streams:", err));
  }, []);

  useEffect(() => {
    if (!selectedStreamId) return;
    setLoading(true);
    fetchApi(`/analytics/comprehensive/${selectedStreamId}`)
      .then((data) => setAnalytics(data))
      .catch((err) => console.error("Error fetching comprehensive analytics:", err))
      .finally(() => setLoading(false));
  }, [selectedStreamId]);

  const COLORS = ["#06b6d4", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7"];

  const filteredRecommendations = analytics?.ai_intelligence?.recommendations?.filter((r: any) => {
    if (priorityFilter === "ALL") return true;
    return r.priority === priorityFilter;
  }) || [];

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header & Station Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Environmental Intelligence & Diagnostic Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">Stream Intelligence & Insights Hub</h1>
          <p className="text-xs text-slate-400">
            Autonomous pattern detection, anomaly diagnosis, cross-parameter correlation analysis, and pollution source attribution.
          </p>
        </div>

        {/* Station Filter */}
        <div className="flex items-center space-x-3 bg-slate-900 p-2 rounded-2xl border border-slate-700">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 pl-2">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            Target Station:
          </label>
          <select
            value={selectedStreamId}
            onChange={(e) => setSelectedStreamId(Number(e.target.value))}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.health_score}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {analytics && (
        <>
          {/* Main AI Diagnostic Summary Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-500/40">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    AquaAI Multi-Agent Diagnostic
                  </span>
                  <h2 className="text-xl font-bold text-white">{analytics.stream_name} Diagnostic Synthesis</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-cyan-300 border border-slate-700">
                  Health: {analytics.health_score}/100
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Trend: {analytics.ai_intelligence.trend_direction.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {analytics.ai_intelligence.summary}
            </p>

            {/* Anomaly Alerts Section */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Automatic Anomaly Detection Alerts</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analytics.ai_intelligence.anomalies.map((anom: any, idx: number) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      anom.severity === "HIGH" 
                        ? "bg-red-950/30 border-red-500/40 text-red-200" 
                        : anom.severity === "MEDIUM"
                        ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                        : "bg-slate-900/60 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        {anom.metric}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 font-mono">
                        {anom.severity} PRIORITY
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">{anom.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pattern Detection & Correlation Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pattern Detection */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Hydrological Pattern Detection
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">ML Pattern Recognition</span>
              </div>

              <div className="space-y-3 text-xs">
                {analytics.ai_intelligence.patterns.map((p: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>{p.pattern}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
                        {Math.round(p.confidence * 100)}% Confidence
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{p.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Parameter Correlation Analysis */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  Statistical Correlation Matrix (Pearson r)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Bivariate r Analysis</span>
              </div>

              <div className="space-y-3 text-xs">
                {analytics.ai_intelligence.correlations.map((c: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-200">{c.variable_a} ↔ {c.variable_b}</span>
                      <span className={`text-xs font-mono font-black ${
                        c.pearson_r > 0 ? "text-cyan-400" : "text-purple-400"
                      }`}>
                        r = {c.pearson_r} ({c.relationship})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{c.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Pollution Source Attribution & Environmental Factors */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-amber-400" />
                  Pollution Source Attribution & Catchment Drivers
                </h3>
                <p className="text-xs text-slate-400">Estimated contributing sources based on chemical variance, turbidity, and land-use mapping.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.ai_intelligence.pollution_sources.map((src: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{src.source}</span>
                    <span className="text-sm font-black text-cyan-400">{src.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${src.percentage}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 space-y-1">
                    <div>Primary: <span className="text-slate-300 font-semibold">{src.primary_pollutant}</span></div>
                    <div>Remediation: <span className="text-emerald-400">{src.mitigation}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prioritized Actionable Recommendations */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Prioritized Actionable Insights & Interventions
                </h3>
                <p className="text-xs text-slate-400">Actionable intelligence ranked by ecological urgency and stakeholder role.</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-700 self-start sm:self-auto text-xs">
                {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setPriorityFilter(lvl)}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      priorityFilter === lvl ? "bg-cyan-500 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredRecommendations.map((rec: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/40 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        rec.priority === "HIGH" 
                          ? "bg-red-500/20 text-red-300 border border-red-500/30" 
                          : rec.priority === "MEDIUM"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}>
                        {rec.priority} PRIORITY
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{rec.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-slate-300">Target Stakeholder: <span className="text-cyan-300 font-semibold">{rec.target_audience}</span></p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right shrink-0 md:max-w-xs">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Expected Impact</div>
                    <div className="text-xs font-semibold text-emerald-400">{rec.expected_impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
