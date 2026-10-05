"use client";

import Link from "next/link";
import { CheckCircle2, MailCheck, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-800 text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mx-auto">
          <MailCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Check Your Inbox</h1>
          <p className="text-xs text-slate-400">
            We sent a verification link to your email address. Please click the link to confirm your account.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-center gap-1.5 font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verification email sent successfully</span>
          </div>
          <p className="text-[11px] text-slate-400">Didn't receive the email? Check your spam folder or resend below.</p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/onboarding"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
