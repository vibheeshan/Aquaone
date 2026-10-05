"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  Users, Trophy, Flame, Award, ShieldCheck, HeartPulse, 
  MapPin, Calendar, CheckCircle2, ArrowRight, Sparkles, 
  ExternalLink, UserPlus, Flag, MessageSquare, Clock, Shield
} from "lucide-react";

export default function CommunityPage() {
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"feed" | "groups" | "campaigns">("feed");
  const [joinedGroupId, setJoinedGroupId] = useState<number | null>(null);

  useEffect(() => {
    fetchApi("/community/overview")
      .then((data) => setOverview(data))
      .catch((err) => console.error("Error fetching community overview:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleJoinGroup = (groupId: number) => {
    setJoinedGroupId(groupId);
    setTimeout(() => setJoinedGroupId(null), 3500);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Community & Participatory Network</span>
          </div>
          <h1 className="text-3xl font-black text-white">Stream Guardian Community Hub</h1>
          <p className="text-xs text-slate-400">
            Connecting citizen teams, school clubs, university labs, and environmental NGOs in verified watershed stewardship.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/challenges"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition flex items-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Active Challenges</span>
          </Link>
          <Link
            href="/leaderboard"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Reputation Leaderboard</span>
          </Link>
          <Link
            href="/my-impact"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
          >
            <HeartPulse className="w-3.5 h-3.5 text-pink-400" />
            <span>My Impact</span>
          </Link>
        </div>
      </div>

      {overview && (
        <>
          {/* Community Stats Top Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Guardians</div>
              <div className="text-2xl font-black text-white">{overview.stats.total_active_guardians}</div>
              <div className="text-[10px] text-cyan-400">Registered Citizen Observers</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Verified Rate</div>
              <div className="text-2xl font-black text-emerald-400">{overview.stats.verified_rate_pct}%</div>
              <div className="text-[10px] text-slate-400">Scientifically Validated</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Plastic Intercepted</div>
              <div className="text-2xl font-black text-cyan-400">{overview.stats.plastic_debris_intercepted_kg} kg</div>
              <div className="text-[10px] text-slate-400">Via Citizen Trash Booms</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Groups</div>
              <div className="text-2xl font-black text-purple-400">{overview.stats.active_community_groups} Teams</div>
              <div className="text-[10px] text-slate-400">Schools, NGOs & Labs</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg Trust Score</div>
              <div className="text-2xl font-black text-amber-300">{overview.stats.average_trust_score}/100</div>
              <div className="text-[10px] text-slate-400">Zero-Spam Quality Index</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Observations</div>
              <div className="text-2xl font-black text-white">{overview.stats.total_observations}</div>
              <div className="text-[10px] text-slate-400">Logged Telemetry Records</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === "feed" 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Live Community Feed</span>
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === "groups" 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Citizen Groups & Teams ({overview.groups.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === "campaigns" 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" 
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Volunteer Campaigns ({overview.campaigns.length})</span>
            </button>
          </div>

          {/* Tab 1: Live Feed */}
          {activeTab === "feed" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Real-Time Guardian Activity Stream
                </div>
                <div className="space-y-3">
                  {overview.feed.map((item: any) => (
                    <div key={item.id} className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 flex items-start justify-between gap-4 hover:border-cyan-500/40 transition">
                      <div className="flex items-start space-x-3.5">
                        <img 
                          src={item.user_avatar} 
                          alt={item.user_name} 
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-700 shrink-0" 
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-xs">{item.user_name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                              {item.badge}
                            </span>
                            <span className="text-[10px] text-slate-500">• {item.time}</span>
                          </div>
                          <p className="text-xs text-slate-300">{item.action}</p>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs shrink-0">
                        {item.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar: Community Philosophy Card */}
              <div className="space-y-4">
                <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-4">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Quality-First Gamification</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    AquaOne never rewards raw submission quantity. Your reputation and badges are earned through:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-3">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <strong>40% Data Quality</strong> (Accurate measurements)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <strong>25% Consistency Streak</strong> (Daily/weekly logs)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <strong>20% AI & Expert Verification</strong> (Zero spam)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <strong>15% Community Team Impact</strong> (Cleanups)
                    </li>
                  </ul>
                  <Link
                    href="/leaderboard"
                    className="block text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold text-xs transition"
                  >
                    View Global Reputation Formula →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Community Groups */}
          {activeTab === "groups" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overview.groups.map((grp: any) => (
                <div key={grp.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img src={grp.avatar} alt={grp.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
                            {grp.type}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">{grp.name}</h3>
                          <div className="text-[10px] text-slate-400">Team Lead: {grp.lead}</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-cyan-400">{grp.points} XP</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{grp.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400 space-x-3">
                      <span><strong>{grp.members_count}</strong> Members</span>
                      <span>•</span>
                      <span><strong>{grp.observations_count}</strong> Observations</span>
                    </div>

                    <button
                      onClick={() => handleJoinGroup(grp.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-white border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      {joinedGroupId === grp.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Joined Team!</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Join Group</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Volunteer Campaigns */}
          {activeTab === "campaigns" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overview.campaigns.map((camp: any) => (
                <div key={camp.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/40 transition">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Upcoming Volunteer Action
                      </span>
                      <h3 className="text-base font-bold text-white pt-1">{camp.title}</h3>
                    </div>
                    <span className="text-sm font-black text-emerald-400">+{camp.points_reward} XP</span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{camp.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{camp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>Reward Badge: <strong>{camp.badge_reward}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      <strong>{camp.volunteers_signed_up} / {camp.target_volunteers}</strong> Volunteers Enrolled
                    </span>

                    <button
                      onClick={() => alert(`Enrolled in ${camp.title}! You will receive a calendar notification.`)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-90 transition"
                    >
                      Sign Up as Volunteer
                    </button>
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
