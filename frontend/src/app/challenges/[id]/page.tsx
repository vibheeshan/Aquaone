"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  Trophy, ArrowLeft, CheckCircle2, Award, Clock, Users, 
  ShieldCheck, Sparkles, Droplets, Target, ChevronRight,
  Flame, FileCheck, Share2
} from "lucide-react";

export default function SingleChallengePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id || "1";

  const [challenge, setChallenge] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchApi(`/challenges/${id}`)
      .then((data) => {
        setChallenge(data);
        if (data.status === "completed") {
          setEnrolled(true);
        }
      })
      .catch((err) => console.error("Error fetching challenge:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleEnroll = async () => {
    try {
      await fetchApi(`/challenges/${id}/join`, { method: "POST" });
      setEnrolled(true);
    } catch {
      setEnrolled(true);
    }
  };

  if (loading || !challenge) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        Loading Challenge Mission Brief...
      </div>
    );
  }

  const isCompleted = challenge.status === "completed";
  const progressPct = Math.min(100, Math.round((challenge.current_progress / challenge.target_count) * 100));

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      
      {/* Back Link */}
      <Link 
        href="/challenges"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Challenges</span>
      </Link>

      {/* Main Challenge Hero Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
                {challenge.category}
              </span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                challenge.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" :
                challenge.difficulty === "Medium" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" :
                "bg-red-500/10 text-red-300 border border-red-500/30"
              }`}>
                {challenge.difficulty} Difficulty
              </span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Duration: {challenge.duration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{challenge.title}</h1>
            <p className="text-xs text-slate-300 leading-relaxed">{challenge.description}</p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-cyan-500/30 text-right shrink-0">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Reward XP</div>
            <div className="text-3xl font-black text-cyan-400">+{challenge.reward_points} XP</div>
            <div className="text-[10px] text-purple-300 font-semibold mt-1">Badge: {challenge.reward_badge}</div>
          </div>
        </div>

        {/* Progress & Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Current Progress</span>
            <div className="text-xl font-bold text-white">
              {challenge.current_progress} / {challenge.target_count} ({progressPct}%)
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Active Participants</span>
            <div className="text-xl font-bold text-cyan-300">{challenge.participants_count} Guardians</div>
            <div className="text-[10px] text-slate-500">Across 5 Basins</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Scientific Validation</span>
            <div className="text-xl font-bold text-emerald-400">AI Verified</div>
            <div className="text-[10px] text-slate-500">Quality Score &gt; 80% required</div>
          </div>
        </div>

      </div>

      {/* Mission Checklist */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-400" />
            <span>Mission Steps & Verification Checklist</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Follow the protocol below. Observations must pass AquaAI quality checks to count toward this quest.
          </p>
        </div>

        <div className="space-y-3">
          {challenge.checklist?.map((item: string, idx: number) => {
            const isChecked = checkedItems[idx] || isCompleted;
            return (
              <div
                key={idx}
                onClick={() => handleToggleCheck(idx)}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition ${
                  isChecked 
                    ? "bg-cyan-500/10 border-cyan-500/40 text-white" 
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                    isChecked ? "bg-cyan-500 border-cyan-400 text-white" : "border-slate-600 bg-slate-800"
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold">{item}</span>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">Step #{idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {enrolled ? "You are active in this mission!" : "Enroll now to link observations automatically."}
          </div>

          <div className="flex items-center gap-3">
            {!enrolled && (
              <button
                onClick={handleEnroll}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
              >
                Enroll in Challenge
              </button>
            )}

            <Link
              href="/assess"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition flex items-center gap-2"
            >
              <Droplets className="w-4 h-4" />
              <span>Log Mission Observation</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
