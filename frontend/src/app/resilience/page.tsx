"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi, Stream } from "@/lib/api";
import { 
  Activity, ShieldCheck, HeartPulse, Sparkles, Filter, 
  TrendingUp, Compass, ArrowRight, CheckCircle2, Droplets,
  Layers, Scale, ChevronRight
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, AreaChart, Area, Legend 
} from "recharts";

export default function ResiliencePage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<number>(1);
  const [resilienceData, setResilienceData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<Stream[]>("/streams")
      .then((data) => {
        setStreams(data);
        if (data.length > 0) setSelectedStreamId(data[0].id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedStreamId) return;
    setLoading(true);
    fetchApi(`/resilience/${selectedStreamId}`)
      .then(setResilienceData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedStreamId]);

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Ecological Resilience & Recovery Planning</span>
          </div>
          <h1 className="text-3xl font-black text-white">Watershed Resilience Matrix</h1>
          <p className="text-xs text-slate-400">
            Ecosystem recovery trajectories, environmental vulnerability scoring, and intervention roadmap modeling.
          </p>
        </div>

        {/* Stream Selector */}
        <div className="flex items-center space-x-3 bg-slate-900 p-2 rounded-2xl border border-slate-700">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 pl-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Station:
          </label>
          <select
            value={selectedStreamId}
            onChange={(e) => setSelectedStreamId(Number(e.target.value))}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.health_score}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {resilienceData && (
        <>
          {/* Top 3 Core Scores: Resilience, Vulnerability, Stress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Resilience Score */}
            <div className="glass-card p-6 rounded-3xl border border-cyan-500/40 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-cyan-400 uppercase">Resilience Index</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                  {resilienceData.resilience_grade}
                </span>
              </div>
              <div className="text-4xl font-black text-white">
                {resilienceData.resilience_score} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Adaptive capacity to absorb monsoon shock and recover baseline oxygen levels.
              </p>
            </div>

            {/* Vulnerability Score */}
            <div className="glass-card p-6 rounded-3xl border border-amber-500/40 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-400 uppercase">Vulnerability Score</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Risk Exposure</span>
              </div>
              <div className="text-4xl font-black text-amber-300">
                {resilienceData.vulnerability_score} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Sensitivity to industrial washings, stormwater runoff, and bank soil erosion.
              </p>
            </div>

            {/* Stress Index */}
            <div className="glass-card p-6 rounded-3xl border border-purple-500/40 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/20">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-purple-400 uppercase">Environmental Stress</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">Anthropogenic</span>
              </div>
              <div className="text-4xl font-black text-purple-300">
                {resilienceData.environmental_stress_index} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Combined pollutant loading pressure from urban drainage and solid waste.
              </p>
            </div>

          </div>

          {/* 12-Month Recovery Trajectory Curve Chart */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>12-Month Ecological Recovery Trajectory Model</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Projected health score progression with sustained community intervention and trash boom maintenance.
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={resilienceData.recovery_trajectory}>
                  <defs>
                    <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[20, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Line type="monotone" dataKey="baseline" stroke="#f59e0b" strokeDasharray="5 5" name="Current Baseline" />
                  <Area type="monotone" dataKey="projected_health" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#recGrad)" name="Projected Recovery Health" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intervention Roadmap & Next Step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold uppercase text-cyan-400">Intervention Phase 1</div>
              <h4 className="font-bold text-white text-sm">Floating Trash Boom Deployment</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Stops 65% of floating single-use plastics from entering downstream estuarine wetlands within 14 days.
              </p>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold uppercase text-purple-400">Intervention Phase 2</div>
              <h4 className="font-bold text-white text-sm">Riparian Vegetation Buffer</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Plant 50m of native vetiver grass along riverbanks to filter agricultural runoff and improve DO by +1.2 mg/L.
              </p>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold uppercase text-emerald-400">Intervention Phase 3</div>
              <h4 className="font-bold text-white text-sm">Community Sensor Mesh</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Continuous IoT telemetry alerts municipal teams within 15 minutes of an outfall chemical threshold breach.
              </p>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
