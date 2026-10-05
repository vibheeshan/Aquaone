"use client";

import { useEffect, useState } from "react";
import { fetchApi, Stream } from "@/lib/api";
import GISMapComponent from "@/components/GISMapComponent";
import { MapPin, Navigation, Filter, Layers, Activity, Compass, ShieldAlert, Sparkles } from "lucide-react";

export default function GISMapPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<number>(1);
  const [basinFilter, setBasinFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchApi<Stream[]>("/streams")
      .then((data) => {
        setStreams(data);
        if (data.length > 0) setSelectedStreamId(data[0].id);
      })
      .catch(console.error);
  }, []);

  const filteredStreams = streams.filter((s) => {
    if (basinFilter === "ALL") return true;
    return s.name.toLowerCase().includes(basinFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>GIS Spatial Intelligence & Catchment Mapping</span>
          </div>
          <h1 className="text-3xl font-black text-white">Stream Network GIS Map</h1>
          <p className="text-xs text-slate-400">
            Multi-layer spatial monitoring across 5 watershed monitoring stations with live pollution status markers, hotspots, and flow vectors.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Basin Filter */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
            <label className="text-xs font-semibold text-slate-400 pl-1">Basin:</label>
            <select
              value={basinFilter}
              onChange={(e) => setBasinFilter(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Watersheds</option>
              <option value="Cooum" className="bg-slate-900">Cooum River Basin</option>
              <option value="Adyar" className="bg-slate-900">Adyar Estuary</option>
              <option value="Koyambedu" className="bg-slate-900">Koyambedu Channel</option>
              <option value="Buckingham" className="bg-slate-900">Buckingham Canal</option>
              <option value="Velachery" className="bg-slate-900">Velachery Lake</option>
            </select>
          </div>

          {/* Focus Station Filter */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
            <label className="text-xs font-semibold text-slate-400 pl-1">Focus:</label>
            <select
              value={selectedStreamId}
              onChange={(e) => setSelectedStreamId(Number(e.target.value))}
              className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
            >
              {filteredStreams.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900">
                  {s.name} ({s.health_score}/100)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GIS Map Component */}
      <GISMapComponent
        streams={filteredStreams}
        selectedStreamId={selectedStreamId}
        onSelectStream={(id) => setSelectedStreamId(id)}
      />
    </div>
  );
}
