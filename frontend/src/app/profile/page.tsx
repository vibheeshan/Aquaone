"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  User2, ShieldCheck, Flame, Award, HeartPulse, Droplets,
  Clock, CheckCircle2, Star, ShieldAlert, Sparkles, FileText,
  TrendingUp, Settings, ExternalLink, ChevronRight, Mail, Calendar
} from "lucide-react";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try API first, fall back to auth context user
    fetchApi("/user/profile")
      .then(setProfile)
      .catch(() => {
        if (authUser) setProfile(authUser);
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  // Use auth context user as source of truth if API fails
  const displayUser = profile || authUser;

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
          <User2 className="w-4 h-4 text-cyan-400" />
          <span>Citizen Identity & Quality Trust Score</span>
        </div>
        <h1 className="text-3xl font-black text-white">Citizen Guardian Profile</h1>
        <p className="text-xs text-slate-400">
          Your verifiable contributor credentials, scientific accuracy rating, anti-spam status, and longitudinal observation logs.
        </p>
      </div>

      {displayUser && (
        <>
          {/* Main Profile Identity Banner */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div className="flex items-center space-x-5">
                {displayUser.avatar ? (
                  <img
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    className="w-20 h-20 rounded-3xl object-cover border-2 border-cyan-500/60 shadow-xl shadow-cyan-950/40"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-3xl border-2 border-cyan-500/60 shadow-xl">
                    {(displayUser.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-black text-white">{displayUser.name}</h2>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Observer
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold capitalize">
                      {displayUser.role || "citizen"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {displayUser.email}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    Rank: <strong className="text-cyan-300">{displayUser.level}</strong>
                    {displayUser.created_at && (
                      <span className="text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined {new Date(displayUser.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* XP & Level Pill */}
              <div className="flex items-center space-x-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 self-start sm:self-auto">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">TOTAL XP</div>
                  <div className="text-3xl font-black text-cyan-300">{displayUser.points || 0}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">{displayUser.badge_count || 0} Badges Earned</div>
                </div>
                <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
                  <Award className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Contribution Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Total XP</div>
                <div className="text-2xl font-black text-emerald-400">{displayUser.points || 0}</div>
                <div className="text-[10px] text-slate-500">Contribution Points</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Level</div>
                <div className="text-lg font-black text-amber-300 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="truncate">{displayUser.level || "Explorer"}</span>
                </div>
                <div className="text-[10px] text-slate-500">Current Rank</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/30 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Badges</div>
                <div className="text-2xl font-black text-teal-300">{displayUser.badge_count || 0}</div>
                <div className="text-[10px] text-slate-500">Earned Badges</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Role</div>
                <div className="text-base font-bold text-cyan-300 capitalize">{displayUser.role || "citizen"}</div>
                <div className="text-[10px] text-slate-500">Platform Role</div>
              </div>
            </div>

          </div>

          {/* Longitudinal Contribution History */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Recent Validated Observation Logs</span>
              </h3>
              <Link
                href="/assess"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>New Observation</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {(displayUser as any).recent_observations?.map((obs: any) => (
                <div key={obs.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-cyan-500/40 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span>Stream Observation #{obs.id}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {obs.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Clarity: <strong className="text-slate-200">{obs.water_clarity}</strong> • Turbidity: <strong className="text-cyan-300">{obs.turbidity_ntu || "12.0"} NTU</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {obs.created_at}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shortcuts to Impact & Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/my-impact"
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-pink-500/40 transition flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Personal Impact Dashboard</h4>
                  <p className="text-xs text-slate-400">View protected gallons & download your Certificate of Stewardship.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </Link>

            <Link
              href="/badges"
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Badges & Milestones</h4>
                  <p className="text-xs text-slate-400">Review earned credentials and unlock higher XP ranks.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </Link>
          </div>
        </>
      )}

    </div>
  );
}
