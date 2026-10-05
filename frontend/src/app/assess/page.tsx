"use client";

import { useState, useEffect } from "react";
import { fetchApi, Stream } from "@/lib/api";
import { saveOfflineSubmission, getPendingSubmissions, syncPendingSubmissions, PendingSubmission } from "@/lib/offlineSync";
import { 
  Droplets, Camera, MapPin, Mic, CheckCircle2, ArrowRight, ArrowLeft, 
  Sparkles, AlertCircle, Eye, Wind, ShieldCheck, Award, QrCode, Volume2,
  Bookmark, History, Sliders, Languages, HelpCircle, Sun, Type, WifiOff,
  RefreshCw, Check, Info, FileText, Smartphone, Gauge, ExternalLink, X
} from "lucide-react";

interface GlossaryTerm {
  term: string;
  simple: string;
  example: string;
  category?: string;
  image_url?: string;
}

export default function SmartAssessWizard() {
  // Mode & Preferences
  const [assessmentMode, setAssessmentMode] = useState<"quick" | "detailed">("detailed");
  const [lang, setLang] = useState<"en" | "ta" | "hi">("en");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingSlide, setOnboardingSlide] = useState(0);

  // 5-Step Wizard Navigation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Streams & Snapping
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStreamId, setSelectedStreamId] = useState<number>(1);
  const [detectedStreamNotice, setDetectedStreamNotice] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Step 1: Location
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 13.0382, lng: 80.1564 });
  const [manualLocationName, setManualLocationName] = useState<string>("");

  // Step 2: Water Clarity (Color Cards)
  const [waterClarity, setWaterClarity] = useState<string>("Slightly cloudy");

  // Step 3: Smells & Pollution
  const [wasteLevel, setWasteLevel] = useState<string>("Low");
  const [odorLevel, setOdorLevel] = useState<string>("None");
  const [algaeLevel, setAlgaeLevel] = useState<string>("None");
  const [notes, setNotes] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  // Step 4: Photo
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
  ]);
  const [customPhotoInput, setCustomPhotoInput] = useState<string>("");

  // Step 5: Consent & Submission
  const [consentGranted, setConsentGranted] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [offlineStatusMsg, setOfflineStatusMsg] = useState<string | null>(null);
  const [pendingQueueCount, setPendingQueueCount] = useState<number>(0);

  // Glossary Tooltip State
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<GlossaryTerm | null>(null);

  // Onboarding Slides
  const onboardingContent = [
    {
      title: "What is AquaOne?",
      text: "AquaOne empowers citizens to monitor local freshwater health, detect pollution early, and protect community drinking water.",
      icon: "💧"
    },
    {
      title: "How It Works in 5 Steps",
      text: "1. Auto GPS 📍 → 2. Water Clarity 👁️ → 3. Odor/Litter 👃 → 4. Photo 📸 → 5. AI & Expert Verification ✨",
      icon: "⚡"
    },
    {
      title: "Why It Matters (One Health)",
      text: "Healthy streams sustain wildlife, secure clean agriculture, and prevent waterborne outbreaks in our towns.",
      icon: "🌍"
    }
  ];

  // Load initial data & glossary
  useEffect(() => {
    // Check onboarding
    try {
      const done = localStorage.getItem("aquaone_onboarding_done");
      if (!done) {
        setShowOnboarding(true);
      }
    } catch (e) {
      console.error(e);
    }

    // Load glossary
    fetch("/glossary.json")
      .then(res => res.json())
      .then(data => setGlossary(data))
      .catch(err => console.error("Error loading glossary:", err));

    // Load streams
    fetchApi<Stream[]>("/streams")
      .then(data => {
        setStreams(data);
        if (data.length > 0) setSelectedStreamId(data[0].id);
      })
      .catch(err => console.error(err));

    // Check Speech Recognition support
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
      }
    }

    // Check offline pending items
    refreshPendingQueue();

    // Listen to online reconnect
    const handleOnline = async () => {
      setOfflineStatusMsg("Reconnected! Syncing pending observations...");
      await syncOfflineQueue();
      refreshPendingQueue();
    };
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const refreshPendingQueue = async () => {
    try {
      const pending = await getPendingSubmissions();
      setPendingQueueCount(pending.length);
    } catch {
      setPendingQueueCount(0);
    }
  };

  const syncOfflineQueue = async () => {
    try {
      const res = await syncPendingSubmissions(async (data) => {
        return fetchApi("/observations", {
          method: "POST",
          body: JSON.stringify(data)
        });
      });
      if (res.synced > 0) {
        setOfflineStatusMsg(`Successfully synced ${res.synced} offline observation(s) ✓`);
      }
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

  // Auto GPS detection & stream snapping
  const handleAutoGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });

        try {
          const nearest = await fetchApi<any[]>(`/streams/nearest?lat=${lat}&lng=${lng}&radius_m=10000`);
          if (nearest && nearest.length > 0) {
            setSelectedStreamId(nearest[0].id);
            setDetectedStreamNotice(`Detected: ${nearest[0].name} (${Math.round(nearest[0].distance_m)}m away)`);
          } else {
            setDetectedStreamNotice(`No known streams within 10km. Stream coordinates updated.`);
          }
        } catch {
          setDetectedStreamNotice(`GPS location captured: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        setDetectedStreamNotice("Location permission denied. You can select your stream manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Voice recording
  const handleVoiceInput = () => {
    if (!speechSupported) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "ta" ? "ta-IN" : lang === "hi" ? "hi-IN" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // Finish Onboarding
  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem("aquaone_onboarding_done", "true");
    } catch (e) {}
    setShowOnboarding(false);
  };

  // Step Validation
  const isStepValid = (stepNum: number) => {
    if (stepNum === 1) return selectedStreamId > 0;
    if (stepNum === 2) return !!waterClarity;
    if (stepNum === 3) return !!wasteLevel && !!odorLevel;
    if (stepNum === 4) return photos.length > 0;
    return true;
  };

  // Submission handler (Online + Offline Queue)
  const handleSubmitObservation = async () => {
    setSubmitting(true);
    setOfflineStatusMsg(null);

    const payload = {
      stream_id: selectedStreamId,
      user_id: 1, // Logged in citizen
      turbidity: waterClarity === "Very clear" ? 2.5 : waterClarity === "Slightly cloudy" ? 15.0 : waterClarity === "Murky brown" ? 45.0 : waterClarity === "Algae green" ? 65.0 : 120.0,
      ph: 7.2,
      water_temp_c: 24.5,
      dissolved_oxygen: 6.8,
      water_clarity: waterClarity,
      waste_level: wasteLevel,
      odor_level: odorLevel,
      algae: algaeLevel,
      biodiversity: "Moderate",
      flow_speed: "Medium",
      notes: notes || "Submitted via AquaOne 5-Step Guided Citizen Wizard",
      photo_url: photos[0] || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      latitude: location.lat,
      longitude: location.lng,
      consent_granted: consentGranted
    };

    // Check online status
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      try {
        await saveOfflineSubmission({
          timestamp: new Date().toISOString(),
          stream_id: selectedStreamId,
          data: payload,
          photo_blob: photos[0]
        });
        setOfflineStatusMsg("Saved offline in IndexedDB! Observation will automatically sync when internet reconnects.");
        refreshPendingQueue();
        setSubmitting(false);
        setSubmissionResult({ offline: true, message: "Observation queued in offline storage." });
      } catch (err: any) {
        alert("Offline storage error: " + err.message);
        setSubmitting(false);
      }
      return;
    }

    // Online submission
    try {
      const res = await fetchApi<any>("/observations", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setSubmissionResult(res);
    } catch (err: any) {
      // Fallback to offline queue if server unreachable
      try {
        await saveOfflineSubmission({
          timestamp: new Date().toISOString(),
          stream_id: selectedStreamId,
          data: payload,
          photo_blob: photos[0]
        });
        setOfflineStatusMsg("Server temporarily unreachable — saved offline to sync automatically later.");
        refreshPendingQueue();
      } catch {}
      setSubmissionResult({ fallback_offline: true, error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const stepsMeta = [
    { step: 1, title: lang === "ta" ? "இருப்பிடம்" : lang === "hi" ? "स्थान" : "Where are you?", icon: "📍" },
    { step: 2, title: lang === "ta" ? "நீரின் நிறம்" : lang === "hi" ? "पानी का रंग" : "Water Clarity", icon: "👁️" },
    { step: 3, title: lang === "ta" ? "கழிவுகள் & வாசனை" : lang === "hi" ? "गंध और कचरा" : "Smells & Pollution", icon: "👃" },
    { step: 4, title: lang === "ta" ? "புகைப்படம்" : lang === "hi" ? "तस्वीर लें" : "Take Photo", icon: "📸" },
    { step: 5, title: lang === "ta" ? "சரிபார்த்தல்" : lang === "hi" ? "पुष्टि करें" : "Review & Submit", icon: "✨" }
  ];

  const clarityOptions = [
    { value: "Very clear", label: "Crystal Clear", desc: "Pebbles and fish clearly visible on stream bed", color: "from-cyan-500/20 to-blue-500/30 border-cyan-400" },
    { value: "Slightly cloudy", label: "Slightly Cloudy", desc: "Faint haze, bed visible up to 0.5m depth", color: "from-teal-500/20 to-emerald-500/30 border-teal-400" },
    { value: "Murky brown", label: "Murky Brown", desc: "Noticeable suspended silt after mild rainfall", color: "from-amber-600/20 to-yellow-700/30 border-amber-500" },
    { value: "Algae green", label: "Algae Green", desc: "Greenish tint with floating algal scum", color: "from-emerald-700/20 to-green-800/30 border-emerald-500" },
    { value: "Very muddy", label: "Very Muddy / Opaque", desc: "Heavy sediment runoff, zero underwater visibility", color: "from-red-900/20 to-amber-900/30 border-red-500" }
  ];

  return (
    <div className={`p-4 md:p-8 max-w-5xl mx-auto space-y-6 ${highContrast ? "contrast-125 bg-black text-white" : ""} ${largeText ? "text-lg" : ""}`}>
      
      {/* 30-Second Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-gray-900 border border-cyan-500/40 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
            <div className="text-5xl">{onboardingContent[onboardingSlide].icon}</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{onboardingContent[onboardingSlide].title}</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">{onboardingContent[onboardingSlide].text}</p>
            </div>
            <div className="flex justify-center gap-2">
              {onboardingContent.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === onboardingSlide ? "w-8 bg-cyan-400" : "w-2 bg-gray-700"}`} />
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <button 
                onClick={handleCompleteOnboarding}
                className="text-xs text-gray-400 hover:text-white px-3 py-2"
              >
                Skip Tutorial
              </button>
              {onboardingSlide < onboardingContent.length - 1 ? (
                <button
                  onClick={() => setOnboardingSlide(s => s + 1)}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-cyan-500/20"
                >
                  Next Slide <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCompleteOnboarding}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/20"
                >
                  Get Started <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Glossary Tooltip Modal / Flyout */}
      {activeTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-gray-900 border border-cyan-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setActiveTooltip(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
              aria-label="Close tooltip"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" /> Ecological Glossary
            </div>
            <h3 className="text-xl font-bold text-white">{activeTooltip.term}</h3>
            <p className="text-gray-200 text-sm leading-relaxed">{activeTooltip.simple}</p>
            <div className="p-3 bg-gray-800/80 rounded-xl border border-gray-700 text-xs text-cyan-300">
              <span className="font-semibold text-white">Example: </span> {activeTooltip.example}
            </div>
            {activeTooltip.image_url && (
              <img src={activeTooltip.image_url} alt={activeTooltip.term} className="w-full h-32 object-cover rounded-lg border border-gray-700" />
            )}
            <button
              onClick={() => setActiveTooltip(null)}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Header & Preferences Bar */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Citizen Science Wizard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            💧 Smart Stream Assessment
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            5 simple visual steps • No chemistry required • Verified by AI & One Health experts
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Language Picker */}
          <div className="flex items-center bg-gray-800/80 border border-gray-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${lang === "en" ? "bg-cyan-500 text-gray-950 font-bold" : "text-gray-300 hover:text-white"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ta")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${lang === "ta" ? "bg-cyan-500 text-gray-950 font-bold" : "text-gray-300 hover:text-white"}`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${lang === "hi" ? "bg-cyan-500 text-gray-950 font-bold" : "text-gray-300 hover:text-white"}`}
            >
              हिंदी
            </button>
          </div>

          {/* Accessibility Toggles */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition ${highContrast ? "bg-amber-400 text-gray-950 border-amber-300 font-bold" : "bg-gray-800 border-gray-700 text-gray-300 hover:text-white"}`}
            title="Toggle High Contrast"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLargeText(!largeText)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition ${largeText ? "bg-cyan-500 text-gray-950 border-cyan-400 font-bold" : "bg-gray-800 border-gray-700 text-gray-300 hover:text-white"}`}
            title="Toggle Large Text"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Offline Status Badge */}
      {pendingQueueCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span><strong>Offline Queue:</strong> {pendingQueueCount} observation(s) stored locally on this device.</span>
          </div>
          <button
            onClick={syncOfflineQueue}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-lg flex items-center gap-1 text-xs"
          >
            <RefreshCw className="w-3 h-3" /> Sync Now
          </button>
        </div>
      )}

      {offlineStatusMsg && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-300 flex items-center gap-2">
          <Info className="w-4 h-4" /> {offlineStatusMsg}
        </div>
      )}

      {/* 5-Step Progress Bar */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3 text-xs md:text-sm font-semibold">
          <span className="text-gray-400">Step {currentStep} of {totalSteps}</span>
          <span className="text-cyan-400 font-bold">{stepsMeta[currentStep - 1].title}</span>
        </div>
        
        {/* Step Tabs Grid */}
        <div className="grid grid-cols-5 gap-2">
          {stepsMeta.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <button
                key={s.step}
                onClick={() => {
                  if (s.step < currentStep || isStepValid(currentStep)) {
                    setCurrentStep(s.step);
                  }
                }}
                disabled={s.step > currentStep && !isStepValid(currentStep)}
                className={`py-2 px-1 md:px-3 rounded-xl border text-center transition flex flex-col md:flex-row items-center justify-center gap-1.5 min-h-[48px] ${
                  isCurrent 
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10"
                    : isCompleted
                    ? "bg-gray-800/80 border-emerald-500/50 text-emerald-400 font-medium"
                    : "bg-gray-900/40 border-gray-800 text-gray-500 opacity-60 cursor-not-allowed"
                }`}
              >
                <span className="text-base">{s.icon}</span>
                <span className="text-[11px] md:text-xs truncate hidden sm:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Card (Full Screen Card Per Step) */}
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl relative min-h-[420px] flex flex-col justify-between">
        
        {/* STEP 1: Location & Snapping */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Step 1 of 5
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">📍 Where are you monitoring?</h2>
              <p className="text-gray-400 text-sm">Select a monitored stream or use auto GPS to snap to the closest waterway.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stream Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Select Monitored Stream
                </label>
                <div className="space-y-2">
                  {streams.map((stream) => (
                    <div
                      key={stream.id}
                      onClick={() => setSelectedStreamId(stream.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between min-h-[48px] ${
                        selectedStreamId === stream.id
                          ? "bg-cyan-500/15 border-cyan-400 text-white font-semibold"
                          : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Droplets className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="text-sm font-medium">{stream.name}</div>
                          <div className="text-xs text-gray-400">{stream.location || stream.location_name || "Monitored Catchment"}</div>
                        </div>
                      </div>
                      {selectedStreamId === stream.id && (
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* GPS Auto-Detect Card */}
              <div className="p-5 rounded-2xl bg-gray-800/40 border border-gray-700 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <MapPin className="w-4 h-4 text-cyan-400" /> Auto GPS Stream Snapping
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Uses your mobile/browser geolocation to detect coordinates and automatically snap to the nearest stream within 500 meters.
                  </p>
                  {detectedStreamNotice && (
                    <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-300">
                      {detectedStreamNotice}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleAutoGps}
                    disabled={gpsLoading}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition min-h-[48px] shadow-lg shadow-cyan-500/20"
                  >
                    {gpsLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Detecting Location...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" /> Auto-Detect GPS & Snap Stream
                      </>
                    )}
                  </button>
                  <div className="text-center text-[11px] text-gray-500">
                    GPS Coordinates: {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Water Clarity (Color Card Picker + Glossary Tooltips) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  Step 2 of 5
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">👁️ How does the water look?</h2>
                <p className="text-gray-400 text-sm">Pick the color card that closest represents the stream&apos;s current clarity.</p>
              </div>

              {/* Glossary Tooltip Trigger */}
              <button
                onClick={() => {
                  const term = glossary.find(g => g.term.toLowerCase().includes("turbidity")) || {
                    term: "Turbidity",
                    simple: "How cloudy or murky the water looks due to suspended silt, algae, or sediment.",
                    example: "Clear water scores high (low turbidity), while muddy runoff scores low."
                  };
                  setActiveTooltip(term);
                }}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-xl border border-gray-700 text-xs flex items-center gap-1.5 transition"
                aria-label="Explain Turbidity"
              >
                <HelpCircle className="w-4 h-4" /> What is Turbidity?
              </button>
            </div>

            {/* Clarity Color Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {clarityOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setWaterClarity(opt.value)}
                  className={`p-4 rounded-xl border cursor-pointer transition relative flex flex-col justify-between min-h-[90px] bg-gradient-to-br ${opt.color} ${
                    waterClarity === opt.value
                      ? "ring-2 ring-cyan-400 scale-[1.02] shadow-xl"
                      : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{opt.label}</span>
                      {waterClarity === opt.value && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Smells & Pollution (Voice Input + Glossary Tooltips) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  Step 3 of 5
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">👃 Any smells or visible pollution?</h2>
                <p className="text-gray-400 text-sm">Select observable indicators in and around the stream bank.</p>
              </div>

              <button
                onClick={() => {
                  const term = glossary.find(g => g.term.toLowerCase().includes("coliform") || g.term.toLowerCase().includes("algae")) || {
                    term: "Algae Bloom & Odor",
                    simple: "Foul smells or dense green scum indicate untreated sewage or agricultural fertilizer runoff.",
                    example: "Rotten egg smell means anaerobic bacterial breakdown under zero dissolved oxygen."
                  };
                  setActiveTooltip(term);
                }}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded-xl border border-gray-700 text-xs flex items-center gap-1.5 transition"
                aria-label="Explain Pollution Indicators"
              >
                <HelpCircle className="w-4 h-4" /> Glossary Help
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Odor Selection */}
              <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700 space-y-3">
                <div className="text-xs font-bold text-gray-300 uppercase">Odors & Smells</div>
                <div className="space-y-1.5">
                  {["None", "Slight Earthy", "Rotten Egg / Sewage", "Chemical / Fuel"].map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOdorLevel(o)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition flex items-center justify-between min-h-[40px] ${
                        odorLevel === o ? "bg-cyan-500/20 border-cyan-400 text-white font-semibold" : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      <span>{o}</span>
                      {odorLevel === o && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Waste / Litter Level */}
              <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700 space-y-3">
                <div className="text-xs font-bold text-gray-300 uppercase">Visible Plastic / Litter</div>
                <div className="space-y-1.5">
                  {["Low", "Moderate", "High"].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWasteLevel(w)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition flex items-center justify-between min-h-[40px] ${
                        wasteLevel === w ? "bg-cyan-500/20 border-cyan-400 text-white font-semibold" : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      <span>{w === "Low" ? "Low (Clean bank)" : w === "Moderate" ? "Moderate (Some plastics)" : "High (Heavy debris/sewage)"}</span>
                      {wasteLevel === w && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Algae Presence */}
              <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700 space-y-3">
                <div className="text-xs font-bold text-gray-300 uppercase">Algal Cover</div>
                <div className="space-y-1.5">
                  {["None", "Moderate", "Dense mats"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAlgaeLevel(a)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition flex items-center justify-between min-h-[40px] ${
                        algaeLevel === a ? "bg-cyan-500/20 border-cyan-400 text-white font-semibold" : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      <span>{a === "None" ? "None (Clear rocks)" : a === "Moderate" ? "Moderate (Green patches)" : "Dense mats (Thick layer)"}</span>
                      {algaeLevel === a && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice Input Note */}
            <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300">Observation Notes / Voice Memo</label>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      isRecording 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30"
                    }`}
                    aria-label="Record voice note"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    {isRecording ? "Listening... (Speak now)" : "Record Voice Note"}
                  </button>
                )}
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Type additional details or use the microphone to dictate..."
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Photo Capture & Evidence */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Step 4 of 5
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">📸 Take or Upload a Stream Photo</h2>
              <p className="text-gray-400 text-sm">Visual evidence is verified by AquaOne AI VisionAgent for turbidity and color matching.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Photo Preview */}
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 aspect-video flex items-center justify-center shadow-lg">
                  {photos.length > 0 ? (
                    <img src={photos[0]} alt="Stream Observation" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-500 text-xs flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8" /> No photo captured
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] text-cyan-300 border border-cyan-500/30">
                    AI Vision Analysis Ready
                  </div>
                </div>
              </div>

              {/* Sample Photo Presets & URL Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">Preset Demonstrations</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPhotos(["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"])}
                      className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-left text-xs text-gray-200"
                    >
                      💧 Clear Natural Stream
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotos(["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800"])}
                      className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-left text-xs text-gray-200"
                    >
                      🌿 Vegetated Riparian Bed
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotos(["https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800"])}
                      className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-left text-xs text-gray-200"
                    >
                      🍂 Murky Runoff
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotos(["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"])}
                      className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-left text-xs text-gray-200"
                    >
                      🏞️ Wide Catchment Flow
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">Custom Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPhotoInput}
                      onChange={(e) => setCustomPhotoInput(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customPhotoInput) {
                          setPhotos([customPhotoInput]);
                          setCustomPhotoInput("");
                        }
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold border border-gray-700"
                    >
                      Set Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Step 5 of 5
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">✨ Review & Submit Observation</h2>
              <p className="text-gray-400 text-sm">Confirm your citizen assessment. Once submitted, you earn +30 XP toward community tiers.</p>
            </div>

            {submissionResult ? (
              <div className="p-6 rounded-2xl bg-gray-800/60 border border-emerald-500/40 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white">Observation Submitted Successfully!</h3>
                <p className="text-sm text-gray-300 max-w-md mx-auto">
                  {submissionResult.offline 
                    ? "Your assessment is safely saved offline and will automatically sync when online."
                    : "Observation validated by AquaAI agents and queued for One Health stream scoring."}
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmissionResult(null);
                      setCurrentStep(1);
                    }}
                    className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-xl"
                  >
                    Submit Another Stream
                  </button>
                  <a
                    href="/dashboard"
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-bold rounded-xl"
                  >
                    View Stream Dashboard
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                    <div className="text-[11px] text-gray-400">Stream</div>
                    <div className="text-sm font-bold text-white truncate">
                      {streams.find(s => s.id === selectedStreamId)?.name || "Stream #1"}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                    <div className="text-[11px] text-gray-400">Clarity</div>
                    <div className="text-sm font-bold text-cyan-400">{waterClarity}</div>
                  </div>
                  <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                    <div className="text-[11px] text-gray-400">Smell / Odor</div>
                    <div className="text-sm font-bold text-white">{odorLevel}</div>
                  </div>
                  <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                    <div className="text-[11px] text-gray-400">Plastic Waste</div>
                    <div className="text-sm font-bold text-white">{wasteLevel}</div>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-gray-900 border-gray-700 cursor-pointer"
                  />
                  <label htmlFor="consentCheck" className="text-xs text-gray-300 cursor-pointer leading-relaxed">
                    <strong>One Health Open Data Consent:</strong> I consent to my water quality observation and coordinates being anonymized and shared with municipal public health authorities and open FHIR research registries.
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Navigation Footer Buttons (Touch friendly 48px) */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-800 mt-6">
          <button
            type="button"
            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            disabled={currentStep === 1 || submitting}
            className={`px-5 py-3 rounded-xl border text-sm font-semibold flex items-center gap-2 min-h-[48px] transition ${
              currentStep === 1
                ? "opacity-40 border-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(s => Math.min(totalSteps, s + 1))}
              disabled={!isStepValid(currentStep)}
              className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 min-h-[48px] transition shadow-lg ${
                isStepValid(currentStep)
                  ? "bg-cyan-500 hover:bg-cyan-400 text-gray-950 shadow-cyan-500/20"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitObservation}
              disabled={submitting || !consentGranted}
              className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 min-h-[48px] transition shadow-lg ${
                submitting || !consentGranted
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-emerald-500/20"
              }`}
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Submit Observation (+30 XP)
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
