"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, MapPin, 
  Send, Filter, Sparkles, Flame, Droplets, Info, Shield, 
  ExternalLink, ChevronRight, UserCheck, Bell
} from "lucide-react";

export default function EarlyWarningAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");
  const [acknowledged, setAcknowledged] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchApi<any[]>("/alerts")
      .then(setAlerts)
      .catch((err) => console.error("Error fetching alerts:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAcknowledge = async (alertId: number) => {
    try {
      await fetchApi(`/alerts/${alertId}/acknowledge`, { method: "POST" });
      setAcknowledged((prev) => ({ ...prev, [alertId]: true }));
    } catch {
      setAcknowledged((prev) => ({ ...prev, [alertId]: true }));
    }
  };

  const filtered = alerts.filter((a) => {
    if (severityFilter === "ALL") return true;
    return a.severity === severityFilter;
  });

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 text-xs font-semibold mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Early Warning Alert & Escalation Dispatch</span>
          </div>
          <h1 className="text-3xl font-black text-white">Early Warning Alert Dispatch</h1>
          <p className="text-xs text-slate-400">
            Real-time threshold breaches, acute chemical & turbidity anomalies, and automated municipal escalation triggers.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-700 self-start md:self-auto text-xs">
          {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-xl font-bold transition ${
                severityFilter === sev
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filtered.map((alt) => {
          const isAck = acknowledged[alt.id];
          const isCritical = alt.severity === "CRITICAL";
          const isWarning = alt.severity === "WARNING";

          return (
            <div 
              key={alt.id}
              className={`glass-card p-6 sm:p-7 rounded-3xl border space-y-4 transition ${
                isCritical 
                  ? "border-red-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/20 shadow-xl shadow-red-950/20" 
                  : isWarning 
                  ? "border-amber-500/40 bg-slate-900/80" 
                  : "border-cyan-500/30 bg-slate-900/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                    isCritical ? "bg-red-950 text-red-300 border-red-500 animate-pulse" :
                    isWarning ? "bg-amber-950 text-amber-300 border-amber-500" :
                    "bg-cyan-950 text-cyan-300 border-cyan-500"
                  }`}>
                    {alt.severity} ALERT
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {alt.category}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Detected: {new Date(alt.created_at).toLocaleTimeString()}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{alt.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
              </div>

              {/* Threshold Breach & Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Threshold Trigger</span>
                  <div className="font-mono text-xs font-bold text-amber-300">{alt.threshold_breach}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Recommended Intervention</span>
                  <div className="text-xs text-slate-200">{alt.recommended_action}</div>
                </div>
              </div>

              {/* Stakeholders & Action Row */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 flex-wrap">
                  <span className="text-slate-500 font-semibold">Notified:</span>
                  {alt.affected_stakeholders?.map((stk: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {stk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAcknowledge(alt.id)}
                    disabled={isAck}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isAck 
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default" 
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    {isAck ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Acknowledged</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Acknowledge Protocol</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/predictions/${alt.stream_id}`}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow transition flex items-center gap-1"
                  >
                    <span>View Station ML Risk</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
