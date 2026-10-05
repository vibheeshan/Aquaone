"use client";

import { useState } from "react";
import { Shield, Users, Database, Cpu, Activity, AlertTriangle, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("Users");

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold mb-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Platform Role-Based Administration</span>
        </div>
        <h1 className="text-3xl font-black text-white">AquaOne System Control Center</h1>
        <p className="text-xs text-slate-400">
          Manage system users, monitored streams, AI agent rule thresholds, and system health.
        </p>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {["Users", "Streams", "AI Configuration", "Data Quality", "Audit Trail", "System Health"].map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSection === sec
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Main Admin Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            {activeSection} Management Overview
          </h2>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            SYSTEM STATUS: ONLINE
          </span>
        </div>

        {activeSection === "Users" && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Registered Citizens</div>
                <div className="text-2xl font-black text-white">1,420</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Active Expert Reviewers</div>
                <div className="text-2xl font-black text-purple-400">18</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Researchers</div>
                <div className="text-2xl font-black text-cyan-400">45</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-bold text-slate-200">Recent User Role Log</h3>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex justify-between items-center text-slate-300">
                <span>Dr. Aris Vance (aris.vance@aquaone.org)</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-[10px]">
                  Researcher
                </span>
              </div>
            </div>
          </div>
        )}

        {activeSection === "AI Configuration" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-purple-300">AquaAI Validation Confidence Threshold</div>
              <div className="text-[11px] text-slate-400">Current cutoff for auto-verification without expert review: 0.85</div>
              <input type="range" min="0.5" max="0.95" step="0.05" defaultValue="0.85" className="w-full text-cyan-500" />
            </div>
          </div>
        )}

        {activeSection !== "Users" && activeSection !== "AI Configuration" && (
          <div className="text-center py-10 text-xs text-slate-400">
            {activeSection} control telemetry active and monitoring.
          </div>
        )}
      </div>
    </div>
  );
}
