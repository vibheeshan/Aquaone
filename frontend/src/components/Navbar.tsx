"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Droplets, Play, Sparkles, Menu, X, LogIn, UserPlus,
  ArrowLeft, User, Settings, LogOut, ChevronDown, Bell, Search
} from "lucide-react";
import DemoModeModal from "@/components/DemoModeModal";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isLandingPage = pathname === "/";
  const isAuthPage = [
    "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"
  ].includes(pathname);

  // Public landing page section links
  const landingNavLinks = [
    { href: "#hero", label: "Home" },
    { href: "#purpose", label: "Purpose" },
    { href: "#problems", label: "Problems" },
    { href: "#solution", label: "Solution" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#impact", label: "Impact" },
    { href: "#features", label: "Features" },
  ];

  // ── AUTH PAGES NAVBAR ────────────────────────────────────────────────────────
  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Aqua<span className="text-cyan-400">One</span>
              </span>
            </Link>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition pl-3 border-l border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to AquaOne</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {pathname === "/login" ? (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Don&apos;t have an account?</span>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md transition hover:opacity-90 flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Already registered?</span>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-900 transition flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // ── LANDING PAGE NAVBAR ──────────────────────────────────────────────────────
  if (isLandingPage) {
    return (
      <>
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-white">
                    Aqua<span className="text-cyan-400">One</span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:inline">
                    Observe. Validate. Predict. Protect.
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Landing Nav Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {landingNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-slate-900 transition"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Demo button */}
              <button
                onClick={() => setIsDemoOpen(true)}
                className="hidden sm:inline-flex relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-[1px] shadow-lg shadow-cyan-500/20 active:scale-95 transition"
              >
                <div className="flex items-center space-x-2 rounded-xl bg-slate-950 px-3 py-1.5 transition group-hover:bg-opacity-80">
                  <Play className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">Demo</span>
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                </div>
              </button>

              {/* If already logged in, show Go to Dashboard */}
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md hover:opacity-90 transition"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-900 transition border border-slate-800 hover:border-slate-700"
                  >
                    <LogIn className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:opacity-90 transition"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
              {landingNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900"
                >
                  {link.label}
                </a>
              ))}
              {!user && (
                <div className="flex gap-2 pt-3 border-t border-slate-800 mt-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700">
                    <LogIn className="w-3.5 h-3.5 text-cyan-400" /><span>Sign In</span>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-500 to-emerald-500">
                    <UserPlus className="w-3.5 h-3.5" /><span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </header>
        <DemoModeModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      </>
    );
  }

  // ── AUTHENTICATED APP NAVBAR (lean top bar) ──────────────────────────────────
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2.5 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Droplets className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white hidden sm:inline">
              Aqua<span className="text-cyan-400">One</span>
            </span>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search streams, observations, reports..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Right: Demo + Notifications + User Profile */}
          <div className="flex items-center space-x-2">

            {/* Demo button */}
            <button
              onClick={() => setIsDemoOpen(true)}
              className="hidden sm:inline-flex relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-[1px] shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              <div className="flex items-center space-x-1.5 rounded-xl bg-slate-950 px-2.5 py-1.5 transition group-hover:bg-opacity-80">
                <Play className="h-3 w-3 fill-cyan-400 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">Demo</span>
              </div>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800/80 space-y-0.5">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      <div className="text-[10px] text-cyan-400 font-semibold capitalize">{user.role} • {user.level || "Explorer"} • {user.points || 0} XP</div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition"
                    >
                      <Settings className="w-4 h-4 text-teal-400" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-900 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <DemoModeModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  );
}
