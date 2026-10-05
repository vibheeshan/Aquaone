"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplets, ShieldCheck, Check, ArrowRight, Bell, Globe, Compass, HeartHandshake } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    role: "Citizen Science Observer",
    primaryArea: "Urban Stream Monitoring",
    monitorStream: "Yes, I live near a stream/river",
    language: "English",
    notifications: true,
    interests: ["Water Clarity", "Pollution Hotspots", "One Health Alerts"],
  });

  const handleInterestToggle = (item: string) => {
    setAnswers((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== item) : [...prev.interests, item],
      };
    });
  };

  const finishOnboarding = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 text-sm">
              {step}/3
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Welcome to AquaOne</h2>
              <p className="text-[11px] text-slate-400">Personalize your stream monitoring profile</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? "w-6 bg-cyan-400" : s < step ? "w-2 bg-emerald-400" : "w-2 bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Role & Primary Area */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              1. What is your primary objective on AquaOne?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Citizen Science Observer", desc: "Log water observations & photos" },
                { title: "Environmental Researcher", desc: "Analyze trend data & export datasets" },
                { title: "Community Guardian", desc: "Organize stream cleanup challenges" },
                { title: "One Health Practitioner", desc: "Monitor zoonotic & waterborne health risks" },
              ].map((opt) => (
                <div
                  key={opt.title}
                  onClick={() => setAnswers({ ...answers, role: opt.title })}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    answers.role === opt.title
                      ? "bg-cyan-950/40 border-cyan-500/60 text-white"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-white text-xs">{opt.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-slate-300 font-semibold mb-1">Do you plan to regularly monitor a specific stream?</label>
              <select
                value={answers.monitorStream}
                onChange={(e) => setAnswers({ ...answers, monitorStream: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="Yes, I live near a stream/river">Yes, I live near a stream/river</option>
                <option value="Yes, as part of a school/community group">Yes, as part of a school or community group</option>
                <option value="Occasionally when travelling">Occasionally when travelling</option>
                <option value="No, just browsing data">No, just browsing data</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Language & Notifications */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              2. Preferences & Notifications
            </h3>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Interface Language</label>
              <select
                value={answers.language}
                onChange={(e) => setAnswers({ ...answers, language: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    Early Warning & Pollution Alerts
                  </div>
                  <div className="text-[11px] text-slate-400">Receive alerts when risk increases in your area</div>
                </div>
                <input
                  type="checkbox"
                  checked={answers.notifications}
                  onChange={(e) => setAnswers({ ...answers, notifications: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests & Finish */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-cyan-400" />
              3. Select your topics of interest
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                "Water Clarity & Turbidity",
                "Plastic & Solid Waste",
                "Aquatic Biodiversity",
                "ML Risk Predictions",
                "One Health Disease Risk",
                "Community Challenges",
                "FHIR Digital Health APIs",
                "AquaStory Cards",
              ].map((interest) => {
                const active = answers.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      active
                        ? "bg-cyan-950/60 border-cyan-500/80 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-medium text-[11px]">{interest}</span>
                    {active && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-bold">
              🎉 Your AquaOne profile is ready! You are enrolled as {answers.role}.
            </div>
          </div>
        )}

        {/* Bottom Nav Buttons */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={finishOnboarding}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 animate-pulse"
            >
              <span>Launch AquaOne Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
