import Link from "next/link";
import { Droplets, ShieldCheck, Activity, Globe, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <span>AquaOne</span>
            </div>
            <p className="text-slate-400 text-xs">
              AI-Powered Citizen Stream & One Health Intelligence Platform. Unifying citizen science, AI validation, predictive analytics, and digital health standards.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>FHIR R4 & REST Interoperable</span>
            </div>
          </div>

          {/* Core Modules 1 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-2.5">Platform Modules</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/assess" className="hover:text-cyan-300">Smart Assessment Wizard</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-300">Stream Health Dashboard</Link></li>
              <li><Link href="/observations" className="hover:text-cyan-300">Observation Provenance Logs</Link></li>
              <li><Link href="/streams" className="hover:text-cyan-300">Monitored Stream Directory</Link></li>
              <li><Link href="/map" className="hover:text-cyan-300">GIS Spatial Map</Link></li>
              <li><Link href="/ai-review" className="hover:text-cyan-300">AquaAI Expert Review</Link></li>
            </ul>
          </div>

          {/* Core Modules 2 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-2.5">Intelligence & Community</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/predictions" className="hover:text-cyan-300">AquaPredict Risk Engine</Link></li>
              <li><Link href="/alerts" className="hover:text-cyan-300">Early Warning Risk Alerts</Link></li>
              <li><Link href="/stories" className="hover:text-cyan-300">AquaStory Stream Narrative</Link></li>
              <li><Link href="/learn" className="hover:text-cyan-300">Education & Micro-learning</Link></li>
              <li><Link href="/challenges" className="hover:text-cyan-300">Stream Guardian Missions</Link></li>
              <li><Link href="/leaderboard" className="hover:text-cyan-300">Global Leaderboard</Link></li>
            </ul>
          </div>

          {/* Interop & Admin */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-2.5">Interoperability & Admin</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/one-health" className="hover:text-cyan-300">One Health Matrix</Link></li>
              <li><Link href="/interop" className="hover:text-cyan-300">FHIR R4 JSON & REST API</Link></li>
              <li><Link href="/reports" className="hover:text-cyan-300">Report Export Center</Link></li>
              <li><Link href="/demo" className="hover:text-cyan-300">Automated 24-Step Demo</Link></li>
              <li><Link href="/#features" className="hover:text-cyan-300">Feature Overview</Link></li>
              <li><Link href="/admin" className="hover:text-cyan-300">Admin Control Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>© 2026 AquaOne Platform. Observe. Validate. Understand. Predict. Protect.</div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
            <Link href="/login" className="hover:text-cyan-400">Sign In</Link>
            <Link href="/register" className="hover:text-cyan-400">Register</Link>
            <Link href="/profile" className="hover:text-cyan-400">Profile</Link>
            <Link href="/settings" className="hover:text-cyan-400">Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
