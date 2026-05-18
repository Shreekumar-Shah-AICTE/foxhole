"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Users, 
  TrendingUp, 
  Lock, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  FileSpreadsheet,
  Zap,
  Brain,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 120, damping: 18 }
    }
  };

  const stats = [
    { value: "74%", label: "Board Rejection Rate", desc: "Most strategic proposals get rejected or sent back on first hearing due to unaddressed board friction points.", icon: AlertTriangle, color: "text-rose-400", accent: "from-rose-500/20 to-rose-500/5", border: "border-rose-500/15" },
    { value: "40h+", label: "Prep Time Eliminated", desc: "Executives spend days anticipating adversarial reactions. Foxhole simulates them in under 5 minutes.", icon: TrendingUp, color: "text-blue-400", accent: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/15" },
    { value: "$200K+", label: "Value Reclaimed", desc: "Avoid costly delays by securing board approval on day one. Each stalled cycle burns capital.", icon: FileSpreadsheet, color: "text-emerald-400", accent: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/15" }
  ];

  const features = [
    {
      title: "Adversarial Board Personas",
      description: "AI-generated directors with distinct biases — a margin-obsessed CFO, skeptical CTO, and compliance-hardened lead director. Each probes different angles.",
      icon: Users,
      badge: "Gemini 2.5 Flash",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Real-Time Strategic Scoring",
      description: "As you defend your proposal, a background auditor scores approval probability per member, diagnoses vulnerabilities, and generates tactical mitigation tips.",
      icon: BarChart3,
      badge: "Live Assessment",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Exportable Debrief Reports",
      description: "Radar charts, SWOT matrices, and risk remediation feeds compiled into a print-ready strategic assessment PDF for physical boardroom distribution.",
      icon: CheckCircle2,
      badge: "Print-Ready PDF",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const techStack = [
    { name: "Next.js 16", detail: "App Router + Turbopack", icon: Zap },
    { name: "Gemini 2.5 Flash", detail: "Sub-second AI streaming", icon: Brain },
    { name: "Vercel AI SDK 4", detail: "Streaming engine", icon: Activity },
    { name: "Lobster Trap", detail: "DPI compliance proxy", icon: ShieldCheck },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pb-24">
      {/* === LAYERED BACKGROUND === */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.08),transparent)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* === HERO SECTION === */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-16 sm:pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* LOGO + BRAND */}
          <motion.div variants={itemVariants} className="mb-10 flex flex-col items-center gap-5">
            <div className="relative flex items-center justify-center">
              {/* Outer ambient glow — large soft blue */}
              <div className="absolute w-56 h-56 rounded-full bg-blue-500/10 blur-[80px] -z-10" />
              {/* Mid glow ring — cyan pulse for contrast */}
              <div className="absolute w-44 h-44 rounded-full bg-cyan-400/8 blur-[40px] -z-10 animate-pulse" />
              {/* Inner bright ring — white halo to separate from dark bg */}
              <div className="absolute w-40 h-40 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm -z-5" />
              <Image 
                src="/foxhole-logo.png" 
                alt="Foxhole" 
                width={140} 
                height={140} 
                className="relative z-10 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]" 
                priority
              />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="font-heading text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent leading-none">
                FOXHOLE
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-slate-300/80 leading-none">
                Dominate the Boardroom Before You Walk In
              </span>
            </div>
          </motion.div>

          {/* HEADLINE */}
          <motion.h1 
            variants={itemVariants} 
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-5"
          >
            <span className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              Stress-Test Your Proposal{" "}
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Against an AI Board.
            </span>
          </motion.h1>

          {/* SUBTITLE */}
          <motion.p 
            variants={itemVariants} 
            className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed mb-8"
          >
            An enterprise decision-rehearsal simulator. Personalize adversarial AI directors, 
            defend your strategy under fire, and walk into the real meeting with every weak spot neutralized.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row gap-3.5 mb-6 justify-center"
          >
            <Link href="/setup">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 border-0 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
                Launch Simulation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#problem">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-white/10 text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] font-semibold hover:scale-[1.03] transition-all duration-200">
                See the Problem ↓
              </Button>
            </a>
          </motion.div>

          {/* TECH BADGES ROW */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-16">
            {techStack.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold bg-white/[0.04] text-slate-400 border border-white/[0.06] backdrop-blur-sm">
                  <Icon className="h-3 w-3 text-blue-400/70" />
                  {tech.name}
                  <span className="text-slate-500 hidden sm:inline">— {tech.detail}</span>
                </span>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* === PAIN STATISTICS === */}
      <div id="problem" className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-24">
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/15 mb-4">
              <AlertTriangle className="h-3 w-3" /> The Enterprise Problem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Why High-Stakes Proposals Get Killed
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Boardroom rejections rarely concern the product — they target narratives, incentive alignment, and unaddressed risk tolerances.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className={`glass-panel ${stat.border} overflow-hidden bg-gradient-to-b ${stat.accent} hover:scale-[1.02] transition-all duration-300 h-full`}>
                  <CardContent className="p-6 sm:p-7 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <span className={`text-4xl sm:text-5xl font-black ${stat.color}`}>
                        {stat.value}
                      </span>
                      <div className={`p-2.5 rounded-xl bg-white/[0.04] ${stat.color} border border-white/[0.06]`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1.5">{stat.label}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{stat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === FEATURE SHOWCASE === */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/15 mb-4">
              <Sparkles className="h-3 w-3" /> Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Your Unfair Advantage in the Boardroom
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Three pillars of AI-driven rehearsal that traditional prep cannot replicate.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="glass-panel border-white/[0.06] hover:border-blue-500/25 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 bg-[#050917]/70 group h-full overflow-hidden">
                  {/* Top accent bar */}
                  <div className={`h-0.5 w-full bg-gradient-to-r ${feature.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
                  <CardContent className="p-6 sm:p-7 flex flex-col h-full justify-between gap-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/[0.05] text-slate-400 border border-white/[0.06]">
                          {feature.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors duration-200">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === LOBSTER TRAP SECURITY === */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden glass-panel border-white/[0.06] p-7 sm:p-10 lg:p-14 bg-gradient-to-br from-[#0c142c]/90 to-[#070b1a]/95 shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-purple-600/8 blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 self-start">
                <Lock className="h-3 w-3" /> Veea Lobster Trap Integration
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Enterprise-Grade Privacy.{" "}
                <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
                  M&A-Safe Testing.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Board proposals contain highly sensitive financial, legal, and operational data. Foxhole routes all prompts through Veea&apos;s Lobster Trap DPI proxy.
              </p>
              
              <ul className="flex flex-col gap-3">
                {[
                  { label: "PII & Metadata Shielding", desc: "Prevents SSNs, employee names, and corporate emails from reaching LLM backends." },
                  { label: "Prompt Injection Filter", desc: "Protects against system override attempts during dialogue generations." },
                  { label: "Secure Audit Logging", desc: "Full transparent trail of prompt inspections via the local proxy container." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-white">{item.label}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative flex justify-center items-center">
              <div className="w-full max-w-md rounded-xl bg-[#030612]/90 border border-white/5 p-5 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span>lobstertrap-dpi.log</span>
                </div>
                
                <div className="space-y-3 font-mono text-[10px] leading-relaxed">
                  <div className="text-slate-500">
                    <span className="text-blue-400">[INFO]</span> 2026-05-19T03:14:02Z — proxy started on 127.0.0.1:8080
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/90">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>COMPLIANCE CHECK</span>
                      <span className="text-[8px] bg-emerald-500/20 px-1.5 rounded text-emerald-400">PASS</span>
                    </div>
                    <span>Inspect: &quot;CloudVault acquisition — ARR $12M...&quot;</span>
                    <div className="text-[9px] text-emerald-500/50 mt-1">PII: 0 | Injection: NONE | Logged: TRUE</div>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 text-rose-400/90">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>PII FILTER</span>
                      <span className="text-[8px] bg-rose-500/20 px-1.5 rounded text-rose-400">BLOCKED</span>
                    </div>
                    <span>Detected: employee email in board bio payload</span>
                    <div className="text-[9px] text-rose-500/50 mt-1">Rule: PII_PROMPT_BLOCK | Action: MASKED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* === BOTTOM CTA === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl px-4 text-center"
      >
        <div className="flex flex-col items-center gap-5 p-8 rounded-2xl glass-panel border-white/[0.06] bg-gradient-to-b from-blue-500/[0.04] to-transparent">
          <Image src="/foxhole-logo.png" alt="Foxhole" width={48} height={48} className="drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
          <h3 className="text-xl font-bold text-white">Ready to Rehearse?</h3>
          <p className="text-sm text-slate-400 max-w-md">
            Set up your board, define your proposal, and enter the simulation.
          </p>
          <Link href="/setup">
            <Button size="lg" className="h-12 px-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-blue-600/30 border-0 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
              Launch Boardroom Simulation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
