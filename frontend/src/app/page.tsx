"use client";

import Link from "next/link";
import { 
  Droplets, ShieldCheck, Activity, Sparkles, ArrowRight, MapPin, 
  BookOpen, Trophy, ShieldAlert, Layers, HeartPulse, Brain,
  Globe, Eye, Zap, Target, Award, ArrowDown, CheckCircle2,
  Cpu, Users, Shield, FileText, BarChart3, Database, Workflow, HelpCircle
} from "lucide-react";

export default function LandingPage() {
  const problems = [
    {
      title: "Problem 1 — Difficult Citizen Assessment",
      desc: "Traditional environmental assessment tools can be complex, technical, and difficult for ordinary citizens to use.",
      solution: "Smart Stream Guide simplifies data logging into intuitive visual Q&A.",
      icon: Droplets,
      color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-400"
    },
    {
      title: "Problem 2 — Raw Data Without Insights",
      desc: "Collected stream observations are hard to interpret and do not easily reveal health trends, spatial patterns, or degradation risks.",
      solution: "Stream Intelligence converts measurements into a 0–100 Health Score, GIS spatial map, and trends.",
      icon: Activity,
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
    },
    {
      title: "Problem 3 — Inconsistent Citizen Data",
      desc: "Citizen observations may contain human errors, photo ambiguity, or inconsistent values requiring validation.",
      solution: "AquaAI Multi-Agent Pipeline checks anomalies, analyzes photos, and assists human expert reviewers.",
      icon: Brain,
      color: "border-purple-500/40 bg-purple-950/20 text-purple-400"
    },
    {
      title: "Problem 4 — Low Environmental Awareness",
      desc: "Environmental data is often presented as raw spreadsheets and scientific metrics that fail to engage the public.",
      solution: "AquaStory converts complex water data into interactive timeline stories, infographics, and quizzes.",
      icon: BookOpen,
      color: "border-amber-500/40 bg-amber-950/20 text-amber-400"
    },
    {
      title: "Problem 5 — Low Long-Term Participation",
      desc: "Volunteers may log data once but drop off without continuous recognition, community goals, or rewards.",
      solution: "Stream Guardian rewards quality contributions with XP points, achievement badges, levels, and missions.",
      icon: Trophy,
      color: "border-yellow-500/40 bg-yellow-950/20 text-yellow-400"
    },
    {
      title: "Problem 6 — Lack of Early Warning",
      desc: "Environmental degradation is often noticed only after serious damage occurs due to missing predictive tools.",
      solution: "AquaPredict ML Engine models future water quality risk probabilities and automated early warning alerts.",
      icon: ShieldAlert,
      color: "border-rose-500/40 bg-rose-950/20 text-rose-400"
    },
    {
      title: "Problem 7 — Fragmented Systems",
      desc: "Environmental water quality data and public health records exist in isolated, non-interoperable silos.",
      solution: "One Health Bridge connects stream ecology data with HL7 FHIR R4 standard health data objects.",
      icon: Layers,
      color: "border-blue-500/40 bg-blue-950/20 text-blue-400"
    }
  ];

  const solutions = [
    { title: "Smart Stream Guide", buttonLabel: "Explore Smart Stream Guide", desc: "Citizen-friendly visual observation wizard with photo & GPS upload.", problem: "Solves complex citizen tools", href: "/assess", color: "from-cyan-500 to-blue-600" },
    { title: "Stream Intelligence", buttonLabel: "Explore Stream Intelligence", desc: "Transparent 0–100 Health Score, interactive GIS spatial map & trend analytics.", problem: "Solves raw data confusion", href: "/insights", color: "from-emerald-500 to-teal-600" },
    { title: "AquaAI Engine", buttonLabel: "Explore AquaAI Engine", desc: "Multi-modal vision analysis, statistical anomaly detection & Human-in-the-Loop review.", problem: "Solves inconsistent observations", href: "/ai-review", color: "from-purple-500 to-indigo-600" },
    { title: "AquaStory Narratives", buttonLabel: "Explore AquaStory Narratives", desc: "Automated narrative generation, environmental timelines & learning quizzes.", problem: "Solves low public awareness", href: "/stories", color: "from-amber-500 to-orange-600" },
    { title: "Stream Guardian", buttonLabel: "Explore Stream Guardian", desc: "Gamified XP points, 5-tier guardian progression, badges & stream missions.", problem: "Solves volunteer drop-off", href: "/community", color: "from-yellow-500 to-amber-600" },
    { title: "AquaPredict Risk", buttonLabel: "Explore AquaPredict Risk", desc: "ML risk forecasting engine predicting water quality risks & early warnings.", problem: "Solves lack of early warning", href: "/predictions", color: "from-rose-500 to-red-600" },
    { title: "One Health Bridge", buttonLabel: "Explore One Health Bridge", desc: "Interoperable REST APIs and HL7 FHIR R4 standard JSON observation exporter.", problem: "Solves fragmented data silos", href: "/one-health", color: "from-blue-500 to-cyan-600" },
  ];

  const workflowSteps = [
    { step: "01", label: "Observe", desc: "Citizen collects stream Q&A, photos & GPS tags", icon: Eye, color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/30" },
    { step: "02", label: "Validate", desc: "AquaAI checks anomalies & assists human review", icon: Brain, color: "text-purple-400 border-purple-500/40 bg-purple-950/30" },
    { step: "03", label: "Understand", desc: "AquaOne converts data into Health Scores & GIS maps", icon: Activity, color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/30" },
    { step: "04", label: "Predict", desc: "AquaPredict ML forecasts future degradation risk", icon: Zap, color: "text-amber-400 border-amber-500/40 bg-amber-950/30" },
    { step: "05", label: "Alert", desc: "Automated early warning notifications trigger", icon: ShieldAlert, color: "text-rose-400 border-rose-500/40 bg-rose-950/30" },
    { step: "06", label: "Educate", desc: "AquaStory generates narrative timelines & quizzes", icon: BookOpen, color: "text-blue-400 border-blue-500/40 bg-blue-950/30" },
    { step: "07", label: "Engage", desc: "Community challenges, XP points & badges awarded", icon: Trophy, color: "text-yellow-400 border-yellow-500/40 bg-yellow-950/30" },
    { step: "08", label: "Integrate", desc: "One Health Bridge exports FHIR R4 standard JSON", icon: Layers, color: "text-teal-400 border-teal-500/40 bg-teal-950/30" },
  ];

  const features = [
    { title: "Citizen Science UX", desc: "Intuitive, non-technical visual Q&A format for stream logging.", icon: Droplets },
    { title: "Smart Assessment", desc: "Capture GPS coordinates, stream clarity, odor, and photo evidence.", icon: MapPin },
    { title: "AI Validation", desc: "Computer vision & statistical anomaly scoring for data integrity.", icon: Cpu },
    { title: "Stream Scoring", desc: "Transparent 0–100 Stream Health Index based on multi-parameter data.", icon: BarChart3 },
    { title: "GIS Mapping", desc: "Interactive spatial map displaying stream nodes and observation markers.", icon: Globe },
    { title: "Data Analytics", desc: "Longitudinal trends, historical comparisons, and parameter filters.", icon: Activity },
    { title: "Risk Prediction", desc: "ML models predicting pollution risks and pathogen outbreak probabilities.", icon: Zap },
    { title: "Early Alerts", desc: "Threshold-based early warning notifications for rapid response.", icon: ShieldAlert },
    { title: "Storytelling", desc: "Automated stream evolution stories and educational quizzes.", icon: BookOpen },
    { title: "Community Missions", desc: "Active guardian challenges encouraging repeat participation.", icon: Users },
    { title: "Gamification", desc: "XP points, badges, global leaderboards, and guardian levels.", icon: Trophy },
    { title: "One Health Matrix", desc: "Correlates water quality with livestock vectors and human risks.", icon: HeartPulse },
    { title: "FHIR Interoperability", desc: "Exports HL7 FHIR R4 standard Observation & Risk JSON payloads.", icon: Database },
  ];

  return (
    <div className="space-y-24 py-6 max-w-6xl mx-auto font-sans">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-16 border border-cyan-500/30 text-center space-y-8 shadow-2xl">
        <div className="absolute -top-36 -left-36 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold tracking-wide">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>ONE UNIFIED ENVIRONMENTAL INTELLIGENCE PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          AquaOne — AI-Powered Citizen Stream &amp; One Health Intelligence Platform
        </h1>
        
        <p className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 italic max-w-2xl mx-auto">
          &quot;Observe. Validate. Understand. Predict. Protect.&quot;
        </p>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          AquaOne connects citizen stream science, multi-agent AI validation, stream intelligence analytics, predictive risk forecasting, community gamification, and HL7 FHIR digital health standards into ONE unified ecosystem.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#solution"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition flex items-center space-x-2"
          >
            <Activity className="w-5 h-5" />
            <span>Explore AquaOne</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <a
            href="#how-it-works"
            className="px-7 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition flex items-center space-x-2"
          >
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>How It Works</span>
          </a>
        </div>
      </section>

      {/* 2. PURPOSE SECTION */}
      <section id="purpose" className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>OUR CORE PURPOSE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Why AquaOne?</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Empowering communities to protect freshwater streams through technology, AI, and health integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-white">Simplify Citizen Stream Monitoring</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Replace complex chemical terminology with guided visual questions so any citizen can contribute quality environmental data.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-white">Turn Observations into Actionable Insights</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Convert raw community inputs into transparent 0–100 Stream Health Scores, spatial GIS maps, and trend analytics.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-white">AI-Supported Data Validation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Utilize multi-agent computer vision and statistical anomaly detection to support human expert verification without overwriting raw data.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="text-base font-bold text-white">Early Environmental Risk Detection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Forecast water deterioration and pathogen outbreak risks using ML predictive models before clinical public health surges occur.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              05
            </div>
            <h3 className="text-base font-bold text-white">Continuous Community Engagement</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reward ongoing participation through Stream Guardian challenges, levels, achievement badges, and global leaderboards.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              06
            </div>
            <h3 className="text-base font-bold text-white">One Health &amp; Digital Health Interoperability</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect stream water quality with animal vectors and human public health outcomes through HL7 FHIR R4 standard JSON exports.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PROBLEMS SECTION */}
      <section id="problems" className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/50 text-red-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>REAL-WORLD CHALLENGES</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">The Problems We Solve</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Addressing 7 critical bottlenecks in stream monitoring and public health response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className={`p-6 rounded-2xl glass-card border space-y-3 ${p.color}`}>
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                <div className="pt-2 border-t border-slate-800/60 text-xs font-medium text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{p.solution}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SOLUTION SECTION */}
      <section id="solution" className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>UNIFIED PLATFORM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Our Solution</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Seven connected capabilities working as ONE intelligent AquaOne ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s, idx) => (
            <Link
              key={idx}
              href={s.href}
              className="group p-6 rounded-2xl glass-card border border-slate-800 glass-card-hover flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${s.color} text-white`}>
                    {s.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{s.problem}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
              <div className="flex items-center text-xs font-semibold text-cyan-400 space-x-1 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-800/60">
                <span>{s.buttonLabel} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold">
            <Workflow className="w-3.5 h-3.5" />
            <span>CONNECTED WORKFLOW JOURNEY</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">How It Works</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Observe → Validate → Understand → Predict → Act
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${s.color}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">Step {s.step}</span>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{s.label}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FEATURES SECTION */}
      <section id="features" className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">AquaOne Features</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Comprehensive tools designed for citizens, researchers, and public health officials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="p-4 rounded-xl glass-card border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{f.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-1">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. IMPACT SECTION */}
      <section id="impact" className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>MEASURABLE OUTCOMES</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Impact</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Creating lasting positive change for citizens, ecosystems, and public health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-cyan-400">Citizen Impact</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lowers barrier to entry for non-technical volunteers, provides immediate feedback, and empowers citizens to become active environmental stewards.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-teal-400">Environmental Impact</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enables continuous stream monitoring, early detection of pollution hotspots, and data-driven evidence for river restoration initiatives.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-yellow-400">Community Impact</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fosters sustained community engagement through monitoring challenges, transparent leaderboards, and shared local water pride.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-emerald-400">One Health Impact</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bridges environmental water measurements with animal vector health and human epidemiological safety using HL7 FHIR R4 standards.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FEASIBILITY SECTION */}
      <section className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Why AquaOne Is Feasible</h2>
          <p className="text-xs text-slate-400">Built using a production-proven, scalable open-technology stack.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-cyan-400">Next.js + React 19</div>
            <div className="text-[11px] text-slate-400">Frontend UI &amp; PWA</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-teal-400">FastAPI + Python</div>
            <div className="text-[11px] text-slate-400">REST API &amp; SQLAlchemy</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-purple-400">AquaAI Multi-Agent</div>
            <div className="text-[11px] text-slate-400">Vision &amp; Anomaly Check</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-emerald-400">HL7 FHIR R4</div>
            <div className="text-[11px] text-slate-400">Digital Health Schema</div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="p-8 sm:p-14 rounded-3xl glass-card border border-cyan-500/30 text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white">Be Part of the Stream Intelligence Network</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Observe your environment. Understand the change. Help build healthier ecosystems and protected communities.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="#solution"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-sm hover:scale-105 transition shadow-lg shadow-cyan-500/25"
          >
            Explore AquaOne
          </a>
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-sm transition"
          >
            Create Account
          </Link>
        </div>
      </section>

    </div>
  );
}
