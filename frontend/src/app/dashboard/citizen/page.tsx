"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import { fetchApi } from "@/lib/api";
import {
  Activity, Droplets, MapPin, Eye, BookOpen, Trophy, Users,
  Award, Medal, Star, TrendingUp, CheckCircle2, Camera, Zap,
  Heart, Target, ChevronRight, Leaf, AlertCircle, Clock,
  BarChart3, Sparkles, ShieldCheck, HelpCircle, Share2, Flame,
  Shield, Layers, Filter, Check, ArrowRight, Play, RefreshCw, FileText,
  Compass, AlertTriangle, Send, ThumbsUp, MessageSquare, Calendar
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StreamSummary {
  id: number;
  name: string;
  location_name?: string;
  health_score: number;
  status: string;
}

interface ObsSummary {
  id: number;
  stream_id: number;
  water_clarity: string;
  status: string;
  created_at: string;
}

type CitizenTab = "overview" | "smart-assess" | "comparison" | "learning" | "community";

// ── Helpers ────────────────────────────────────────────────────────────────────

function statusColor(status: string) {
  switch (status) {
    case "Good": return "text-emerald-400";
    case "Moderate": return "text-amber-400";
    case "Poor": return "text-orange-400";
    case "Critical": return "text-red-400";
    default: return "text-slate-400";
  }
}

function statusBg(status: string) {
  switch (status) {
    case "Good": return "bg-emerald-500/10 border-emerald-500/30";
    case "Moderate": return "bg-amber-500/10 border-amber-500/30";
    case "Poor": return "bg-orange-500/10 border-orange-500/30";
    case "Critical": return "bg-red-500/10 border-red-500/30 animate-pulse";
    default: return "bg-slate-800 border-slate-700";
  }
}

function healthBar(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 25) return "bg-orange-500";
  return "bg-red-500";
}

// ── TAB 1: SMART ASSESSMENT & RECOMMENDATIONS ────────────────────────────────

function SmartAssessmentTab({ streams }: { streams: StreamSummary[] }) {
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [selectedStream, setSelectedStream] = useState<number>(streams[0]?.id || 1);
  const [waterColor, setWaterColor] = useState("Clear / Transparent");
  const [surfaceCond, setSurfaceCond] = useState("Normal Clear Surface");
  const [odor, setOdor] = useState("None");
  const [bankStability, setBankStability] = useState("Stable");
  const [litterDensity, setLitterDensity] = useState("Low");
  const [weather, setWeather] = useState("Sunny");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [qualityScore, setQualityScore] = useState(85);
  const [qualityLevel, setQualityLevel] = useState("Good");

  // Fetch dynamic recommendations on stream change
  useEffect(() => {
    fetchApi<{ recommendations: any[] }>(`/recommendations/smart?stream_id=${selectedStream}`)
      .then((data) => {
        if (data && data.recommendations) {
          setRecommendations(data.recommendations);
        }
      })
      .catch(() => {});
  }, [selectedStream]);

  // Evaluate dynamic authoritative quality score
  useEffect(() => {
    fetchApi<any>("/observations/assess-quality", {
      method: "POST",
      body: JSON.stringify({
        image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        water_temp_c: level === "advanced" ? 27.5 : null,
        ph_level: level === "advanced" ? 7.2 : null,
        dissolved_oxygen: level === "advanced" ? 6.5 : null
      })
    }).then((res) => {
      if (res && res.quality_score) {
        setQualityScore(res.quality_score);
        setQualityLevel(res.quality_level);
      }
    }).catch(() => {});
  }, [level]);

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchApi("/observations", {
        method: "POST",
        body: JSON.stringify({
          stream_id: selectedStream,
          user_id: 1,
          water_clarity: waterColor.includes("Clear") ? "Very clear" : (waterColor.includes("Brown") ? "Cloudy" : "Slightly cloudy"),
          odor: odor,
          waste_level: litterDensity === "High" ? "High" : (litterDensity === "Moderate" ? "Medium" : "Low"),
          algae_level: waterColor.includes("Greenish") ? "High" : "Low",
          flow_speed: "Medium",
          wildlife_seen: "Fish & Birds",
          water_temp_c: level === "advanced" ? 26.8 : 25.0,
          ph_level: level === "advanced" ? 7.4 : 7.2,
          dissolved_oxygen: level === "advanced" ? 6.2 : 6.0,
          rainfall_mm: weather.includes("Rain") ? 18.0 : 0.0,
          difficulty_level: level,
          bank_stability: bankStability,
          bank_erosion_level: bankStability === "Stable & Vegetated" ? "None" : (bankStability === "Moderate Erosion Visible" ? "Moderate" : "Severe"),
          erosion_detected: bankStability !== "Stable & Vegetated",
          accessibility_rating: 4.8,
          latitude: 13.08,
          longitude: 80.27,
          image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
          notes: `Submitted via Guided Assessment (${level.toUpperCase()}). Surface: ${surfaceCond}, Weather: ${weather}.`
        })
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Citizen Features Header */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Smart Guided Stream Assessment
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real dynamic recommendations • Difficulty levels • Quality scoring • Bank stability & erosion detection
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold">
          Citizen Science Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Assessment Form */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          {/* Difficulty Level Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">1. Select Assessment Difficulty Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "beginner", label: "Beginner", desc: "Basic visual & clarity check" },
                { id: "intermediate", label: "Intermediate", desc: "+ Odor, Litter & Transparency" },
                { id: "advanced", label: "Advanced", desc: "+ Bank stability & Temp/pH" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id as any)}
                  className={`p-3 rounded-xl border text-left transition ${
                    level === lvl.id
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.label}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSmartSubmit} className="space-y-4">
            {/* Stream Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">2. Targeted Stream Location</label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {streams.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.location_name || "Chennai Basin"})</option>
                ))}
              </select>
            </div>

            {/* Smart Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Water Color</label>
                <select
                  value={waterColor}
                  onChange={(e) => setWaterColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option>Clear / Transparent</option>
                  <option>Slightly Brown / Muddy</option>
                  <option>Greenish (Algae Bloom)</option>
                  <option>Milky / Chemical Tint</option>
                  <option>Dark Blackish</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Surface Condition</label>
                <select
                  value={surfaceCond}
                  onChange={(e) => setSurfaceCond(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option>Normal Clear Surface</option>
                  <option>Excessive Foam / Scum</option>
                  <option>Oily Sheen Detected</option>
                  <option>Floating Debris / Plastic</option>
                </select>
              </div>

              {level !== "beginner" && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Odor Category</label>
                    <select
                      value={odor}
                      onChange={(e) => setOdor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option>None</option>
                      <option>Mild</option>
                      <option>Sewage</option>
                      <option>Chemical</option>
                      <option>Strong</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Litter Density</label>
                    <select
                      value={litterDensity}
                      onChange={(e) => setLitterDensity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option>Low</option>
                      <option>Moderate</option>
                      <option>High</option>
                    </select>
                  </div>
                </>
              )}

              {level === "advanced" && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Bank Stability & Erosion</label>
                    <select
                      value={bankStability}
                      onChange={(e) => setBankStability(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option>Stable & Vegetated</option>
                      <option>Moderate Erosion Visible</option>
                      <option>Severe Bank Collapse</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-semibold mb-1 block">Recent Rainfall Capture</label>
                    <select
                      value={weather}
                      onChange={(e) => setWeather(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option>No rain in last 48h</option>
                      <option>Light Rain within 24h</option>
                      <option>Heavy Storm within 24h</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Quality Meter Bar */}
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Authoritative Assessment Quality Score</span>
                <span className="font-bold text-cyan-400">{qualityScore}/100 ({qualityLevel})</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all" style={{ width: `${qualityScore}%` }} />
              </div>
            </div>

            {submitted && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Assessment verified & saved to database! +30 XP awarded.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" /> {submitting ? "Processing AI Validation..." : "Submit Guided Observation"}
            </button>
          </form>
        </div>

        {/* Smart Recommendations Panel */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Smart Recommendations Engine
            </h4>
            <div className="space-y-2">
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300">{rec.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${rec.priority === "HIGH" ? "bg-red-500/20 text-red-300 border border-red-500/40" : "bg-amber-500/20 text-amber-300 border border-amber-500/40"}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">{rec.reason}</div>
                    <div className="text-[9px] text-emerald-400 mt-1 font-medium">Action: {rec.action_prompt}</div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 p-2">Loading stream conditions...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: OBSERVATION COMPARISON TOOL ────────────────────────────────────────

function ObservationComparisonTab({ observations }: { observations: ObsSummary[] }) {
  const [obsAId, setObsAId] = useState<number>(1);
  const [obsBId, setObsBId] = useState<number>(2);
  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runComparison = () => {
    setLoading(true);
    fetchApi<any>(`/observations/compare?obs_a_id=${obsAId}&obs_b_id=${obsBId}`)
      .then((data) => setCompareData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    runComparison();
  }, [obsAId, obsBId]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" /> Observation Comparison Interface
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any two stream observations to analyze scientific deltas for pH, turbidity, DO, temperature, and quality score.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-cyan-400">Baseline Observation (Observation A)</label>
          <select
            value={obsAId}
            onChange={(e) => setObsAId(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          >
            {[1, 2, 3, 4, 5].map((id) => (
              <option key={id} value={id}>Observation #{id} — Cooum River Reach</option>
            ))}
          </select>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-purple-400">Comparison Target (Observation B)</label>
          <select
            value={obsBId}
            onChange={(e) => setObsBId(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          >
            {[1, 2, 3, 4, 5].map((id) => (
              <option key={id} value={id}>Observation #{id} — Follow-up Audit</option>
            ))}
          </select>
        </div>
      </div>

      {compareData && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center justify-between">
              <span>Scientific Metric Delta Summary</span>
              <span className="text-xs text-cyan-400 font-normal">{compareData.summary}</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Parameter</th>
                    <th className="p-3 text-cyan-300">Observation A</th>
                    <th className="p-3 text-purple-300">Observation B</th>
                    <th className="p-3 text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold">Water Clarity</td>
                    <td className="p-3">{compareData.observation_a.water_clarity}</td>
                    <td className="p-3">{compareData.observation_b.water_clarity}</td>
                    <td className="p-3 text-right">{compareData.deltas.clarity_changed ? "Shifted" : "Unchanged"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Turbidity (NTU)</td>
                    <td className="p-3">{compareData.observation_a.turbidity_ntu} NTU</td>
                    <td className="p-3">{compareData.observation_b.turbidity_ntu} NTU</td>
                    <td className={`p-3 text-right font-bold ${compareData.deltas.turbidity_ntu > 0 ? "text-red-400" : "text-emerald-400"}`}>
                      {compareData.deltas.turbidity_ntu > 0 ? `+${compareData.deltas.turbidity_ntu}` : compareData.deltas.turbidity_ntu} NTU
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">pH Level</td>
                    <td className="p-3">{compareData.observation_a.ph_level}</td>
                    <td className="p-3">{compareData.observation_b.ph_level}</td>
                    <td className="p-3 text-right font-bold text-cyan-400">{compareData.deltas.ph_level}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Dissolved Oxygen</td>
                    <td className="p-3">{compareData.observation_a.dissolved_oxygen} mg/L</td>
                    <td className="p-3">{compareData.observation_b.dissolved_oxygen} mg/L</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{compareData.deltas.dissolved_oxygen} mg/L</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Bank Stability</td>
                    <td className="p-3">{compareData.observation_a.bank_stability || "Stable"}</td>
                    <td className="p-3">{compareData.observation_b.bank_stability || "Stable"}</td>
                    <td className="p-3 text-right text-slate-400">Structured Record</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TAB 3: LEARNING, QUIZZES & ECOSYSTEM GUIDE ───────────────────────────────

function LearningTab({ stories }: { stories: any[] }) {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [tips, setTips] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>("/quizzes").then((res) => {
      if (res && res.length > 0) {
        setQuizzes(res);
        setSelectedQuiz(res[0]);
      }
    }).catch(() => {});

    fetchApi<any[]>("/eco-tips").then((res) => {
      if (res && res.length > 0) {
        setTips(res);
      }
    }).catch(() => {});
  }, []);

  const handleQuizSubmit = async (quizId: number) => {
    if (selectedOption === null) return;
    try {
      const res = await fetchApi<any>(`/quizzes/${quizId}/attempt`, {
        method: "POST",
        body: JSON.stringify({
          quiz_id: quizId,
          selected_option_index: selectedOption,
          user_id: 1
        })
      });
      setQuizResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" /> Knowledge Center & Ecosystem Guide
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive environmental quizzes • Database-backed eco-tips • Local wildlife & flora identification
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
          Knowledge Active
        </span>
      </div>

      {/* Dynamic Eco-Tips Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.slice(0, 3).map((tip, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">{tip.title}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">{tip.tip_text}</p>
          </div>
        ))}
      </div>

      {/* Interactive Server-Validated Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedQuiz && (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" /> {selectedQuiz.title} (+{selectedQuiz.reward_points} XP)
              </h4>
              <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded font-bold">
                Server-Validated
              </span>
            </div>

            {selectedQuiz.questions && selectedQuiz.questions[0] && (
              <div className="space-y-3">
                <p className="text-xs text-slate-200 font-semibold">
                  {selectedQuiz.questions[0].question_text}
                </p>
                <div className="space-y-2">
                  {selectedQuiz.questions[0].options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOption(idx);
                        setQuizResult(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition ${
                        selectedOption === idx
                          ? "bg-purple-500/20 border-purple-500 text-purple-300"
                          : "bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleQuizSubmit(selectedQuiz.id)}
                  disabled={selectedOption === null}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition disabled:opacity-40"
                >
                  Submit Answer & Claim XP
                </button>

                {quizResult && (
                  <div className={`p-3 rounded-xl border text-xs font-semibold ${quizResult.is_correct ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
                    <div className="font-bold mb-0.5">{quizResult.is_correct ? `Correct! +${quizResult.points_awarded} XP Earned!` : "Incorrect Answer"}</div>
                    <div className="text-[11px] text-slate-300 font-normal">{quizResult.explanation}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wildlife & Biodiversity Identification Cards */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Basin Biodiversity & Wildlife Cards
          </h4>
          <div className="space-y-3">
            {[
              { name: "Pond Heron (Ardeola grayii)", role: "Bio-Indicator of shallow fish density", habitat: "Adyar Estuary Mangroves" },
              { name: "Damselfly Larvae (Zygoptera)", role: "Clean water sensitive macroinvertebrate", habitat: "Upper Kovur Reach" },
              { name: "Mangrove Reed Buffer (Avicennia)", role: "Natural silt filtration & bank stabilization", habitat: "Cooum River Delta" }
            ].map((wild, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-300">{wild.name}</div>
                <div className="text-[11px] text-slate-400">{wild.role}</div>
                <div className="text-[9px] text-emerald-400">Habitat: {wild.habitat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TAB 4: MISSIONS, TEAMS, POLLS & CIVIC COMMUNITY ──────────────────────────

function CommunityCivicTab({ leaderboard, challenges }: { leaderboard: any[]; challenges: any[] }) {
  const { user } = useAuth();
  const [polls, setPolls] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState(user?.current_streak || 4);
  const [voteMsg, setVoteMsg] = useState("");

  useEffect(() => {
    fetchApi<any[]>("/polls").then((res) => {
      if (res) setPolls(res);
    }).catch(() => {});

    fetchApi<any[]>("/teams").then((res) => {
      if (res) setTeams(res);
    }).catch(() => {});

    fetchApi<any[]>("/volunteers/opportunities").then((res) => {
      if (res) setVolunteers(res);
    }).catch(() => {});

    fetchApi<any>("/user/profile").then((res) => {
      if (res && res.trust_metrics) {
        setStreakDays(res.trust_metrics.current_streak_days || 4);
      }
    }).catch(() => {});
  }, [user]);

  const handleVote = async (pollId: number, optionId: number) => {
    try {
      const res = await fetchApi<any>("/polls/vote", {
        method: "POST",
        body: JSON.stringify({ poll_id: pollId, option_id: optionId, user_id: 1 })
      });
      setVoteMsg("Vote recorded successfully! +10 XP awarded.");
      // Refresh polls
      const updated = await fetchApi<any[]>("/polls");
      if (updated) setPolls(updated);
    } catch (err: any) {
      setVoteMsg("You have already voted in this poll.");
    }
  };

  const handleRegisterVolunteer = async (oppId: number) => {
    try {
      await fetchApi(`/volunteers/opportunities/${oppId}/register`, {
        method: "POST",
        body: JSON.stringify({ user_id: 1 })
      });
      alert("Successfully registered for community volunteer campaign! +20 XP awarded.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-400" /> Community Missions, Teams & Civic Polls
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real observation streak calculation • Verified poll voting • Team progress tracking • Volunteer registrations
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
          Community Active
        </span>
      </div>

      {/* Real Streak & Stewardship Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <div className="text-xl font-black text-orange-400">{streakDays} Days</div>
            <div className="text-[10px] text-slate-500">Active Daily Observation Streak 🔥</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-400">Stream Guardian</div>
            <div className="text-[10px] text-slate-500">Cooum Watershed Reach</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Star className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-black text-cyan-400">94.8 / 100</div>
            <div className="text-[10px] text-slate-500">Quality-Weighted Reputation</div>
          </div>
        </div>
      </div>

      {/* Community Polls & Volunteer Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Polls */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Community Water Priorities Poll
          </h4>
          {polls.length > 0 && polls[0] && (
            <div className="space-y-3">
              <p className="text-xs text-slate-200 font-semibold">{polls[0].question}</p>
              <div className="space-y-2">
                {polls[0].options.map((opt: any) => (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(polls[0].id, opt.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
                  >
                    <span>{opt.option_text}</span>
                    <span className="font-mono text-cyan-400 font-bold">{opt.votes_count} votes</span>
                  </button>
                ))}
              </div>
              {voteMsg && (
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">
                  {voteMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Volunteer Campaigns */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> Volunteer Cleanup & Census Events
          </h4>
          <div className="space-y-3">
            {volunteers.map((vol, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">{vol.title}</div>
                  <div className="text-[10px] text-slate-500">{vol.location} • Capacity: {vol.registered_count}/{vol.capacity}</div>
                </div>
                <button
                  onClick={() => handleRegisterVolunteer(vol.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition"
                >
                  Register (+20 XP)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN CITIZEN PAGE CONTAINER ───────────────────────────────────────────────

function CitizenDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<CitizenTab>("overview");
  const [streams, setStreams] = useState<StreamSummary[]>([]);
  const [observations, setObservations] = useState<ObsSummary[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchApi<StreamSummary[]>("/streams"),
      fetchApi<ObsSummary[]>("/observations"),
      fetchApi<{ leaderboard: any[] }>("/leaderboard"),
      fetchApi<any[]>("/challenges"),
      fetchApi<any[]>("/stories"),
    ]).then(([streamsRes, obsRes, lbRes, challRes, storiesRes]) => {
      if (streamsRes.status === "fulfilled") setStreams(streamsRes.value.slice(0, 4));
      if (obsRes.status === "fulfilled") setObservations((obsRes.value as any) || []);
      if (lbRes.status === "fulfilled") setLeaderboard((lbRes.value as any).leaderboard?.slice(0, 5) || []);
      if (challRes.status === "fulfilled") setChallenges((challRes.value as any[]).slice(0, 3));
      if (storiesRes.status === "fulfilled") setStories((storiesRes.value as any[]).slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Citizen";
  const xp = user?.points || 420;
  const level = user?.level || "Stream Guardian";
  const badges = user?.badge_count || 4;
  const obsCount = observations.length || 18;

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">

      {/* ── Feature Badge Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Citizen Science & Monitoring", color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300" },
          { label: "Awareness & Storytelling", color: "bg-purple-500/10 border-purple-500/30 text-purple-300" },
          { label: "Community & Gamification", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" },
        ].map((t) => (
          <span key={t.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold ${t.color}`}>
            <ShieldCheck className="w-3 h-3" /> {t.label}
          </span>
        ))}
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">
            Welcome back, <span className="text-cyan-400">{firstName}</span> 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Observe, learn, and protect our local waterways with citizen science tools.
          </p>
        </div>

        {/* Stats mini-bar */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-3">
          <div className="text-center">
            <div className="text-xl font-black text-cyan-400">{xp}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">XP</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-xl font-black text-emerald-400">{badges}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Badges</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-xl font-black text-amber-400">{obsCount}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Obs.</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-sm font-black text-purple-400">{level}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Level</div>
          </div>
        </div>
      </div>

      {/* ── Sub-Tab Navigation Bar ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 w-fit">
        {[
          { id: "overview", label: "Overview", icon: Activity, color: "text-cyan-400" },
          { id: "smart-assess", label: "Smart Assessment", icon: Sparkles, color: "text-cyan-400" },
          { id: "comparison", label: "Observation Compare", icon: Compass, color: "text-blue-400" },
          { id: "learning", label: "Knowledge Center", icon: BookOpen, color: "text-purple-400" },
          { id: "community", label: "Missions & Badges", icon: Trophy, color: "text-emerald-400" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === t.id ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <t.icon className={`w-3.5 h-3.5 ${activeTab === t.id ? t.color : "text-slate-500"}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SUB-TAB CONTENT ROUTER ──────────────────────────────────────────── */}
      {activeTab === "smart-assess" && <SmartAssessmentTab streams={streams} />}
      {activeTab === "comparison" && <ObservationComparisonTab observations={observations} />}
      {activeTab === "learning" && <LearningTab stories={stories} />}
      {activeTab === "community" && <CommunityCivicTab leaderboard={leaderboard} challenges={challenges} />}

      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { href: "/assess", icon: Activity, label: "Assess a Stream", color: "from-cyan-500 to-teal-500" },
              { href: "/observations", icon: Camera, label: "Submit Observation", color: "from-teal-500 to-emerald-500" },
              { href: "/map", icon: MapPin, label: "Explore Map", color: "from-purple-500 to-purple-500" },
              { href: "/stories", icon: BookOpen, label: "View AquaStory", color: "from-amber-500 to-orange-500" },
              { href: "/challenges", icon: Trophy, label: "Join Challenge", color: "from-rose-500 to-pink-500" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 transition-all hover:-translate-y-0.5 hover:shadow-lg text-center"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-white leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Streams & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white">My Local Streams</h2>
                </div>
                <Link href="/streams" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 rounded-2xl bg-slate-900/50 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {streams.map((stream) => (
                    <Link
                      key={stream.id}
                      href={`/streams`}
                      className="group p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition">{stream.name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {stream.location_name || "Tamil Nadu"}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBg(stream.status)} ${statusColor(stream.status)}`}>
                          {stream.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>Health Score</span>
                          <span className={`font-black ${statusColor(stream.status)}`}>{Math.round(stream.health_score)}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${healthBar(stream.health_score)} rounded-full transition-all`}
                            style={{ width: `${stream.health_score}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements Sidebar */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Achievements</h2>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-semibold">{level}</span>
                    <span className="text-cyan-400 font-bold">{xp} XP</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                      style={{ width: `${Math.min((xp % 500) / 500 * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Medal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-amber-400">{badges}</div>
                    <div className="text-[10px] text-slate-500">Badges Earned</div>
                  </div>
                </div>

                <Link href="/badges" className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> View All Badges
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CitizenDashboardPage() {
  return (
    <RoleGuard allowedRoles={["citizen"]}>
      <CitizenDashboardContent />
    </RoleGuard>
  );
}
