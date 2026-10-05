"use client";

import { useState, useEffect } from "react";
import { BookOpen, CheckCircle2, Award, Sparkles, HelpCircle, X, ExternalLink, ChevronRight } from "lucide-react";

interface EducationCard {
  id: number;
  title: string;
  domain: string;
  icon: string;
  summary: string;
  action: string;
  source: string;
  relevance_trigger: string;
}

interface QuizModule {
  id: string;
  category: string;
  title: string;
  desc: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

const QUIZ_MODULES: QuizModule[] = [
  {
    id: "wq1",
    category: "Water Quality",
    title: "Understanding Turbidity & NTU Standards",
    desc: "Learn what causes cloudy water, how NTU (Nephelometric Turbidity Units) are measured, and how turbidity impacts aquatic life and disease risk.",
    quiz: {
      question: "What does a turbidity reading above 25 NTU generally indicate in a stream?",
      options: ["High water clarity", "Elevated suspended solids & silt runoff", "Excess dissolved oxygen", "Free-flowing gravel bed"],
      correct: 1,
      explanation: "NTU above 25 indicates significant suspended sediment or organic matter — reducing light penetration and UV disinfection, often signaling upstream erosion or sewage discharge."
    },
  },
  {
    id: "bio1",
    category: "Biodiversity",
    title: "Macroinvertebrates as Stream Health Bio-indicators",
    desc: "Mayfly larvae, stoneflies, and caddisflies thrive only in clean, well-oxygenated water. Counting these organisms provides a real-time biological water quality index.",
    quiz: {
      question: "Which organism is the MOST sensitive bioindicator of good water quality?",
      options: ["Mayfly larva (Ephemeroptera)", "Blackfly larva (Simuliidae)", "Bloodworm (Chironomidae)", "Leech (Hirudinea)"],
      correct: 0,
      explanation: "Mayfly larvae are EPT (Ephemeroptera-Plecoptera-Trichoptera) organisms that cannot tolerate organic pollution. Their presence indicates clean, oxygenated water meeting WHO ecological standards."
    },
  },
  {
    id: "oh1",
    category: "One Health",
    title: "Environmental–Human Health Bridge",
    desc: "Explore how contaminated waterways spread disease through livestock and human food chains — the One Health interconnection between ecosystem, animal, and human wellbeing.",
    quiz: {
      question: "What LOINC code is used to standardize water turbidity data in FHIR R4 health records?",
      options: ["72109-2", "10043-1", "55432-8", "99081-0"],
      correct: 0,
      explanation: "LOINC code 72109-2 (Water Turbidity) enables citizen science water data to be exchanged with municipal epidemiology dashboards via HL7 FHIR R4 — the core of the AquaOne interoperability layer."
    },
  },
  {
    id: "eco1",
    category: "Ecosystem",
    title: "Riparian Buffers & Flood Resilience",
    desc: "Native trees and grasses along stream banks filter runoff, prevent erosion, shade the channel to control algae, and slow floodwaters — providing multi-layered ecosystem services.",
    quiz: {
      question: "Which riparian buffer width is generally sufficient to filter agricultural runoff sediment before it reaches the stream?",
      options: ["2 meters", "5–10 meters", "15–30 meters", "1 meter"],
      correct: 2,
      explanation: "A minimum 15–30m buffer of native vegetation intercepts 85–95% of silt and nitrate runoff. Narrower buffers provide minimal filtration effectiveness under heavy monsoon rainfall."
    },
  },
  {
    id: "chem1",
    category: "Water Chemistry",
    title: "pH, Dissolved Oxygen & Aquatic Life Thresholds",
    desc: "Learn the key chemical parameters that govern aquatic survival — pH range, oxygen saturation curves, and temperature effects on stream metabolism.",
    quiz: {
      question: "At what dissolved oxygen (DO) level do most freshwater fish begin experiencing acute stress?",
      options: ["Below 8 mg/L", "Below 6 mg/L", "Below 4 mg/L", "Below 2 mg/L"],
      correct: 2,
      explanation: "Below 4 mg/L dissolved oxygen, most fish experience acute hypoxic stress and begin moving away. Below 2 mg/L triggers mass mortality events — often caused by algae bloom decomposition overnight."
    },
  },
];

export default function LearnPage() {
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, number>>({});
  const [wrongAnswers, setWrongAnswers] = useState<Record<string, boolean>>({});
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [educationCards, setEducationCards] = useState<EducationCard[]>([]);
  const [activeTab, setActiveTab] = useState<"modules" | "onehealth">("modules");

  useEffect(() => {
    fetch("/education_cards.json")
      .then(res => res.json())
      .then(data => setEducationCards(data))
      .catch(err => console.error("Error loading education cards:", err));
  }, []);

  const handleQuizAnswer = (moduleId: string, selectedIdx: number, correctIdx: number) => {
    if (completedQuizzes[moduleId] !== undefined) return; // already answered
    if (selectedIdx === correctIdx) {
      setCompletedQuizzes(prev => ({ ...prev, [moduleId]: selectedIdx }));
      setWrongAnswers(prev => { const c = { ...prev }; delete c[moduleId]; return c; });
    } else {
      setWrongAnswers(prev => ({ ...prev, [moduleId]: true }));
    }
  };

  const totalCompleted = Object.keys(completedQuizzes).length;
  const xpEarned = totalCompleted * 15;

  const domainColor: Record<string, string> = {
    "Environmental → Human": "from-red-500/20 to-orange-500/20 border-red-500/40 text-red-300",
    "Environmental → Animal": "from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300",
    "Environmental → Animal → Human": "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
    "Environmental → Environment": "from-emerald-500/20 to-green-500/20 border-emerald-500/40 text-emerald-300",
    "Environmental → Animal/Environment": "from-teal-500/20 to-cyan-500/20 border-teal-500/40 text-teal-300",
    "Environmental → Human/Community": "from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300",
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-3">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Education & One Health Micro-learning</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">AquaOne Education Center</h1>
        <p className="text-sm text-gray-400 mb-4">
          Master citizen science stream monitoring, water chemistry, biodiversity assessment, and One Health ecosystem principles.
        </p>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(totalCompleted / QUIZ_MODULES.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap">
            <span className="text-cyan-400 font-bold">{totalCompleted}</span>/{QUIZ_MODULES.length} quizzes •{" "}
            <span className="text-emerald-400 font-bold">+{xpEarned} XP</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("modules")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${
            activeTab === "modules"
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          📚 Learning Modules ({QUIZ_MODULES.length})
        </button>
        <button
          onClick={() => setActiveTab("onehealth")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${
            activeTab === "onehealth"
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          🌍 One Health Cards ({educationCards.length})
        </button>
      </div>

      {/* Learning Modules Tab */}
      {activeTab === "modules" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {QUIZ_MODULES.map((mod) => {
            const isDone = completedQuizzes[mod.id] !== undefined;
            const isWrong = wrongAnswers[mod.id];
            return (
              <div
                key={mod.id}
                className={`bg-gray-900/60 backdrop-blur-md rounded-2xl border p-5 space-y-4 flex flex-col transition-all ${
                  isDone ? "border-emerald-500/50 shadow-lg shadow-emerald-500/5" : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {mod.category}
                    </span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +15 XP
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{mod.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{mod.desc}</p>
                </div>

                {/* Quiz */}
                <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Quick Quiz</div>
                  <p className="text-xs text-gray-200 font-medium leading-relaxed">{mod.quiz.question}</p>
                  
                  <div className="space-y-1.5">
                    {mod.quiz.options.map((opt, oIdx) => {
                      const isSelected = completedQuizzes[mod.id] === oIdx;
                      const isCorrect = isDone && oIdx === mod.quiz.correct;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleQuizAnswer(mod.id, oIdx, mod.quiz.correct)}
                          disabled={isDone}
                          className={`w-full text-left p-2.5 rounded-lg border text-[11px] transition flex items-center justify-between min-h-[36px] ${
                            isCorrect
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold"
                              : isSelected
                              ? "bg-red-500/20 border-red-500/40 text-red-300"
                              : isDone
                              ? "opacity-50 bg-gray-900 border-gray-800 text-gray-500"
                              : "bg-gray-900 border-gray-800 hover:border-cyan-500/40 text-gray-300 hover:text-white"
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  {isWrong && !isDone && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[11px] text-red-300">
                      ⚠️ Not quite right — try again! Each answer helps you understand stream ecology better.
                    </div>
                  )}

                  {isDone && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300">
                      ✅ Correct! {mod.quiz.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* One Health Cards Tab (Feature 4.2) */}
      {activeTab === "onehealth" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            These 10 evidence-based One Health cards explain how freshwater ecosystems connect to animal and human health. Click any card to expand full details and recommended actions.
          </p>
          {educationCards.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">Loading One Health cards...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationCards.map((card) => {
                const colorCls = domainColor[card.domain] || "from-gray-700/20 to-gray-800/20 border-gray-700 text-gray-300";
                const isExpanded = expandedCard === card.id;
                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border bg-gradient-to-br ${colorCls} p-5 space-y-3 transition-all cursor-pointer`}
                    onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{card.icon}</span>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                            {card.domain}
                          </div>
                          <h3 className="text-sm font-bold text-white leading-tight">{card.title}</h3>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 opacity-60 transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">{card.summary}</p>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-white/10 animate-in fade-in duration-200">
                        <div className="p-3 bg-black/30 rounded-xl space-y-1.5">
                          <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                            🏃 Recommended Community Action
                          </div>
                          <p className="text-xs text-gray-200 leading-relaxed">{card.action}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">Source: {card.source}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
