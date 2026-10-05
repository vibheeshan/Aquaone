"use client";

import { useEffect, useState } from "react";
import { fetchApi, Stream } from "@/lib/api";
import { 
  Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, 
  RotateCcw, AlertTriangle, CheckCircle2, TrendingUp,
  Droplets, Flame, Compass, Scale, Info
} from "lucide-react";

export default function ScenariosPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<number>(1);
  const [rainfall, setRainfall] = useState<number>(20);
  const [wasteReduction, setWasteReduction] = useState<number>(30);
  const [riparianBuffer, setRiparianBuffer] = useState<number>(15);
  const [tempShock, setTempShock] = useState<number>(1.5);
  const [simResult, setSimResult] = useState<any | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchApi<Stream[]>("/streams")
      .then((data) => {
        setStreams(data);
        if (data.length > 0) setSelectedStreamId(data[0].id);
      })
      .catch(console.error);
  }, []);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetchApi<any>("/scenarios/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stream_id: selectedStreamId,
          delta_rainfall_mm: rainfall,
          waste_reduction_pct: wasteReduction,
          riparian_buffer_gain_m: riparianBuffer,
          temp_shock_c: tempShock
        })
      });
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    if (selectedStreamId) {
      runSimulation();
    }
  }, [selectedStreamId, rainfall, wasteReduction, riparianBuffer, tempShock]);

  const handleReset = () => {
    setRainfall(0);
    setWasteReduction(0);
    setRiparianBuffer(0);
    setTempShock(0);
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>What-If Resilience Scenario Simulator</span>
          </div>
          <h1 className="text-3xl font-black text-white">What-If Scenario Simulation Studio</h1>
          <p className="text-xs text-slate-400">
            Interactive sensitivity sandbox: simulate extreme weather events, cleanup interventions, and buffer expansions.
          </p>
        </div>

        {/* Stream Selector */}
        <div className="flex items-center space-x-3 bg-slate-900 p-2 rounded-2xl border border-slate-700">
          <label className="text-xs font-semibold text-slate-400 pl-2">Station:</label>
          <select
            value={selectedStreamId}
            onChange={(e) => setSelectedStreamId(Number(e.target.value))}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            {streams.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.health_score}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>WHAT-IF SIMULATION SCENARIO (DEMO DATA) — Multi-variable analytical sensitivity testing model.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Scenario Sliders (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Intervention & Stress Parameters</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            
            {/* Slider 1: Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Precipitation Surge</span>
                <span className="text-cyan-400 font-mono">+{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm (Normal)</span>
                <span>+80 mm (Monsoon Cloudburst)</span>
              </div>
            </div>

            {/* Slider 2: Waste Reduction */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Trash Boom Waste Reduction</span>
                <span className="text-emerald-400 font-mono">{wasteReduction}% Debris Intercepted</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={wasteReduction}
                onChange={(e) => setWasteReduction(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (No Boom)</span>
                <span>80% (Triple Boom Mesh)</span>
              </div>
            </div>

            {/* Slider 3: Riparian Buffer */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Riparian Vegetation Buffer</span>
                <span className="text-purple-400 font-mono">+{riparianBuffer} m Width</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={riparianBuffer}
                onChange={(e) => setRiparianBuffer(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 m (Bare Banks)</span>
                <span>+50 m (Native Wetland Forest)</span>
              </div>
            </div>

            {/* Slider 4: Temperature Shock */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Urban Heat Island Shock</span>
                <span className="text-amber-400 font-mono">+{tempShock} °C</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={tempShock}
                onChange={(e) => setTempShock(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>+0.0 °C</span>
                <span>+5.0 °C (Acute Summer Heat)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Projected Outcomes & Mitigations (7 Cols) */}
        {simResult && (
          <div className="lg:col-span-7 space-y-6">
            
            {/* Projected Score Delta Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 space-y-6 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Simulated Watershed Outcome
                  </span>
                  <h3 className="text-xl font-bold text-white">{simResult.stream_name}</h3>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Baseline Health</div>
                  <div className="text-lg font-bold text-slate-300">{simResult.baseline_health_score}/100</div>
                </div>
              </div>

              {/* Big Outcome Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Projected Health</span>
                  <div className="text-2xl font-black text-cyan-300">
                    {simResult.simulated_outcomes.projected_health_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Projected Turbidity</span>
                  <div className="text-2xl font-black text-white">
                    {simResult.simulated_outcomes.projected_turbidity_ntu} <span className="text-xs font-normal text-slate-400">NTU</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Projected DO</span>
                  <div className="text-2xl font-black text-emerald-400">
                    {simResult.simulated_outcomes.projected_dissolved_oxygen_mg_l} <span className="text-xs font-normal text-slate-400">mg/L</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Recovery Velocity</span>
                  <div className="text-2xl font-black text-purple-300">
                    {simResult.simulated_outcomes.estimated_recovery_weeks} <span className="text-xs font-normal text-slate-400">Weeks</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Dynamic Mitigation Action Recommendations */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recommended Scenario Interventions</span>
              </h4>

              <div className="space-y-2 text-xs">
                {simResult.mitigation_recommendations?.map((rec: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-200 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
