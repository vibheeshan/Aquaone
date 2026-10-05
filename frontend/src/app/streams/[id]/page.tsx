"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi, Stream } from "@/lib/api";
import { Droplets, TrendingUp, MapPin, ArrowLeft, ShieldAlert, Sparkles, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

export default function StreamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const streamId = Number(resolvedParams.id);
  const [stream, setStream] = useState<Stream | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<Stream>(`/streams/${streamId}`)
      .then((s) => setStream(s))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    fetchApi(`/trends/${streamId}`)
      .then((res) => setTrendData(res.trends || []))
      .catch((err) => console.error(err));
  }, [streamId]);

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading stream telemetry...</div>;
  }

  if (!stream) {
    return <div className="py-20 text-center text-xs text-red-400">Stream watershed not found.</div>;
  }

  return (
    <div className="space-y-8 py-6">
      <Link href="/streams" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-semibold hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Streams Directory
      </Link>

      {/* Stream Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Watershed Analysis</div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              {stream.name}
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                {stream.status}
              </span>
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{stream.location_name} (Coordinates: {stream.latitude}, {stream.longitude})</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400 uppercase">HEALTH INDEX</div>
              <div className="text-4xl font-black text-white">{stream.health_score} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
            </div>
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* 4 Core Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Water Quality</div>
            <div className="text-2xl font-bold text-cyan-400">{stream.water_quality_index}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Pollution Index</div>
            <div className="text-2xl font-bold text-emerald-400">{stream.pollution_index}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Biodiversity</div>
            <div className="text-2xl font-bold text-purple-400">{stream.biodiversity_index}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Ecosystem Index</div>
            <div className="text-2xl font-bold text-amber-400">{stream.ecosystem_index}</div>
          </div>
        </div>
      </div>

      {/* Trend Line Charts */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Water Turbidity (NTU) & Rainfall Correlation Trend
            </h3>
            <p className="text-xs text-slate-400">Calculated over historical observation timestamps</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="turbidity_ntu" stroke="#06b6d4" fill="#06b6d422" strokeWidth={2.5} name="Turbidity (NTU)" />
                <Line type="monotone" dataKey="rainfall_mm" stroke="#3b82f6" strokeWidth={2} name="Rainfall (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No trend telemetry recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* AI Automated Insight Card */}
      <div className="p-6 rounded-3xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
        <div className="font-bold text-cyan-300 text-sm flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AquaAI What Changed & Why Synthesis
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          "What changed: Turbidity experienced a temporary surge (+8 NTU) following recent heavy rainfall. Why it matters: Heavy runoff mobilizes sediment and surface debris into {stream.name}. What to investigate: Downstream culverts and storm drains for visible waste accumulation."
        </p>
      </div>
    </div>
  );
}
