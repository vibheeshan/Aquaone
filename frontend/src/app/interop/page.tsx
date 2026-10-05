"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { 
  Layers, ShieldCheck, FileText, Code2, Globe, Copy, Check, ExternalLink 
} from "lucide-react";

export default function OneHealthBridgePage() {
  const [fhirData, setFhirData] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchApi("/interop/metadata"),
      fetchApi("/interop/fhir/Observation?obs_id=1"),
    ])
      .then(([meta, fhir]) => {
        setMetadata(meta);
        setFhirData(fhir);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = () => {
    if (!fhirData) return;
    navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Digital Health Standards & Interoperability</span>
          </div>
          <h1 className="text-3xl font-black text-white">One Health Bridge</h1>
          <p className="text-xs text-slate-400">
            Standardized REST APIs, OpenAPI specifications, and FHIR R4 JSON environmental observation mapping.
          </p>
        </div>

        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition flex items-center gap-2 shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Interactive Swagger Docs</span>
        </a>
      </div>

      {/* Metadata Overview Card */}
      {metadata && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-blue-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400">Platform Layer:</span>
            <div className="font-bold text-white text-sm">{metadata.platform}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Supported Standard:</span>
            <div className="font-bold text-cyan-300 text-sm">{metadata.standard_version}</div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">Supported FHIR Resources:</span>
            <div className="font-bold text-emerald-300 text-sm">{metadata.supported_resources?.join(", ")}</div>
          </div>
        </div>
      )}

      {/* FHIR R4 Payload Inspector */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Live FHIR R4 Observation JSON Resource Inspector
          </h3>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? "Copied JSON" : "Copy FHIR JSON"}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Endpoint: <code className="text-cyan-300">GET /api/v1/interop/fhir/Observation?obs_id=1</code>
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-96">
          <pre className="text-cyan-300">
            {fhirData ? JSON.stringify(fhirData, null, 2) : "Loading FHIR resource map..."}
          </pre>
        </div>
      </div>

    </div>
  );
}
