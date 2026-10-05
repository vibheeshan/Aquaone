"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getDashboardRoute } from "@/context/AuthContext";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

// Maps role groups for access control
const ROLE_GROUPS: Record<string, string[]> = {
  citizen: ["citizen", "student", "ngo", "community_leader", "volunteer"],
  expert: ["expert", "researcher", "environmental_expert", "field_officer", "analyst"],
  health_officer: ["health_officer", "admin", "government"],
};

function hasAccess(userRole: string, allowedRoles: string[]): boolean {
  // Direct match
  if (allowedRoles.includes(userRole)) return true;
  // Group match
  for (const allowed of allowedRoles) {
    const group = ROLE_GROUPS[allowed];
    if (group && group.includes(userRole)) return true;
  }
  return false;
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-slate-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!hasAccess(user.role, allowedRoles)) {
    const dashboardRoute = getDashboardRoute(user.role);
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 mx-auto">
            <ShieldAlert className="h-8 w-8 text-rose-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Access Restricted</h1>
            <p className="text-sm text-slate-400">
              This area is not available for your current role.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Access restricted for your current role.</span>
            </div>
          </div>
          <Link
            href={dashboardRoute}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-90 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
