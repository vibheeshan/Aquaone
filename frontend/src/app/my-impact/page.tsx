"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  HeartPulse, Droplets, ShieldCheck, Flame, Award, Printer, 
  Download, Share2, Sparkles, CheckCircle2, ChevronRight, Scale
} from "lucide-react";

export default function MyImpactPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    fetchApi("/user/impact")
      .then(setData)
      .catch((err) => console.error("Error fetching impact:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/30 text-xs font-semibold mb-2">
            <HeartPulse className="w-4 h-4 text-pink-400" />
            <span>Citizen Environmental Impact & Verification</span>
          </div>
          <h1 className="text-3xl font-black text-white">Personal Impact Dashboard</h1>
          <p className="text-xs text-slate-400">
            Real-world ecological impact resulting from your verified stream observations and community cleanups.
          </p>
        </div>

        <button
          onClick={() => setShowCertModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:opacity-90 transition flex items-center gap-2 self-start md:self-auto"
        >
          <Award className="w-4 h-4" />
          <span>View Verified Certificate</span>
        </button>
      </div>

      {data && (
        <>
          {/* Main Impact Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Water Protected */}
            <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">Clean Water Monitored</span>
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Droplets className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">
                {data.impact_metrics.clean_water_protected_gallons.toLocaleString()} <span className="text-sm font-normal text-slate-400">Gallons</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Telemetry and early pollution alerts protected vital municipal reservoir and estuarine recharge volumes.
              </p>
            </div>

            {/* 2. Plastic Intercepted */}
            <div className="glass-card p-6 rounded-3xl border border-pink-500/30 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900/90 to-pink-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-pink-400 uppercase">Plastic Intercepted</span>
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                  <HeartPulse className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-pink-300">
                {data.impact_metrics.plastic_debris_intercepted_kg} <span className="text-sm font-normal text-slate-400">kg Debris</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Prevented from reaching the Bay of Bengal through citizen trash booms and outfall tagging.
              </p>
            </div>

            {/* 3. Watershed Corridor */}
            <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Watershed Corridor</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-300">
                {data.impact_metrics.watershed_corridor_monitored_km} <span className="text-sm font-normal text-slate-400">km Reach</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Longitudinal baseline mapping spanning Cooum River and Adyar Estuary wetland zones.
              </p>
            </div>

          </div>

          {/* Secondary Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Observation Consistency</span>
              <div className="text-2xl font-black text-amber-300 flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-amber-400 fill-current" />
                <span>{data.impact_metrics.active_streak_days} Days Streak</span>
              </div>
              <div className="text-[10px] text-slate-400">100% Unbroken Quality Log</div>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified Submissions</span>
              <div className="text-2xl font-black text-teal-300">
                {data.impact_metrics.verified_observations_logged} Observations
              </div>
              <div className="text-[10px] text-slate-400">Passed Multi-Agent AI Audit</div>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Community Leadership</span>
              <div className="text-2xl font-black text-purple-300">
                {data.impact_metrics.community_cleanups_led} Cleanups Led
              </div>
              <div className="text-[10px] text-slate-400">With 48 Citizen Volunteers</div>
            </div>
          </div>

          {/* Certificate Preview Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/30">
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Official Digital Credential
              </span>
              <h3 className="text-xl font-bold text-white">{data.certificate.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Cryptographically verifiable environmental stewardship credential recognized by the One Health Global Alliance.
              </p>
              <div className="text-[10px] text-slate-400 font-mono">
                ID: {data.certificate.certificate_id} • Issued: {data.certificate.issue_date}
              </div>
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Open Certificate</span>
            </button>
          </div>

          {/* Certificate Modal */}
          {showCertModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="glass-card max-w-3xl w-full rounded-3xl border-2 border-cyan-500/50 p-8 space-y-6 bg-slate-950 text-white shadow-2xl relative">
                
                {/* Print & Close Buttons */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{data.certificate.certificate_id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certificate</span>
                    </button>
                    <button
                      onClick={() => setShowCertModal(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Certificate Visual Body */}
                <div className="border-4 border-double border-cyan-500/30 p-8 rounded-2xl text-center space-y-5 bg-gradient-to-b from-slate-900/90 to-slate-950">
                  <div className="flex items-center justify-center space-x-2 text-cyan-400">
                    <Award className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">AquaOne Citizen Science Network</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">{data.certificate.title}</h2>
                  </div>

                  <div className="py-2">
                    <span className="text-xs text-slate-400 italic">This is proudly presented to:</span>
                    <div className="text-3xl font-black text-cyan-300 mt-1 font-serif">{data.certificate.recipient_name}</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">Rank: {data.level}</div>
                  </div>

                  <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                    {data.certificate.achievement_text}
                  </p>

                  <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
                    <div>
                      <div className="font-bold text-white">{data.certificate.awarded_by}</div>
                      <div className="text-[10px]">Authorizing Authority</div>
                    </div>

                    <div className="font-mono text-[10px] text-slate-500">
                      <div>Verification Hash: {data.certificate.verification_hash}</div>
                      <div>Issued: {data.certificate.issue_date}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
