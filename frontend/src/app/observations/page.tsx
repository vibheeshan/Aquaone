"use client";

import { useEffect, useState } from "react";
import { fetchApi, Observation } from "@/lib/api";
import { Droplets, ShieldCheck, Filter, Search, Calendar, MapPin, Eye, CheckCircle2, Clock } from "lucide-react";

export default function ObservationsPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClarity, setFilterClarity] = useState("all");
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null);

  useEffect(() => {
    fetchApi<Observation[]>("/observations")
      .then((data) => {
        setObservations(data);
        if (data.length > 0) setSelectedObs(data[0]);
      })
      .catch((err) => console.error("Error fetching observations:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = observations.filter((o) => {
    if (filterClarity !== "all" && o.water_clarity.toLowerCase() !== filterClarity.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Observation Data Provenance & AI Validation</span>
          </div>
          <h1 className="text-3xl font-black text-white">Citizen Field Observations</h1>
          <p className="text-xs text-slate-400">
            Real-time audit directory of citizen assessments, visual evidence, and AI confidence validations.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-3 text-xs">
          <label className="text-slate-300 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Water Clarity:
          </label>
          <select
            value={filterClarity}
            onChange={(e) => setFilterClarity(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Clarities</option>
            <option value="Very clear">Very clear</option>
            <option value="Slightly cloudy">Slightly cloudy</option>
            <option value="Cloudy">Cloudy</option>
            <option value="Very muddy">Very muddy</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Observations List */}
        <div className="lg:col-span-1 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-10 text-xs text-slate-500">Loading observation logs...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">No observations found.</div>
          ) : (
            filtered.map((obs) => (
              <div
                key={obs.id}
                onClick={() => setSelectedObs(obs)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedObs?.id === obs.id
                    ? "bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                    : "glass-card hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-cyan-400">Observation #{obs.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      obs.status === "verified"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    {obs.status === "verified" ? "AI & Expert Verified" : "Pending Review"}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Clarity: {obs.water_clarity}</span>
                    <span className="text-cyan-300">{obs.turbidity_ntu} NTU</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>Stream #{obs.stream_id} (Lat: {obs.latitude}, Lng: {obs.longitude})</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(obs.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Observation Detail Inspector */}
        <div className="lg:col-span-2">
          {selectedObs ? (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase">Provenance Audit</span>
                  <h2 className="text-2xl font-black text-white">Observation #{selectedObs.id} Details</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                  {selectedObs.status.toUpperCase()}
                </span>
              </div>

              {/* Photo & Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Visual Evidence Photo</label>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 aspect-video bg-slate-900">
                    <img
                      src={selectedObs.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef"}
                      alt="Stream Observation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="text-xs font-bold text-slate-300">Field Parameters</label>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Water Clarity</div>
                      <div className="font-bold text-white">{selectedObs.water_clarity}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Mapped Turbidity</div>
                      <div className="font-bold text-cyan-400">{selectedObs.turbidity_ntu} NTU</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Waste Level</div>
                      <div className="font-bold text-amber-400">{selectedObs.waste_level}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Odor</div>
                      <div className="font-bold text-white">{selectedObs.odor}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400">Optional Sensor Inputs</div>
                    <div className="flex gap-4 font-semibold text-slate-200 text-[11px]">
                      <span>Temp: {selectedObs.water_temp_c}°C</span>
                      <span>pH: {selectedObs.ph_level}</span>
                      <span>DO: {selectedObs.dissolved_oxygen} mg/L</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Audit provenance */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Provenance & Quality Check
                </div>
                <p className="text-slate-300">
                  Notes: {selectedObs.notes || "Recorded via AquaOne Smart Assessment Wizard."}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-1 border-t border-cyan-500/20">
                  <span>GPS: Lat {selectedObs.latitude}, Lng {selectedObs.longitude}</span>
                  <span>Source: Citizen Science Observer</span>
                  <span>Demo Flag: {selectedObs.is_demo ? "Demo Mode" : "Real Observation"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl border border-slate-800 text-center text-xs text-slate-500">
              Select an observation from the list to view provenance telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
