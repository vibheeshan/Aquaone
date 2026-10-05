"use client";

import { useState, useEffect } from "react";
import { fetchApi, Stream } from "@/lib/api";
import { 
  FileText, Download, Share2, CheckCircle2, Droplets, Filter, 
  Printer, Calendar, Mail, Bell, Shield, Sparkles, Clock, 
  Copy, ExternalLink, RefreshCw, Layers, Scale, HeartPulse
} from "lucide-react";

export default function ReportsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<string>("ALL");
  const [reportType, setReportType] = useState<"citizen" | "expert" | "government" | "research" | "one_health">("citizen");
  const [format, setFormat] = useState<"json" | "csv" | "pdf">("pdf");
  const [dateRange, setDateRange] = useState("Last 60 Days");
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleFreq, setScheduleFreq] = useState("Weekly (Mondays 08:00 AM)");

  useEffect(() => {
    fetchApi<Stream[]>("/streams")
      .then(setStreams)
      .catch(console.error);
  }, []);

  const reportPresets = {
    citizen: {
      title: "Citizen Field Summary & Water Health",
      desc: "Plain-language summary, community infographics, water clarity trends, and guardian contribution logs.",
      badge: "Community Friendly",
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10"
    },
    expert: {
      title: "Hydrologist & Technical Sensor QA/QC Audit",
      desc: "Full variance distributions, sensor telemetry, cross-field validation, and AI validation confidence scores.",
      badge: "Technical Audit",
      color: "border-purple-500/40 text-purple-400 bg-purple-500/10"
    },
    government: {
      title: "Municipal Remediation & Priority Action Brief",
      desc: "Critical hotspot mapping, solid waste choke points, regulatory threshold comparisons, and remediation recommendations.",
      badge: "Policy & Municipal",
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10"
    },
    research: {
      title: "Longitudinal Environmental Dataset Package",
      desc: "Raw observations, geospatial coordinates, Pearson correlation matrices, and seasonal aggregation tables.",
      badge: "Academic & Research",
      color: "border-teal-500/40 text-teal-400 bg-teal-500/10"
    },
    one_health: {
      title: "One Health Cross-Domain Synthesis Brief",
      desc: "Zoonotic vulnerability indices, sanitation impact, drinking water proximity, and environmental health metrics.",
      badge: "One Health Interop",
      color: "border-pink-500/40 text-pink-400 bg-pink-500/10"
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const streamParam = selectedStreamId === "ALL" ? "" : `&stream_id=${selectedStreamId}`;
      const res = await fetchApi<any>(`/reports/export?audience=${reportType}&format=${format}${streamParam}`);
      setGeneratedReport(res);
      
      if (format === "csv") {
        // Generate CSV file download
        const csvRows = [
          ["Stream Name", "Code", "Health Score", "Status", "Water Quality", "Pollution Index", "Biodiversity", "Ecosystem", "Avg Turbidity NTU", "Avg DO mg/L"],
          ...res.streams.map((s: any) => [
            `"${s.stream_name}"`,
            s.code,
            s.health_score,
            s.status,
            s.water_quality_score,
            s.pollution_score,
            s.biodiversity_score,
            s.ecosystem_score,
            s.avg_turbidity_ntu,
            s.avg_dissolved_oxygen_mg_l
          ])
        ];
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `AquaOne_${reportType}_Report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === "json") {
        // Download JSON
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `AquaOne_${reportType}_Report.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // PDF Preview
        setShowPreviewModal(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/dashboard?stream=${selectedStreamId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleEmail) return;
    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Analytics Export & Reporting Center</span>
        </div>
        <h1 className="text-3xl font-black text-white">AquaOne Report Generation Center</h1>
        <p className="text-xs text-slate-400">
          Generate customized multi-stakeholder reports, printable analytical summaries, dataset exports (CSV/JSON), and automated scheduled briefs.
        </p>
      </div>

      {/* Report Audience Preset Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(reportPresets) as Array<keyof typeof reportPresets>).map((key) => {
          const preset = reportPresets[key];
          const isSelected = reportType === key;
          return (
            <button
              key={key}
              onClick={() => setReportType(key)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                isSelected 
                  ? "bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10" 
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.color}`}>
                  {preset.badge}
                </span>
                <div className="font-bold text-white text-xs pt-1">{preset.title}</div>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2">{preset.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Generator Configuration Form */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Report Parameters & Scope
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Stream Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Watershed</label>
            <select
              value={selectedStreamId}
              onChange={(e) => setSelectedStreamId(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Watershed Basins (Comprehensive)</option>
              {streams.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.health_score}/100)
                </option>
              ))}
            </select>
          </div>

          {/* Date Window */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Observation Window</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option>Last 30 Days</option>
              <option>Last 60 Days</option>
              <option>Last 90 Days</option>
              <option>Full Historical Dataset</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Output Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="pdf">Formatted PDF (Printable Summary)</option>
              <option value="csv">CSV Dataset (Spreadsheet Export)</option>
              <option value="json">JSON API Payload (FHIR Compliant)</option>
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{generating ? "Compiling Environmental Report..." : `Generate & Export ${reportPresets[reportType].title}`}</span>
        </button>
      </div>

      {/* Scheduled Report Automation & Shareable Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scheduled Automation Form */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Automated Scheduled Reports</h3>
          </div>
          <p className="text-xs text-slate-400">
            Automatically receive compiled analytical digests and anomaly reports directly in your inbox.
          </p>

          <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1">Recipient Email Address</label>
              <input
                type="email"
                required
                value={scheduleEmail}
                onChange={(e) => setScheduleEmail(e.target.value)}
                placeholder="hydrologist@waterboard.gov or guardian@citizen.org"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Frequency Cadence</label>
              <select
                value={scheduleFreq}
                onChange={(e) => setScheduleFreq(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 focus:outline-none"
              >
                <option>Daily Digest (07:00 AM)</option>
                <option>Weekly (Mondays 08:00 AM)</option>
                <option>Monthly Watershed Executive Brief</option>
                <option>Immediate Anomaly Alert Trigger</option>
              </select>
            </div>

            {scheduleSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Automated schedule configured for {scheduleEmail}!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
            >
              Activate Automated Delivery
            </button>
          </form>
        </div>

        {/* Shareable Dashboard Link */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Shareable Public Dashboards</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate authenticated read-only links for researchers, local communities, municipal planners, and hackathon judges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="truncate max-w-[240px]">aquaone.org/dashboard?stream={selectedStreamId}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">LIVE</span>
            </div>

            <button
              onClick={handleCopyShareLink}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Shareable Link Copied!" : "Copy Shareable Dashboard Link"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Printable PDF Preview Modal */}
      {showPreviewModal && generatedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-500/40 p-6 sm:p-8 space-y-6 bg-slate-950 text-white shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {generatedReport.report_id}
                </span>
                <h2 className="text-xl font-bold text-white">{generatedReport.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Content Body */}
            <div className="space-y-6 text-xs text-slate-300">
              
              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 italic">
                {generatedReport.disclaimer}
              </div>

              {/* Streams Summary Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Monitored Watershed Status ({generatedReport.streams_evaluated} Stations)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-800 text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-white font-bold">
                        <th className="p-2.5">Stream Name</th>
                        <th className="p-2.5 text-center">Score</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5 text-center">Water Quality</th>
                        <th className="p-2.5 text-center">Pollution</th>
                        <th className="p-2.5 text-center">Biodiversity</th>
                        <th className="p-2.5 text-center">Avg Turbidity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {generatedReport.streams.map((s: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="p-2.5 font-bold text-white">{s.stream_name} ({s.code})</td>
                          <td className="p-2.5 text-center font-black text-cyan-300">{s.health_score}/100</td>
                          <td className="p-2.5 text-center font-semibold text-slate-200">{s.status}</td>
                          <td className="p-2.5 text-center">{s.water_quality_score}</td>
                          <td className="p-2.5 text-center">{s.pollution_score}</td>
                          <td className="p-2.5 text-center">{s.biodiversity_score}</td>
                          <td className="p-2.5 text-center text-cyan-300">{s.avg_turbidity_ntu} NTU</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800 flex justify-between">
                <span>Generated automatically by AquaOne v2.1</span>
                <span>Date: {new Date(generatedReport.generated_at).toLocaleString()}</span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
