"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  Award, ShieldCheck, Flame, ShieldAlert, Droplets, 
  HeartPulse, Eye, CheckCircle2, Lock, Sparkles, Trophy,
  Star, ChevronRight, Layers
} from "lucide-react";

export default function BadgesPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/badges")
      .then(setData)
      .catch((err) => console.error("Error fetching badges:", err))
      .finally(() => setLoading(false));
  }, []);

  const iconMap: Record<string, any> = {
    ShieldCheck,
    Flame,
    ShieldAlert,
    Droplets,
    HeartPulse,
    Eye
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Badges, Milestones & Recognition</span>
          </div>
          <h1 className="text-3xl font-black text-white">Citizen Guardian Badges Matrix</h1>
          <p className="text-xs text-slate-400">
            Earn verifiable digital credentials by maintaining scientific observation quality, unbroken streaks, and community leadership.
          </p>
        </div>

        <Link
          href="/challenges"
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Earn More XP in Challenges</span>
        </Link>
      </div>

      {data && (
        <>
          {/* Level Progression Roadmap */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Citizen Science Career Progression
                </span>
                <h3 className="text-lg font-bold text-white">Guardian XP Level Progression</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">5 Progression Ranks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {data.levels?.map((lvl: any, idx: number) => (
                <div 
                  key={lvl.level} 
                  className={`p-4 rounded-2xl border space-y-2 text-xs transition ${
                    idx <= 3 
                      ? "bg-slate-900/90 border-cyan-500/40 text-white shadow-lg shadow-cyan-950/20" 
                      : "bg-slate-950 border-slate-800 text-slate-400 opacity-70"
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-cyan-400">Rank #{idx + 1}</span>
                    {idx <= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-600" />}
                  </div>
                  <div className="font-extrabold text-sm text-white">{lvl.level}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{lvl.min_points} - {lvl.max_points} XP</div>
                  <p className="text-[10px] text-slate-300 border-t border-slate-800 pt-1.5 leading-relaxed">
                    {lvl.perk}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Earned & Unlockable Recognition Badges ({data.badges?.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.badges?.map((b: any) => {
                const IconComponent = iconMap[b.icon] || Award;
                const isUnlocked = b.unlocked;

                return (
                  <div 
                    key={b.id} 
                    className={`glass-card p-6 rounded-3xl border space-y-4 flex flex-col justify-between transition ${
                      isUnlocked 
                        ? "border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/20 shadow-xl shadow-cyan-950/30" 
                        : "border-slate-800 bg-slate-950/80 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Icon & Tier Row */}
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-2xl border flex items-center justify-center ${
                          isUnlocked 
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/20" 
                            : "bg-slate-900 text-slate-600 border-slate-800"
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            b.tier === "Diamond" ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" :
                            b.tier === "Platinum" ? "bg-purple-500/10 text-purple-300 border-purple-500/30" :
                            b.tier === "Gold" ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
                            "bg-slate-800 text-slate-300 border-slate-700"
                          }`}>
                            {b.tier} Tier
                          </span>

                          <span className="text-xs font-black text-cyan-400 font-mono">
                            +{b.xp_bonus} XP
                          </span>
                        </div>
                      </div>

                      {/* Name & Description */}
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{b.category}</div>
                        <h4 className="text-base font-bold text-white mt-0.5">{b.name}</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{b.description}</p>
                      </div>

                    </div>

                    {/* Footer Status */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      {isUnlocked ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Unlocked on {b.unlocked_at}</span>
                        </div>
                      ) : (
                        <div className="w-full space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Progress</span>
                            <span className="text-cyan-400 font-bold">{b.progress_pct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${b.progress_pct}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
