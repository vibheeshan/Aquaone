"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi, Stream } from "@/lib/api";
import { Droplets, MapPin, Activity, TrendingUp, ArrowRight, ShieldCheck, Filter } from "lucide-react";

export default function StreamsDirectoryPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApi<Stream[]>("/streams")
      .then((data) => setStreams(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = streams.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || (s.location_name || s.location || "").toLowerCase().includes(search.toLowerCase()));

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Good":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Moderate":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "Poor":
        return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "Critical":
        return "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Stream Directory</span>
          </div>
          <h1 className="text-3xl font-black text-white">Monitored Stream Watersheds</h1>
          <p className="text-xs text-slate-400">
            Browse monitored waterbodies, real-time health index scores, and water quality telemetry.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search streams or cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Streams */}
      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500">Loading stream watersheds...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((stream) => (
            <div
              key={stream.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-5 hover:border-cyan-500/40 transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${getStatusBadge(stream.status)}`}>
                    {stream.status}
                  </span>
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ID #{stream.id}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition">
                    {stream.name}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{stream.location_name}</span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Health Index</div>
                    <div className="text-2xl font-black text-white">{stream.health_score} <span className="text-xs font-normal text-slate-500">/ 100</span></div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Water Quality</div>
                    <div className="text-2xl font-bold text-cyan-400">{stream.water_quality_index}</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <Link
                href={`/streams/${stream.id}`}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-bold hover:bg-cyan-500/10 hover:border-cyan-500/40 transition flex items-center justify-center gap-1.5"
              >
                <span>View Trend Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
