"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  Trophy, Flame, CheckCircle2, Award, Clock, ArrowRight, 
  Sparkles, Filter, ShieldCheck, Target, Droplets, Eye, 
  Layers, ChevronRight, AlertTriangle
} from "lucide-react";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchApi<any[]>("/challenges")
      .then(setChallenges)
      .catch((err) => console.error("Error fetching challenges:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "ALL", 
    "Daily Challenge", 
    "Weekly Challenge", 
    "Stream Challenge", 
    "Pollution Challenge", 
    "Monthly Mission", 
    "Education Challenge"
  ];

  const filtered = challenges.filter((c) => {
    if (categoryFilter === "ALL") return true;
    return c.category === categoryFilter;
  });

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span>Citizen Science Missions & Quests</span>
          </div>
          <h1 className="text-3xl font-black text-white">Stream Guardian Challenges</h1>
          <p className="text-xs text-slate-400">
            Complete daily observations, biodiversity surveys, and pollution sentinel missions to earn XP and unlock badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/badges"
            className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>View Badges & Levels</span>
          </Link>
          <Link
            href="/leaderboard"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Reputation Leaderboard</span>
          </Link>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
              categoryFilter === cat
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((c) => {
          const isCompleted = c.status === "completed";
          const progressPct = Math.min(100, Math.round((c.current_progress / c.target_count) * 100));

          return (
            <div 
              key={c.id} 
              className={`glass-card p-6 sm:p-7 rounded-3xl border space-y-5 flex flex-col justify-between transition ${
                isCompleted 
                  ? "border-emerald-500/40 bg-emerald-950/10" 
                  : "border-slate-800 hover:border-cyan-500/40"
              }`}
            >
              <div className="space-y-4">
                
                {/* Top Badge & XP Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
                      {c.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" :
                      c.difficulty === "Medium" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" :
                      "bg-red-500/10 text-red-300 border border-red-500/30"
                    }`}>
                      {c.difficulty}
                    </span>
                  </div>

                  <span className="text-sm font-black text-cyan-400 font-mono">
                    +{c.reward_points} XP
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{c.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-400">Mission Progress</span>
                    <span className={isCompleted ? "text-emerald-400 font-bold" : "text-cyan-400 font-bold"}>
                      {c.current_progress} / {c.target_count} ({progressPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCompleted ? "bg-emerald-400" : "bg-gradient-to-r from-cyan-500 to-teal-400"
                      }`} 
                      style={{ width: `${progressPct}%` }} 
                    />
                  </div>
                </div>

                {/* Reward Badge info */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Reward Badge: <strong className="text-purple-300">{c.reward_badge}</strong></span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {c.participants_count} Citizens Active
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Duration: {c.duration}
                </span>

                <Link
                  href={`/challenges/${c.id}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20"
                  }`}
                >
                  <span>{isCompleted ? "View Completed Mission" : "Start Mission Checklist"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
