"use client";

import { useEffect, useState } from "react";
import { fetchApi, Stream, Story } from "@/lib/api";
import { BookOpen, Sparkles, Calendar, Share2, Award, ArrowRight, RefreshCw, Droplets, ExternalLink } from "lucide-react";

const PERSONA_COLORS = ["border-cyan-500/40", "border-purple-500/40", "border-amber-500/40", "border-emerald-500/40", "border-rose-500/40"];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState<string | null>(null);

  const loadStories = (streamId: number) => {
    setLoading(true);
    fetchApi<Story[]>(`/stories/${streamId}`)
      .then(data => setStories(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApi<Stream[]>("/streams")
      .then(data => {
        setStreams(data);
        if (data.length > 0) {
          setSelectedStream(data[0].id);
          loadStories(data[0].id);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStreamChange = (id: number) => {
    setSelectedStream(id);
    setGenMessage(null);
    loadStories(id);
  };

  const handleGenerateStory = async () => {
    setGenerating(true);
    setGenMessage(null);
    try {
      const res = await fetchApi<any>(`/stories/${selectedStream}/generate`, { method: "POST" });
      setGenMessage(`✅ New weekly story generated: "${res?.story?.title || "Weekly Story"}"`);
      loadStories(selectedStream);
    } catch (err: any) {
      setGenMessage(`⚠️ Could not generate story — ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const streamObj = streams.find(s => s.id === selectedStream);

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-3">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Awareness & Storytelling</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">AquaStory — Stream Narratives</h1>
        <p className="text-sm text-gray-400 mb-5">
          AI-generated weekly watershed intelligence cards transforming complex water metrics into understandable environmental stories.
        </p>

        {/* Stream Selector + Generate Button */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedStream}
            onChange={(e) => handleStreamChange(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
          >
            {streams.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button
            onClick={handleGenerateStory}
            disabled={generating}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl flex items-center gap-2 text-xs transition disabled:opacity-50"
          >
            {generating ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" /> Generate Weekly Story</>
            )}
          </button>
        </div>

        {genMessage && (
          <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300">
            {genMessage}
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Watershed Story Cards
            <span className="text-xs text-gray-500 font-normal ml-1">({stories.length} stories)</span>
          </h2>

          {loading ? (
            <div className="text-center py-16 text-gray-500 text-sm">Loading AquaStory cards...</div>
          ) : stories.length === 0 ? (
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-10 text-center space-y-3">
              <div className="text-4xl">📖</div>
              <p className="text-gray-400 text-sm">No stories yet for this stream.</p>
              <p className="text-xs text-gray-500">Click <strong className="text-cyan-400">Generate Weekly Story</strong> to create the first AI narrative.</p>
            </div>
          ) : (
            <div className="space-y-4 relative border-l-2 border-gray-800 pl-6 ml-3">
              {stories.map((s, idx) => (
                <div key={s.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-4 h-4 w-4 rounded-full bg-cyan-500 border-4 border-gray-950 shadow-md shadow-cyan-500/50" />

                  <div className={`bg-gray-900/70 backdrop-blur-md rounded-2xl border ${PERSONA_COLORS[idx % PERSONA_COLORS.length]} p-5 space-y-3 hover:shadow-lg transition`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        STORY #{idx + 1}
                      </span>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{new Date(s.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white">{s.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{s.summary}</p>

                    {/* Content markdown card */}
                    {s.content_md && (
                      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5 text-xs">
                        <div className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider">📖 Watershed Analysis</div>
                        <p className="text-gray-200 text-[11px] leading-relaxed whitespace-pre-wrap">{s.content_md}</p>
                      </div>
                    )}

                    {s.one_health_impact && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                        <span className="font-bold text-white">One Health Context: </span>
                        {s.one_health_impact}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — Personal Impact + Stream Summary */}
        <div className="space-y-4">
          {streamObj && (
            <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" /> Current Stream Status
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Stream Name</div>
                  <div className="text-sm font-bold text-white">{streamObj.name}</div>
                </div>
                <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Health Score</div>
                  <div className={`text-2xl font-black ${streamObj.health_score >= 60 ? "text-emerald-400" : streamObj.health_score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                    {streamObj.health_score}/100
                  </div>
                </div>
                <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                  <div className="text-[10px] text-gray-400">Status</div>
                  <div className="text-sm font-bold text-cyan-300">{streamObj.status || "Monitored"}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" /> Your Contribution Impact
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                <div className="text-[10px] text-gray-400">Total Observations</div>
                <div className="text-2xl font-black text-cyan-400">12 Logs</div>
              </div>
              <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800">
                <div className="text-[10px] text-gray-400">Guardian Status</div>
                <div className="text-sm font-bold text-amber-300">Level 3 Stream Observer</div>
              </div>
              <a
                href="/badges"
                className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                <span className="text-[11px] font-semibold">View Earned Badges</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
