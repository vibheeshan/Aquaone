"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getDashboardRoute } from "@/context/AuthContext";
import { Loader2, Droplets } from "lucide-react";

/**
 * /dashboard — Role-aware entry point.
 *
 * Citizen  → /dashboard/citizen
 * Expert   → /dashboard/command
 * Health / Admin → /dashboard/one-health
 */
export default function DashboardRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(getDashboardRoute(user.role));
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 blur-xl opacity-30 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span className="text-sm font-semibold">Redirecting to your dashboard...</span>
        </div>
      </div>
    </div>
  );
}
