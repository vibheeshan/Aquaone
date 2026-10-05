"use client";

import { useState } from "react";
import { Settings, Bell, Lock, Shield, Globe, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white">Platform Settings</h1>
        <p className="text-xs text-slate-400">Configure notifications, security, and interface language preferences.</p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            Notification Preferences
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Early Warning Risk Alerts</div>
                <div className="text-[10px] text-slate-400">Email & push notifications when turbidity or pollution risk spikes</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-cyan-500" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Community Challenge Reminders</div>
                <div className="text-[10px] text-slate-400">Daily/weekly streak reminders for monitored streams</div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-cyan-500" />
            </label>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Localization
          </h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Language</label>
            <select className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs">
              <option>English</option>
              <option>Tamil (தமிழ்)</option>
              <option>Spanish (Español)</option>
              <option>Hindi (हिंदी)</option>
            </select>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
