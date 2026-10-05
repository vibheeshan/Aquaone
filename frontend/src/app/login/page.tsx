"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Droplets, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth, UserProfile, getDashboardRoute } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userRes = await fetchApi<UserProfile>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (userRes && userRes.email) {
        login(userRes);
        router.push(getDashboardRoute(userRes.role));
      } else {
        const fallbackUser: UserProfile = {
          id: Date.now(),
          name: email.split("@")[0].toUpperCase(),
          email: email,
          role: "citizen",
          points: 50,
          level: "Explorer",
          badge_count: 1,
          created_at: new Date().toISOString()
        };
        login(fallbackUser);
        router.push(getDashboardRoute(fallbackUser.role));
      }
    } catch (err: any) {
      console.error(err);
      // Fallback for offline demo login
      const offlineUser: UserProfile = {
        id: Date.now(),
        name: email.split("@")[0].toUpperCase(),
        email: email,
        role: "citizen",
        points: 50,
        level: "Explorer",
        badge_count: 1,
        created_at: new Date().toISOString()
      };
      login(offlineUser);
      router.push(getDashboardRoute(offlineUser.role));
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: string, name: string) => {
    const demos: Record<string, UserProfile> = {
      citizen: { id: 1, name: "Citizen Sentinel", email: "citizen@aquaone.org", role: "citizen", points: 150, level: "Stream Observer", badge_count: 4 },
      expert: { id: 2, name: "Dr. Ravi Kumar", email: "expert@aquaone.org", role: "expert", points: 850, level: "Stream Guardian", badge_count: 12 },
      health_officer: { id: 3, name: "Dr. Priya Sharma", email: "health@aquaone.org", role: "health_officer", points: 600, level: "One Health Champion", badge_count: 8 },
      admin: { id: 4, name: "Admin User", email: "admin@aquaone.org", role: "admin", points: 1200, level: "One Health Champion", badge_count: 20 },
    };
    const u = demos[role];
    if (u) { login(u); router.push(getDashboardRoute(u.role)); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/20 mb-2">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Welcome back to AquaOne</h1>
          <p className="text-xs text-slate-400">
            Sign in to access your stream monitoring dashboard & insights.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                placeholder="citizen@aquaone.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-slate-300 font-semibold">Password</label>
              <Link href="/forgot-password" className="text-cyan-400 hover:underline text-[11px]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
            Register now
          </Link>
        </div>

        {/* Demo Login Section */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            — Quick Demo Access —
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => demoLogin("citizen", "Citizen Dashboard")}
              className="py-2.5 px-3 rounded-xl border text-[10px] font-bold transition bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
            >
              Citizen Dashboard
            </button>
            <button
              onClick={() => demoLogin("expert", "Command Center")}
              className="py-2.5 px-3 rounded-xl border text-[10px] font-bold transition bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              Command Center
            </button>
            <button
              onClick={() => demoLogin("admin", "One Health & Admin Center")}
              className="col-span-2 py-2.5 px-3 rounded-xl border text-[10px] font-bold transition bg-gradient-to-r from-rose-500/10 to-amber-500/10 border-rose-500/30 text-rose-300 hover:border-rose-500/50 flex items-center justify-center gap-1.5"
            >
              One Health &amp; Admin Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
