"use client";

import { useEffect, useState } from "react";
import { fetchApi, Stream } from "@/lib/api";
import { 
  MapPin, Navigation, Info, ShieldAlert, Layers, Flame, 
  Users, Activity, Compass, Eye, ShieldCheck, RefreshCw, Zap
} from "lucide-react";

interface GISMapProps {
  streams: Stream[];
  selectedStreamId?: number;
  onSelectStream?: (id: number) => void;
}

export default function GISMapComponent({ streams, selectedStreamId, onSelectStream }: GISMapProps) {
  const [mounted, setMounted] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"health" | "hotspots" | "density" | "risk" | "biodiversity" | "flow">("health");
  const [gisLayers, setGisLayers] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchApi("/analytics/gis-layers")
      .then((data) => setGisLayers(data))
      .catch((err) => console.error("Error fetching GIS layers:", err));
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 w-full rounded-3xl glass-card flex items-center justify-center text-slate-400 text-xs">
        Loading GIS Spatial Intelligence Layer...
      </div>
    );
  }

  const selectedStream = streams.find((s) => s.id === selectedStreamId) || streams[0];

  const layerButtons = [
    { id: "health", label: "Health Score Index", icon: Activity, color: "text-cyan-400" },
    { id: "hotspots", label: "Pollution Hotspots", icon: Flame, color: "text-red-400" },
    { id: "density", label: "Observation Density", icon: Users, color: "text-indigo-400" },
    { id: "risk", label: "Predictive Risk Zones", icon: ShieldAlert, color: "text-orange-400" },
    { id: "biodiversity", label: "Biodiversity Sightings", icon: Eye, color: "text-purple-400" },
    { id: "flow", label: "Catchment & Flow Vectors", icon: Compass, color: "text-emerald-400" },
  ] as const;

  return (
    <div className="space-y-4">
      
      {/* Layer Switcher Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {layerButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeLayer === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveLayer(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isActive 
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-500/10" 
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${btn.color}`} />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Map Container */}
      <div className="relative h-[520px] w-full rounded-3xl overflow-hidden glass-card border border-slate-800 shadow-2xl">
        
        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 z-20 glass-card px-4 py-2 rounded-2xl text-xs font-semibold text-white flex items-center space-x-2 border border-slate-700/80 backdrop-blur-md">
          <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Active Layer: <span className="text-cyan-300 font-bold uppercase">{activeLayer.replace("_", " ")}</span></span>
          <span className="text-[10px] text-slate-400 ml-2">({streams.length} Watershed Stations)</span>
        </div>

        {/* Embedded Leaflet Map iframe */}
        <iframe
          title="AquaOne GIS Map"
          width="100%"
          height="100%"
          frameBorder="0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=80.1000%2C12.9500%2C80.3600%2C13.2200&amp;layer=mapnik`}
          className="opacity-60 contrast-125 saturate-150"
        ></iframe>

        {/* Layer 1 & Default: Health Score Markers */}
        {activeLayer === "health" && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {streams.map((s) => {
              const topPct = Math.min(85, Math.max(15, 100 - ((s.latitude - 12.95) / (13.22 - 12.95)) * 100));
              const leftPct = Math.min(85, Math.max(15, ((s.longitude - 80.10) / (80.36 - 80.10)) * 100));

              const statusColor = 
                s.status === "Good" ? "bg-emerald-500 text-emerald-950 border-emerald-300" :
                s.status === "Moderate" ? "bg-amber-500 text-amber-950 border-amber-300" :
                s.status === "Poor" ? "bg-orange-500 text-orange-950 border-orange-300" :
                "bg-red-600 text-white border-red-300 animate-bounce";

              const isSelected = selectedStreamId === s.id;

              return (
                <div
                  key={s.id}
                  style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
                  onClick={() => onSelectStream && onSelectStream(s.id)}
                >
                  <div className={`relative flex items-center space-x-1 px-3 py-1 rounded-full border-2 font-black text-xs shadow-xl transition-all duration-300 ${statusColor} ${isSelected ? 'ring-4 ring-cyan-400 scale-110' : 'hover:scale-110'}`}>
                    <MapPin className="w-3.5 h-3.5 fill-current" />
                    <span>{s.health_score}</span>
                  </div>

                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-3.5 rounded-2xl glass-card border border-cyan-500/40 text-xs shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                    <div className="font-bold text-white mb-1 flex items-center justify-between">
                      <span>{s.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">{s.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mb-2">{s.location_name}</div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
                      <div>Water Quality: <span className="text-cyan-300 font-bold">{s.water_quality_index}</span></div>
                      <div>Pollution Index: <span className="text-emerald-300 font-bold">{s.pollution_index}</span></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Layer 2: Pollution Hotspots Layer */}
        {activeLayer === "hotspots" && gisLayers?.hotspots && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {gisLayers.hotspots.slice(0, 15).map((h: any, idx: number) => {
              const topPct = Math.min(85, Math.max(15, 100 - ((h.lat - 12.95) / (13.22 - 12.95)) * 100));
              const leftPct = Math.min(85, Math.max(15, ((h.lng - 80.10) / (80.36 - 80.10)) * 100));

              return (
                <div
                  key={idx}
                  style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-red-500/30 border border-red-500 animate-ping absolute inset-0" />
                  <div className="relative w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px] shadow-lg">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl glass-card border border-red-500/40 text-[11px] shadow-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
                    <div className="font-bold text-red-400 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Critical Hotspot #{idx + 1}
                    </div>
                    <div className="text-[10px] text-slate-300 mt-1">Turbidity: <span className="text-white font-bold">{h.turbidity_ntu} NTU</span></div>
                    <div className="text-[10px] text-slate-300">Waste: <span className="text-white font-bold">{h.waste_level}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Layer 3: Observation Density Layer */}
        {activeLayer === "density" && (
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            {streams.map((s, idx) => {
              const topPct = Math.min(85, Math.max(15, 100 - ((s.latitude - 12.95) / (13.22 - 12.95)) * 100));
              const leftPct = Math.min(85, Math.max(15, ((s.longitude - 80.10) / (80.36 - 80.10)) * 100));
              return (
                <div
                  key={s.id}
                  style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 animate-pulse flex items-center justify-center">
                    <div className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-xs shadow-lg flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{24 + idx * 6} obs</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Layer 4: Predictive Risk Zones */}
        {activeLayer === "risk" && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {streams.map((s) => {
              const topPct = Math.min(85, Math.max(15, 100 - ((s.latitude - 12.95) / (13.22 - 12.95)) * 100));
              const leftPct = Math.min(85, Math.max(15, ((s.longitude - 80.10) / (80.36 - 80.10)) * 100));
              const isHighRisk = s.health_score < 55;

              return (
                <div
                  key={s.id}
                  style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
                >
                  <div className={`p-2 rounded-2xl border flex items-center gap-1.5 text-xs font-bold shadow-xl ${
                    isHighRisk 
                      ? "bg-red-950/90 text-red-300 border-red-500 animate-pulse" 
                      : "bg-emerald-950/90 text-emerald-300 border-emerald-500"
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                    <span>{isHighRisk ? "HIGH RISK ZONE" : "LOW RISK ZONE"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Layer 5: Biodiversity Sightings */}
        {activeLayer === "biodiversity" && gisLayers?.biodiversity_sightings && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {gisLayers.biodiversity_sightings.slice(0, 12).map((b: any, idx: number) => {
              const topPct = Math.min(85, Math.max(15, 100 - ((b.lat - 12.95) / (13.22 - 12.95)) * 100));
              const leftPct = Math.min(85, Math.max(15, ((b.lng - 80.10) / (80.36 - 80.10)) * 100));

              return (
                <div
                  key={idx}
                  style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
                >
                  <div className="px-2.5 py-1 rounded-full bg-purple-600/90 text-white font-bold text-[10px] border border-purple-300 shadow-xl flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{b.species_type} Sighting</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Layer 6: Catchment Flow Network */}
        {activeLayer === "flow" && gisLayers?.flow_network && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm glass-card p-3 rounded-2xl border border-emerald-500/40 text-xs space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Watershed Flow Vectors & Catchment Corridors
            </div>
            {gisLayers.flow_network.map((f: any, idx: number) => (
              <div key={idx} className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-[10px] space-y-0.5">
                <div className="font-bold text-white">{f.name}</div>
                <div className="text-slate-400">Flow: <span className="text-emerald-300 font-semibold">{f.flow_direction}</span></div>
              </div>
            ))}
          </div>
        )}

        {/* Legend Panel */}
        <div className="absolute bottom-4 right-4 z-20 glass-card px-3.5 py-2.5 rounded-2xl text-[11px] text-slate-300 space-y-1.5 border border-slate-700/80 backdrop-blur-md">
          <div className="font-bold text-slate-200">Health Index Scale</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>80-100: Pristine / Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>60-79: Moderate Stress</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>&lt; 50: Critical Hotspot</span>
          </div>
        </div>

      </div>

      {/* Selected Stream Quick Telemetry Bar */}
      {selectedStream && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">Focused Station:</span>{" "}
            <strong className="text-white">{selectedStream.name}</strong>{" "}
            <span className="text-slate-400">({selectedStream.location_name})</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div>Score: <strong className="text-cyan-400">{selectedStream.health_score}/100</strong></div>
            <div>WQ: <strong className="text-emerald-400">{selectedStream.water_quality_index}</strong></div>
            <div>Pollution: <strong className="text-amber-400">{selectedStream.pollution_index}</strong></div>
          </div>
        </div>
      )}

    </div>
  );
}
