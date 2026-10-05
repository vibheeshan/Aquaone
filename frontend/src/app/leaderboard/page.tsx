"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  Trophy, Award, Flame, ShieldCheck, Star, Users, 
  MapPin, Scale, Info, CheckCircle2, Shield, ArrowUpRight
} from "lucide-react";

export default function LeaderboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"global" | "regional" | "teams">("global");

  useEffect(() => {
    fetchApi("/leaderboard")
      .then((res) => setData(res))
      .catch((err) => console.error("Error fetching leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Quality-Weighted Reputation Rankings</span>
          </div>
          <h1 className="text-3xl font-black text-white">Stream Guardian Leaderboard</h1>
          <p className="text-xs text-slate-400">
            Transparent scientific ranking based on data quality, consistency streaks, verification rates, and community impact.
          </p>
        </div>

        {/* Quality Rule Banner Pill */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center space-x-3 text-xs">
          <Scale className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <div className="font-bold text-white">Zero-Spam Quality Formula</div>
            <div className="text-[10px] text-slate-400">Never rewards raw volume alone</div>
          </div>
        </div>
      </div>

      {/* Transparent Formula Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-2 text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            AquaOne Contributor Reputation Formula:
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Reputation = (0.40 × Quality) + (0.25 × Streak) + (0.20 × Verification) + (0.15 × XP/10)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          High scores require scientific precision, consistent daily/weekly participation, and zero spam flags. Verified observations by expert hydrologists carry double reputation weighting.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === "global" 
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Individual Guardians</span>
        </button>

        <button
          onClick={() => setActiveTab("regional")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === "regional" 
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Regional Watershed Basins</span>
        </button>

        <button
          onClick={() => setActiveTab("teams")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
            activeTab === "teams" 
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Community Teams & NGOs</span>
        </button>
      </div>

      {data && (
        <>
          {/* Tab 1: Global Individual Leaderboard */}
          {activeTab === "global" && (
            <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300">
                      <th className="p-4 font-bold">Rank & Guardian</th>
                      <th className="p-4 font-bold text-center">Reputation Score</th>
                      <th className="p-4 font-bold text-center">Data Quality (40%)</th>
                      <th className="p-4 font-bold text-center">Streak (25%)</th>
                      <th className="p-4 font-bold text-center">Verified Rate (20%)</th>
                      <th className="p-4 font-bold text-center">Trust Score</th>
                      <th className="p-4 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.leaderboard?.map((u: any, idx: number) => {
                      const isTop3 = idx < 3;
                      const medalColor = 
                        idx === 0 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                        idx === 1 ? "bg-slate-300/20 text-slate-200 border-slate-400" :
                        idx === 2 ? "bg-amber-700/20 text-amber-600 border-amber-700/40" :
                        "bg-slate-800 text-slate-400";

                      return (
                        <tr key={u.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-4 font-bold text-white whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${medalColor}`}>
                                #{u.rank}
                              </span>
                              <img 
                                src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                                alt={u.name} 
                                className="w-9 h-9 rounded-xl object-cover border border-slate-700" 
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.role === "expert" && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                      Expert
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-normal">
                                  {u.level} • {u.badge_count} Badges
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-center font-black text-cyan-300 text-sm">
                            {u.reputation_score}
                          </td>

                          <td className="p-4 text-center font-semibold text-emerald-400">
                            {u.quality_score}%
                          </td>

                          <td className="p-4 text-center font-semibold text-amber-300">
                            <div className="flex items-center justify-center gap-1">
                              <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                              <span>{u.streak_days} Days</span>
                            </div>
                          </td>

                          <td className="p-4 text-center text-slate-300">
                            {u.verification_rate_pct}% ({u.verified_count}/{u.observations_count})
                          </td>

                          <td className="p-4 text-center">
                            <span className="px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
                              {u.trust_score}/100
                            </span>
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                              {u.anti_spam_status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Regional Leaderboard */}
          {activeTab === "regional" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.regional_leaderboard?.map((reg: any, idx: number) => (
                <div key={idx} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 font-mono">
                        Regional Rank #{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{reg.region}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-cyan-300">{reg.avg_quality_score}%</div>
                      <div className="text-[10px] text-slate-400">Avg Quality Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-slate-400">Active Observers</span>
                      <div className="font-bold text-white">{reg.active_guardians} Guardians</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Verified Observations</span>
                      <div className="font-bold text-emerald-400">{reg.verified_obs} Records</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 pt-1 flex items-center justify-between">
                    <span>Top Local Guardian: <strong className="text-cyan-300">{reg.top_guardian}</strong></span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Zero-Spam Zone
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Team Leaderboard */}
          {activeTab === "teams" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.team_leaderboard?.map((tm: any) => (
                <div key={tm.team_name} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {tm.badge}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5">{tm.team_name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-purple-400 font-mono">#{tm.rank}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <span><strong>{tm.members}</strong> Active Members</span>
                      <span>Total Reputation: <strong className="text-cyan-300">{tm.total_reputation} XP</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Status: Active Cleanups</span>
                    <Link
                      href="/community"
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <span>View Team Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
