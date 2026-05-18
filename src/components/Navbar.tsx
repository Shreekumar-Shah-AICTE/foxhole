"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayCircle, Award, Terminal, Lock, AlertTriangle, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export default function Navbar() {
  const pathname = usePathname();
  const [proxyActive, setProxyActive] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/lobster-trap/status");
        if (res.ok) {
          const data = await res.json();
          setProxyActive(data.active);
        } else {
          setProxyActive(false);
        }
      } catch (e) {
        setProxyActive(false);
      }
    }
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/", label: "Overview", icon: Crosshair },
    { href: "/setup", label: "Setup Board", icon: PlayCircle },
    { href: "/simulation", label: "Simulation Room", icon: Terminal },
    { href: "/debrief", label: "Debrief Analysis", icon: Award },
  ];

  return (
    <header className="glass-navbar sticky top-0 z-50 w-full backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image 
              src="/foxhole-logo.png" 
              alt="Foxhole" 
              width={38} 
              height={38} 
              className="group-hover:scale-110 transition-transform duration-200 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" 
            />
            <div className="flex flex-col">
              <span className="font-heading text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent leading-none">
                FOXHOLE
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-blue-400/70 leading-none mt-0.5">
                AI Boardroom
              </span>
            </div>
          </Link>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white border border-white/5 shadow-inner shadow-black/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Status Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <TooltipProvider>
              {proxyActive === null ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                  Connecting proxy...
                </span>
              ) : proxyActive ? (
                <Tooltip>
                  <TooltipTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm cursor-help">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                    <Lock className="h-3 w-3 mr-0.5" /> Lobster Trap Secure
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-white/10 text-slate-200 text-xs p-3 max-w-xs">
                    Veea Lobster Trap DPI proxy is active on port 8080.
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm cursor-help">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <AlertTriangle className="h-3 w-3 mr-0.5" /> Direct Rehearsal
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-white/10 text-slate-200 text-xs p-3 max-w-xs">
                    Lobster Trap proxy inactive. Using direct encrypted API endpoints.
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>

          <Link href="/setup">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/25 border-0 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Start Simulation
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
