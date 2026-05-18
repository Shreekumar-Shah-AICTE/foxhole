import { Shield, Cpu, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0f21]/80 border-t border-white/5 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="font-heading text-sm font-bold tracking-wider text-slate-200">
              FOXHOLE AI
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            The enterprise-grade AI decision rehearsal platform. Simulate personalized boardroom interactions before presentation.
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="h-3 w-3" /> Gemini 2.5 Flash
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Lock className="h-3 w-3" /> Lobster Trap DPI
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Next.js 15
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Vercel AI SDK
          </span>
        </div>

        {/* Attribution */}
        <div className="flex flex-col gap-0.5 text-xs text-slate-400">
          <span>Solo Developer: <strong className="text-slate-200">Shree Shah</strong></span>
          <span className="text-[10px] text-slate-500">Built in Google Antigravity IDE</span>
        </div>
      </div>
    </footer>
  );
}
