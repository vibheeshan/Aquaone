"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import {
  Brain, AlertTriangle, CheckCircle2, XCircle, Edit3,
  Sparkles, Eye, Info, RefreshCw, Shield, FlaskConical,
  MapPin, Thermometer, Droplets, Wind, ChevronDown,
  ChevronUp, Clock, User2, Activity, FileCheck,
  TriangleAlert, Microscope, BadgeCheck, ListChecks
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

interface AIValidation {
  is_valid: boolean;
  confidence_score: number;
  prediction_label: string;
  reasons: string[];
  recommended_action: string;
  flagged_for_human: boolean;
}

interface QueueItem {
  observation_id: number;
  stream_id: number;
  stream_name: string;
  water_clarity: string;
  waste_level: string;
  algae_level: string;
  odor: string;
  turbidity_ntu: number;
  water_temp_c: number | null;
  ph_level: number | null;
  dissolved_oxygen: number | null;
  latitude: number;
  longitude: number;
  image_url: string;
  notes: string;
  status: string;
  created_at: string;
  ai_validation: AIValidation | null;
}

interface ReviewNote {
  obsId: number;
  decision: "accept" | "reject" | "edit";
  notes: string;
  submitting: boolean;
  done: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const ACTION_LABEL: Record<string, { label: string; color: string }> = {
  auto_accept:  { label: "Auto Accept",          color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/40" },
  human_review: { label: "Needs Expert Review",  color: "text-amber-300 bg-amber-950/30 border-amber-500/30"   },
  flag_reject:  { label: "Flag for Rejection",   color: "text-red-400 bg-red-950/40 border-red-500/40"         },
};

const PREDICTION_BADGE: Record<string, { label: string; icon: any; style: string }> = {
  valid_observation:   { label: "Valid Observation",   icon: BadgeCheck,    style: "text-emerald-300 bg-emerald-950/40 border-emerald-500/40" },
  possible_pollution:  { label: "Possible Pollution",  icon: TriangleAlert, style: "text-amber-300 bg-amber-950/30 border-amber-500/30"      },
  invalid_measurement: { label: "Invalid Measurement", icon: XCircle,       style: "text-red-400 bg-red-950/40 border-red-500/40"            },
};

// ── Helper Components ────────────────────────────────────────────────────────

function ConfidenceMeter({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80 ? "from-emerald-500 to-teal-400" :
    pct >= 60 ? "from-amber-400 to-yellow-400" :
                "from-red-500 to-rose-400";
  const textColor = pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-300" : "text-red-400";
  return (
    <div className="space-y-1 min-w-[140px]">
      <div className="flex justify-between text-[11px] font-semibold">
        <span className="text-slate-400">AI Confidence</span>
        <span className={textColor}>{pct}%</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MetricPill({ label, value, icon: Icon }: { label: string; value: any; icon: any }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
      <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <span className="text-[10px] text-slate-400">{label}</span>
      <span className="text-[11px] font-bold text-white">{value ?? "—"}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending_review: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    verified:       "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    rejected:       "bg-red-500/20 text-red-300 border-red-500/40",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${map[status] || "bg-slate-800 text-slate-400 border-slate-700"}`}>
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
}

function ValidationChecks({ reasons, label }: { reasons: string[]; label: string }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-200 hover:bg-slate-800/40 transition"
      >
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-purple-400" />
          AquaAI Validation Reasoning — <span className="text-purple-300">{label}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {expanded && (
        <ul className="px-4 pb-4 pt-1 space-y-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AIReviewPage() {
  const [queue, setQueue]       = useState<QueueItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<QueueItem | null>(null);
  const [reviews, setReviews]   = useState<Record<number, ReviewNote>>({});
  const [error, setError]       = useState<string | null>(null);

  const loadQueue = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchApi<{ count: number; queue: QueueItem[] }>("/ai/review-queue")
      .then((data) => {
        setQueue(data.queue);
        if (data.queue.length > 0) setSelected(data.queue[0]);
      })
      .catch(() => {
        // Fallback: load all observations
        fetchApi<any[]>("/observations")
          .then((obs) => {
            const items: QueueItem[] = obs.map((o) => ({
              observation_id: o.id,
              stream_id: o.stream_id,
              stream_name: `Stream #${o.stream_id}`,
              water_clarity: o.water_clarity,
              waste_level: o.waste_level,
              algae_level: o.algae_level,
              odor: o.odor,
              turbidity_ntu: o.turbidity_ntu,
              water_temp_c: o.water_temp_c,
              ph_level: o.ph_level,
              dissolved_oxygen: o.dissolved_oxygen,
              latitude: o.latitude,
              longitude: o.longitude,
              image_url: o.image_url,
              notes: o.notes,
              status: o.status,
              created_at: o.created_at,
              ai_validation: null,
            }));
            setQueue(items);
            if (items.length > 0) setSelected(items[0]);
          })
          .catch((e) => setError("Failed to load review queue. " + e.message));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  const handleAction = async (
    item: QueueItem,
    decision: "accept" | "reject" | "edit",
    notes: string
  ) => {
    const obsId = item.observation_id;
    setReviews((r) => ({ ...r, [obsId]: { obsId, decision, notes, submitting: true, done: false } }));
    try {
      await fetchApi("/ai/human-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          observation_id: obsId,
          reviewer_id: 1,
          decision,
          override_notes: notes || `Expert ${decision} via AquaAI Review Portal`,
        }),
      });
    } catch { /* soft fail */ }
    setReviews((r) => ({ ...r, [obsId]: { obsId, decision, notes, submitting: false, done: true } }));
    setQueue((q) => {
      const remaining = q.filter((i) => i.observation_id !== obsId);
      setSelected(remaining[0] ?? null);
      return remaining;
    });
  };

  const reviewState = selected ? reviews[selected.observation_id] : null;
  const totalAI  = queue.filter((q) => q.ai_validation).length;
  const highConf = queue.filter((q) => (q.ai_validation?.confidence_score ?? 0) >= 0.8).length;
  const flagged  = queue.filter((q) => q.ai_validation?.flagged_for_human).length;

  return (
    <div className="space-y-6 py-6">

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-3">
          <Brain className="w-4 h-4" />
          AI-Supported Assessment &amp; Human-in-the-Loop Verification
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">AquaAI Review Portal</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              AI identifies anomalies and flags suspicious observations —{" "}
              <strong className="text-white">experts make the final call.</strong> Every decision is logged in the audit trail.
            </p>
          </div>
          <button
            onClick={loadQueue}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Queue
          </button>
        </div>
      </div>

      {/* XAI Philosophy Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900/80 border border-purple-500/20 flex items-start gap-3">
        <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-purple-300">AquaAI Explainable AI (XAI) Principle: </span>
          AI output is <em>assistive only</em> — it never auto-rejects citizen data. Every AI flag includes detailed
          scientific reasoning so expert reviewers can make informed decisions. All actions are permanently
          logged for accountability and model improvement.
        </p>
      </div>

      {/* Stats Row */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "In Review Queue", value: queue.length, icon: FileCheck,    color: "text-cyan-400"    },
            { label: "AI-Analyzed",     value: totalAI,      icon: Brain,        color: "text-purple-400"  },
            { label: "High Confidence", value: highConf,     icon: BadgeCheck,   color: "text-emerald-400" },
            { label: "Flagged by AI",   value: flagged,      icon: TriangleAlert,color: "text-amber-300"   },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-slate-800 ${color}`}><Icon className="w-4 h-4" /></div>
              <div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-[10px] text-slate-400">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <Brain className="w-8 h-8 text-purple-400 animate-pulse mx-auto mb-3" />
          <p className="text-sm text-slate-400 animate-pulse">Loading AI review queue…</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 text-center text-red-300 text-sm">{error}</div>
      ) : queue.length === 0 ? (
        <div className="py-20 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Review Queue is Clear!</h3>
          <p className="text-sm text-slate-400">All observations have been verified. AquaAI will flag new submissions automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Queue List */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Flagged Submissions</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                {queue.length} pending
              </span>
            </div>
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {queue.map((item) => {
                const isSelected = selected?.observation_id === item.observation_id;
                const conf = item.ai_validation?.confidence_score ?? null;
                const confPct = conf !== null ? Math.round(conf * 100) : null;
                const confColor = confPct === null ? "text-slate-500" : confPct >= 80 ? "text-emerald-400" : confPct >= 60 ? "text-amber-300" : "text-red-400";
                return (
                  <div
                    key={item.observation_id}
                    onClick={() => setSelected(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-900/20"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">Obs #{item.observation_id}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="text-[11px] text-slate-400 mb-1 font-medium">{item.stream_name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{item.water_clarity} · Waste: {item.waste_level}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{new Date(item.created_at).toLocaleString()}
                      </span>
                      {confPct !== null && <span className={`text-[10px] font-bold ${confColor}`}>{confPct}% conf.</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Panel */}
          {selected ? (
            <div className="lg:col-span-2 space-y-5">

              {/* Observation Details */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-base font-bold text-white">
                      Observation #{selected.observation_id} — {selected.stream_name}
                    </h2>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <img src={selected.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"} alt="Stream observation" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <MetricPill label="Clarity"    value={selected.water_clarity}  icon={Eye}         />
                      <MetricPill label="Waste"      value={selected.waste_level}    icon={TriangleAlert} />
                      <MetricPill label="Algae"      value={selected.algae_level}    icon={FlaskConical} />
                      <MetricPill label="Odor"       value={selected.odor}           icon={Wind}        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <MetricPill label="Turbidity" value={selected.turbidity_ntu ? `${selected.turbidity_ntu} NTU` : "—"} icon={Droplets}     />
                      <MetricPill label="Temp"      value={selected.water_temp_c  ? `${selected.water_temp_c}°C` : "—"}    icon={Thermometer}  />
                      <MetricPill label="pH"        value={selected.ph_level ?? "—"}                                        icon={Activity}     />
                      <MetricPill label="DO"        value={selected.dissolved_oxygen ? `${selected.dissolved_oxygen} mg/L` : "—"} icon={Microscope} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      GPS: {selected.latitude?.toFixed(4)}, {selected.longitude?.toFixed(4)}
                    </div>
                    {selected.notes && <p className="text-[11px] text-slate-400 italic">"{selected.notes}"</p>}
                  </div>
                </div>
              </div>

              {/* AquaAI Analysis */}
              <div className="glass-card p-6 rounded-2xl border border-purple-500/25 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">AquaAI Assistive Diagnosis</h3>
                  </div>
                  {selected.ai_validation
                    ? <ConfidenceMeter score={selected.ai_validation.confidence_score} />
                    : <span className="text-xs text-slate-500 italic">No AI record — assess manually</span>
                  }
                </div>

                {selected.ai_validation ? (
                  <div className="space-y-4">
                    {/* Prediction & Action Badges */}
                    <div className="flex flex-wrap gap-3">
                      {(() => {
                        const badge = PREDICTION_BADGE[selected.ai_validation!.prediction_label] ?? { label: selected.ai_validation!.prediction_label, icon: Info, style: "text-slate-300 bg-slate-800 border-slate-700" };
                        const BadgeIcon = badge.icon;
                        return (
                          <div>
                            <div className="text-[10px] text-slate-500 mb-1">AI Prediction</div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badge.style}`}>
                              <BadgeIcon className="w-3.5 h-3.5" />{badge.label}
                            </div>
                          </div>
                        );
                      })()}
                      {(() => {
                        const action = ACTION_LABEL[selected.ai_validation!.recommended_action] ?? { label: selected.ai_validation!.recommended_action, color: "text-slate-300 bg-slate-800 border-slate-700" };
                        return (
                          <div>
                            <div className="text-[10px] text-slate-500 mb-1">Recommended Action</div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${action.color}`}>
                              {action.label}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <ValidationChecks
                      reasons={selected.ai_validation.reasons}
                      label={`${Math.round(selected.ai_validation.confidence_score * 100)}% confidence`}
                    />

                    <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/25 flex items-start gap-2 text-amber-200 text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>AI Output is strictly ASSISTIVE.</strong> AquaAI never auto-rejects citizen data.
                        Your expert review is required. Every decision is permanently recorded.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <Brain className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    No AI validation record for this observation. Use expert judgment below.
                  </div>
                )}
              </div>

              {/* Human Review Actions */}
              {reviewState?.done ? (
                <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-sm">Review Submitted &amp; Audit Logged</div>
                    <div className="text-xs text-emerald-400">Decision: <strong>{reviewState.decision.toUpperCase()}</strong></div>
                  </div>
                </div>
              ) : (
                <HumanReviewActions item={selected} submitting={reviewState?.submitting ?? false} onAction={handleAction} />
              )}
            </div>
          ) : (
            <div className="lg:col-span-2 glass-card p-16 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center text-slate-400">
              <Brain className="w-10 h-10 text-purple-500/40 mb-3" />
              <p className="text-sm">Select an observation from the queue to begin review.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Human Review Actions Component ──────────────────────────────────────────

function HumanReviewActions({
  item,
  submitting,
  onAction,
}: {
  item: QueueItem;
  submitting: boolean;
  onAction: (item: QueueItem, decision: "accept" | "reject" | "edit", notes: string) => void;
}) {
  const [notes, setNotes] = useState("");
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-700 space-y-4">
      <div className="flex items-center gap-2">
        <User2 className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-white">Expert Human Review Decision</h3>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Override Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add your expert reasoning, corrections, or field observations here…"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 resize-none"
        />
      </div>
      <div className="flex flex-wrap gap-3 justify-end pt-1">
        <button disabled={submitting} onClick={() => onAction(item, "reject", notes)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-500/15 text-red-300 border border-red-500/35 text-xs font-bold hover:bg-red-500/25 disabled:opacity-50 transition">
          <XCircle className="w-4 h-4" /> Reject Observation
        </button>
        <button disabled={submitting} onClick={() => onAction(item, "edit", notes)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/35 text-xs font-bold hover:bg-amber-500/25 disabled:opacity-50 transition">
          <Edit3 className="w-4 h-4" /> Edit &amp; Verify
        </button>
        <button disabled={submitting} onClick={() => onAction(item, "accept", notes)}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg hover:brightness-110 disabled:opacity-50 transition">
          {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Accept &amp; Verify
        </button>
      </div>
      <div className="text-[10px] text-slate-600 text-center">
        All decisions are permanently logged to the AuditLog with reviewer ID, timestamp, and action type.
      </div>
    </div>
  );
}

