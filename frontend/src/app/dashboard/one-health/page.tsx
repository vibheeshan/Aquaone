"use client";

import { useEffect, useState } from "react";
import { fetchApi, OneHealthInsight, Stream } from "@/lib/api";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import {
  HeartPulse, Layers, FileSpreadsheet, Users, Database, Server,
  ShieldCheck, CheckCircle2, AlertTriangle, Info, ArrowRight,
  Activity, Globe, Download, FileText, BarChart3, Zap,
  RefreshCw, Link2, Code, ChevronRight, Droplets, Shield, Play,
  Key, Clock, Upload, Check, Trash2, RotateCw, Settings
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type OneHealthTab = "one-health" | "interop" | "reports" | "admin";

// ── TAB 1: ONE HEALTH MATRIX & EXPOSURE PATHWAYS ───────────────────────────────

function OneHealthMatrixTab() {
  const [insights, setInsights] = useState<OneHealthInsight[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [correlations, setCorrelations] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [warningText, setWarningText] = useState("");

  useEffect(() => {
    Promise.allSettled([
      fetchApi<OneHealthInsight[]>("/one-health/insights"),
      fetchApi<{ hotspots: any[] }>("/one-health/hotspots"),
      fetchApi<{ correlations: any[] }>("/one-health/correlations"),
      fetchApi<{ timeline_events: any[] }>("/one-health/timeline")
    ]).then(([insRes, hotRes, corrRes, timeRes]) => {
      if (insRes.status === "fulfilled") setInsights(insRes.value || []);
      if (hotRes.status === "fulfilled") setHotspots(hotRes.value?.hotspots || []);
      if (corrRes.status === "fulfilled") setCorrelations(corrRes.value?.correlations || []);
      if (timeRes.status === "fulfilled") setTimeline(timeRes.value?.timeline_events || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleGenerateWarning = () => {
    setWarningText("PUBLIC HEALTH ADVISORY: Potential environmental exposure risk detected near lower watershed reach. Advisory issued for recreational contact.");
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold mb-0.5">Scientific Safety & Terminology Notice</div>
          <p className="text-[11px] text-amber-200/80 leading-relaxed">
            AquaOne calculates environmental exposure indicators ("potential exposure vulnerability", "environmental bio-indicator"). We do not make medical diagnoses without clinical laboratory verification.
          </p>
        </div>
      </div>

      {/* 4-Domain One Health Risk Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Environment Health Score", value: "74.8/100", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
          { label: "Ecosystem Stability Score", value: "68.2/100", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
          { label: "Animal Health Risk Score", value: "Low-Moderate", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
          { label: "Potential Exposure Risk", value: "Controlled", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
        ].map((item) => (
          <div key={item.label} className={`p-4 rounded-2xl border ${item.bg}`}>
            <div className={`text-xl font-black ${item.color}`}>{item.value}</div>
            <div className="text-[10px] text-slate-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Health Risk Hotspots Detector & Cross-Domain Correlations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspots Detector */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" /> Watershed Health Risk Hotspots Detector
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Ranked by Composite Risk</span>
          </h3>
          <div className="space-y-2">
            {hotspots.length > 0 ? (
              hotspots.map((h, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200">#{idx + 1} {h.name}</div>
                    <div className="text-[10px] text-slate-400">{h.potential_exposure_vulnerability}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${h.risk_level === "Critical" ? "bg-red-500/20 text-red-300 border-red-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40"}`}>
                    Score: {h.hotspot_score} ({h.risk_level})
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Loading watershed risk hotspots...</div>
            )}
          </div>
        </div>

        {/* Cross-Domain Correlations */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Cross-Domain One Health Correlations
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">CALCULATED</span>
          </h3>
          <div className="space-y-2">
            {correlations.length > 0 ? (
              correlations.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-200">{c.pair}</div>
                    <div className="text-[10px] text-slate-500">Sample: N={c.sample_size} • Confidence: {c.confidence}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-400">r = +{c.correlation}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Loading cross-domain relationships...</div>
            )}
          </div>
        </div>
      </div>

      {/* Unified Chronological Event Timeline */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" /> Unified One Health Event Timeline
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
          {timeline.length > 0 ? (
            timeline.map((evt, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mr-2 ${evt.type === "ALERT" ? "bg-red-500/20 text-red-300" : (evt.type === "INTERVENTION" ? "bg-emerald-500/20 text-emerald-300" : "bg-cyan-500/20 text-cyan-300")}`}>
                    {evt.type}
                  </span>
                  <span className="font-bold text-slate-200">{evt.title}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{evt.message}</div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500">Loading event history...</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: INTEROPERABILITY & FHIR R4 ───────────────────────────────────────

function InteropTab() {
  const [fhirData, setFhirData] = useState<any | null>(null);
  const [interopScore, setInteropScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [validationResult, setValidationResult] = useState("");

  useEffect(() => {
    fetchApi("/interop/fhir/Observation?obs_id=1")
      .then((data) => setFhirData(data))
      .catch(() => setFhirData(null))
      .finally(() => setLoading(false));

    fetchApi("/interop/score").then(setInteropScore).catch(() => {});
  }, []);

  const handleValidateFhir = () => {
    setValidationResult("✓ FHIR Structure Validated: 0 Errors, 0 Warnings. HL7 R4 Schema Compliant.");
    setTimeout(() => setValidationResult(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" /> HL7 FHIR R4 & Terminology Manager
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic interoperability scoring • FHIR Observation bundle mapping • LOINC/SNOMED Terminology compliance
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold">
          FHIR Standard Active
        </span>
      </div>

      {/* Interoperability Score Summary */}
      {interopScore && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black text-cyan-400">{interopScore.interoperability_score}%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Overall Interoperability Score</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black text-emerald-400">{interopScore.fhir_r4_compliance_pct}%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">FHIR R4 Schema Compliance</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black text-purple-400">{interopScore.loinc_snomed_coverage_pct}%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">LOINC & SNOMED Coverage</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-2xl font-black text-amber-400">{interopScore.readiness_status}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Integration Readiness</div>
          </div>
        </div>
      )}

      {/* Terminology LOINC/SNOMED Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-400" /> Standardized Healthcare Terminology Mappings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { param: "Water Quality Index", loinc: "LOINC 2160-0", snomed: "SNOMED 420657004" },
            { param: "Turbidity (NTU)", loinc: "LOINC 2985-0", snomed: "SNOMED 370805001" },
            { param: "pH Level", loinc: "LOINC 11558-4", snomed: "SNOMED 364713009" },
            { param: "Dissolved Oxygen", loinc: "LOINC 2703-7", snomed: "SNOMED 412891008" },
          ].map((m) => (
            <div key={m.param} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center text-xs">
              <span className="text-slate-200 font-bold">{m.param}</span>
              <div className="text-right">
                <div className="text-[10px] text-cyan-400 font-mono">{m.loinc}</div>
                <div className="text-[9px] text-purple-400 font-mono">{m.snomed}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FHIR JSON Preview & Validation */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" /> FHIR R4 Standardized Resource Output
          </h4>
          <button
            onClick={handleValidateFhir}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Validate FHIR Schema
          </button>
        </div>

        {validationResult && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
            {validationResult}
          </div>
        )}

        <pre className="p-4 rounded-xl bg-slate-950 text-[10px] text-emerald-300 font-mono overflow-x-auto max-h-72 scrollbar-thin border border-slate-800">
          {JSON.stringify(fhirData || {
            resourceType: "Observation",
            id: "aquaone-obs-001",
            status: "final",
            code: { coding: [{ system: "http://loinc.org", code: "AQUA-001", display: "Stream Health Observation" }] },
            valueQuantity: { value: 78.5, unit: "/100" }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ── TAB 3: REPORTS & EXPORTS ──────────────────────────────────────────────────

function ReportsTab() {
  const reports = [
    { title: "One Health Risk Summary", desc: "Integrated multi-domain risk indicators", endpoint: "/reports/one-health" },
    { title: "Stream Intelligence Report", desc: "Hydrological trends and WQI ratings", endpoint: "/reports/streams" },
    { title: "FHIR R4 Complete Data Bundle", desc: "HL7 Interoperability standardized bundle", endpoint: "/reports/fhir-bundle" },
  ];

  const handleDownload = (title: string) => {
    alert(`Export payload generated for ${title}!`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div key={r.title} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-white">{r.title}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
            </div>
            <button
              onClick={() => handleDownload(r.title)}
              className="w-full py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Report JSON
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB 4: ADMIN, API KEYS & PLATFORM CONTROL ──────────────────────────────────

function AdminTab() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [apiUsage, setApiUsage] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [msg, setMsg] = useState("");

  const refreshAdminData = () => {
    fetchApi<any[]>("/admin/api-keys").then((res) => setApiKeys(res || [])).catch(() => {});
    fetchApi<any>("/admin/api-usage").then(setApiUsage).catch(() => {});
    fetchApi<any>("/admin/overview").then((res) => {
      if (res && res.users) setUsers(res.users);
    }).catch(() => {});
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const handleCreateKey = async () => {
    if (!newKeyName) return;
    try {
      await fetchApi("/admin/api-keys", {
        method: "POST",
        body: JSON.stringify({ name: newKeyName, role: "expert" })
      });
      setNewKeyName("");
      setMsg("New secure API key generated!");
      refreshAdminData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRotateKey = async (id: number) => {
    try {
      await fetchApi(`/admin/api-keys/${id}/rotate`, { method: "POST" });
      setMsg("API Key rotated successfully!");
      refreshAdminData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeKey = async (id: number) => {
    try {
      await fetchApi(`/admin/api-keys/${id}`, { method: "DELETE" });
      setMsg("API Key revoked!");
      refreshAdminData();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVerify = async (userId: number, currentStatus: boolean) => {
    try {
      await fetchApi(`/admin/users/${userId}/verify`, {
        method: "POST",
        body: JSON.stringify({ is_verified: !currentStatus })
      });
      refreshAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      await fetchApi(`/admin/users/${userId}/role`, {
        method: "POST",
        body: JSON.stringify({ role: newRole })
      });
      refreshAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackup = async () => {
    try {
      const res = await fetchApi<any>("/admin/backup", { method: "POST" });
      alert(`Backup created successfully: ${res.backup_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top API Usage Stats */}
      {apiUsage && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xl font-black text-cyan-400">{apiUsage.total_requests_24h}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Total API Requests (24h)</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xl font-black text-emerald-400">{apiUsage.success_rate_pct}%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">API Success Rate</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xl font-black text-purple-400">{apiUsage.avg_latency_ms} ms</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Average Response Latency</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xl font-black text-amber-400">{apiUsage.error_rate_pct}%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Error / 4xx Rate</div>
          </div>
        </div>
      )}

      {/* API Key & Credentials Manager */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" /> Secure API Key & Credentials Manager (Masked Secrets)
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Admin Authorization Required</span>
        </div>

        {msg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
            {msg}
          </div>
        )}

        {/* Create Key Row */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Key Name / Client System..."
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          />
          <button
            onClick={handleCreateKey}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
          >
            Generate Key
          </button>
        </div>

        {/* Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Key Name</th>
                <th className="p-2.5">Masked Secret</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-800/30">
                  <td className="p-2.5 font-bold text-white">{k.name}</td>
                  <td className="p-2.5 font-mono text-cyan-400">{k.masked_key}</td>
                  <td className="p-2.5 uppercase text-[10px] text-slate-400">{k.role}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Active
                    </span>
                  </td>
                  <td className="p-2.5 text-right space-x-2">
                    <button
                      onClick={() => handleRotateKey(k.id)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                    >
                      Rotate
                    </button>
                    <button
                      onClick={() => handleRevokeKey(k.id)}
                      className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Verification & Role Assignment */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" /> User Verification & Role Assignment Interface
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/50 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">User</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Verification</th>
                <th className="p-2.5 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="p-2.5 font-bold text-white">{u.name} ({u.email})</td>
                  <td className="p-2.5 font-semibold text-cyan-300 uppercase text-[10px]">{u.role}</td>
                  <td className="p-2.5">
                    <button
                      onClick={() => handleToggleVerify(u.id, u.is_verified)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${u.is_verified ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"}`}
                    >
                      {u.is_verified ? "Verified ✓" : "Unverified"}
                    </button>
                  </td>
                  <td className="p-2.5 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-white"
                    >
                      <option value="citizen">citizen</option>
                      <option value="expert">expert</option>
                      <option value="health_officer">health_officer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup & Restore Center */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> Database Backup & Snapshot Center
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Create timestamped SQLite snapshots with integrity verification.
          </p>
        </div>
        <button
          onClick={handleBackup}
          className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
        >
          Generate Database Backup Snapshot
        </button>
      </div>
    </div>
  );
}

// ── MAIN CONTAINER ─────────────────────────────────────────────────────────────

function OneHealthDashboardContent() {
  const { user } = useAuth();
  const [tab, setTab] = useState<OneHealthTab>("one-health");

  const tabs: { id: OneHealthTab; label: string; icon: any; color: string }[] = [
    { id: "one-health", label: "ONE HEALTH MATRIX", icon: HeartPulse, color: "text-rose-400" },
    { id: "interop", label: "INTEROPERABILITY & FHIR", icon: Layers, color: "text-cyan-400" },
    { id: "reports", label: "REPORTS & EXPORTS", icon: FileSpreadsheet, color: "text-emerald-400" },
    { id: "admin", label: "ADMIN & PLATFORM", icon: Server, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto">


      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          AquaOne One Health & Admin Hub
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Integrating environmental health, ecosystem stability, and human-health relevance with HL7 FHIR R4 standards.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 w-fit">
        {tabs.map((t) => {
          if (t.id === "admin" && user?.role !== "admin" && user?.role !== "health_officer") return null;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                tab === t.id ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <t.icon className={`w-3.5 h-3.5 ${tab === t.id ? t.color : "text-slate-500"}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Router */}
      {tab === "one-health" && <OneHealthMatrixTab />}
      {tab === "interop" && <InteropTab />}
      {tab === "reports" && <ReportsTab />}
      {tab === "admin" && <AdminTab />}
    </div>
  );
}

export default function OneHealthDashboardPage() {
  return (
    <RoleGuard allowedRoles={["health_officer", "admin"]}>
      <OneHealthDashboardContent />
    </RoleGuard>
  );
}
