"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Droplets, ShieldCheck, Cpu, Globe, HeartHandshake, 
  Activity, Sparkles, CheckCircle2, ArrowRight, Zap, Target, BookOpen
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
            <Droplets className="w-4 h-4" />
            <span>Observe • Validate • Understand • Predict • Protect</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">AquaOne</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg">
            AquaOne is a production-grade, AI-powered Citizen Stream & One Health Intelligence Platform that bridges human community observations with multi-modal AI validation, epidemiological forecasting, and FHIR R4 global health interoperability.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Citizen Science UX</h3>
            <p className="text-sm text-slate-300">
              Empowers stream guardians, local communities, and field researchers with low-friction stream data logging, photo analysis, and verifiable audit trails.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Modal AI Engine</h3>
            <p className="text-sm text-slate-300">
              Integrates vision recognition, anomaly scoring, automated narrative synthesis (AquaStory), and predictive disease outbreak risk models.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">One Health Intelligence</h3>
            <p className="text-sm text-slate-300">
              Connects stream water health directly to animal vectors and human public health outcomes, exporting HL7 FHIR R4 standard data objects.
            </p>
          </div>
        </div>

        {/* The One Health Vision */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">The One Health Triad Paradigm</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Environmental water quality directly dictates livestock and wildlife health, which in turn impacts human waterborne disease exposure. AquaOne correlates stream pH, turbidity, dissolved oxygen, and microbial indicators with regional disease outbreaks, providing early intervention signals before clinical public health surges occur.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-cyan-400 font-semibold text-sm">1. Environmental Stream Health</div>
              <p className="text-xs text-slate-400">pH balance, turbidity, nitrates, flow rate, heavy metal risk index.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-teal-400 font-semibold text-sm">2. Animal Vector & Ecosystem</div>
              <p className="text-xs text-slate-400">Livestock watering contamination, macroinvertebrate diversity, wildlife risk.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="text-emerald-400 font-semibold text-sm">3. Human Community Protection</div>
              <p className="text-xs text-slate-400">Waterborne pathogen early warning, recreational swimming safety alerts.</p>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Production Tech Stack</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Frontend</span>
              <div className="text-sm font-bold text-slate-200">Next.js 16 + React 19</div>
              <p className="text-xs text-slate-400">Tailwind CSS 4, Lucide React, Recharts & Leaflet</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Backend API</span>
              <div className="text-sm font-bold text-slate-200">FastAPI + Python 3.12</div>
              <p className="text-xs text-slate-400">SQLAlchemy, Pydantic v2, RESTful OpenAPI</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">AI & ML Pipelines</span>
              <div className="text-sm font-bold text-slate-200">AquaAI Multi-Agent Engine</div>
              <p className="text-xs text-slate-400">Computer Vision, Isolation Forest, Story Synthesizer</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Interoperability</span>
              <div className="text-sm font-bold text-slate-200">HL7 FHIR R4</div>
              <p className="text-xs text-slate-400">Observation & Risk Assessment standard JSON export</p>
            </div>
          </div>
        </div>

        {/* CTA Footer Section */}
        <div className="glass-card p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Ready to Explore AquaOne?</h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Try our interactive 24-step end-to-end automated demo pipeline or check the challenge track alignment mapping.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Run Automated 24-Step Demo</span>
            </Link>
            <Link
              href="/track-mapping"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              <Target className="w-4 h-4" />
              <span>View Track Mapping Matrix</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
