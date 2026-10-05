import Link from "next/link";
import { Droplets, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-3xl border border-cyan-500/30">
        <Droplets className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-black text-white">404 - Stream Not Found</h1>
      <p className="text-xs text-slate-400 max-w-md">
        The watershed monitoring page or resource you are looking for does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to AquaOne Home</span>
      </Link>
    </div>
  );
}
