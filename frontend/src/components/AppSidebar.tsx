"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth, getDashboardRoute } from "@/context/AuthContext";
import {
  Home, Activity, Droplets, MapPin, Eye, Brain,
  ShieldAlert, Sparkles, BookOpen, GraduationCap, Trophy, Users,
  Award, Medal, HeartPulse, Layers, FileSpreadsheet, User,
  Settings, ChevronLeft, ChevronRight, ShieldCheck,
  LogOut, BarChart3, Bell, Database, Server, FileText,
  TrendingUp, Compass, Zap
} from "lucide-react";

// ─── Sidebar config by role ───────────────────────────────────────────────────

const CITIZEN_SECTIONS = [
  {
    group: "HOME",
    items: [
      { href: "/dashboard/citizen", label: "Citizen Home", icon: Home },
    ],
  },
  {
    group: "MONITOR",
    items: [
      { href: "/streams", label: "My Streams", icon: Droplets },
      { href: "/assess", label: "Smart Assessment", icon: Activity },
      { href: "/observations", label: "My Observations", icon: Eye },
      { href: "/map", label: "Stream Map", icon: MapPin },
    ],
  },
  {
    group: "AWARENESS",
    items: [
      { href: "/stories", label: "AquaStory", icon: BookOpen },
      { href: "/learn", label: "Learn Center", icon: GraduationCap },
    ],
  },
  {
    group: "COMMUNITY",
    items: [
      { href: "/challenges", label: "Challenges", icon: Trophy },
      { href: "/community", label: "Community", icon: Users },
      { href: "/leaderboard", label: "Leaderboard", icon: Medal },
      { href: "/badges", label: "Badges", icon: Award },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const COMMAND_SECTIONS = [
  {
    group: "HOME",
    items: [
      { href: "/dashboard/command", label: "Command Center", icon: Compass },
    ],
  },
  {
    group: "INTELLIGENCE",
    items: [
      { href: "/insights", label: "Insights", icon: BarChart3 },
      { href: "/map", label: "GIS Map", icon: MapPin },
      { href: "/ai-review", label: "AquaAI Review", icon: Brain },
      { href: "/predictions", label: "Predictions", icon: TrendingUp },
      { href: "/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    group: "MONITORING",
    items: [
      { href: "/streams", label: "Streams", icon: Droplets },
      { href: "/observations", label: "Observations", icon: Eye },
    ],
  },
  {
    group: "REPORTS",
    items: [
      { href: "/reports", label: "Stream Reports", icon: FileText },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const ONEHEALTH_SECTIONS = [
  {
    group: "HOME",
    items: [
      { href: "/dashboard/one-health", label: "One Health & Admin Center", icon: HeartPulse },
    ],
  },
  {
    group: "ONE HEALTH",
    items: [
      { href: "/one-health", label: "One Health Matrix", icon: HeartPulse },
    ],
  },
  {
    group: "INTEROPERABILITY",
    items: [
      { href: "/interop", label: "FHIR / Interoperability", icon: Layers },
    ],
  },
  {
    group: "REPORTS",
    items: [
      { href: "/reports", label: "Reports", icon: FileSpreadsheet },
    ],
  },
  {
    group: "ADMIN",
    items: [
      { href: "/admin", label: "Users", icon: Users },
      { href: "/admin?tab=data", label: "Data Quality", icon: Database },
      { href: "/admin?tab=system", label: "System Status", icon: Server },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

// ─── Helper: pick sections by role ───────────────────────────────────────────

function getSectionsForRole(role: string) {
  switch (role) {
    case "expert":
    case "researcher":
    case "environmental_expert":
    case "field_officer":
    case "analyst":
      return { sections: COMMAND_SECTIONS, label: "Command Center", color: "text-purple-400", badgeText: "Analytics & AI Intelligence" };
    case "health_officer":
    case "admin":
    case "government":
      return { sections: ONEHEALTH_SECTIONS, label: "One Health & Admin Center", color: "text-emerald-400", badgeText: "One Health & Administration" };
    default:
      return { sections: CITIZEN_SECTIONS, label: "Citizen Dashboard", color: "text-cyan-400", badgeText: "Citizen Science & Community" };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isPublicPage = pathname === "/";
  const isAuthPage = [
    "/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/onboarding"
  ].includes(pathname);

  // Don't show sidebar on public/auth pages
  if (isPublicPage || isAuthPage) return null;

  const role = user?.role || "citizen";
  const { sections, label, color, badgeText } = getSectionsForRole(role);

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all duration-300 relative ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-md"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Role Badge (top) */}
      {!collapsed && user && (
        <div className="px-4 pt-4 pb-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800`}>
            <ShieldCheck className={`w-3.5 h-3.5 ${color}`} />
            <div className="min-w-0">
              <div className={`text-[10px] font-bold truncate ${color}`}>{label}</div>
              <div className="text-[9px] text-slate-500 truncate">{badgeText} Active</div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-5 scrollbar-thin">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                {sec.group}
              </div>
            )}
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "?");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout button at bottom */}
      <div className="p-2 border-t border-slate-900">
        <button
          onClick={logout}
          title={collapsed ? "Sign Out" : undefined}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
