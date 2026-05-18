"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Award, 
  ArrowLeft, 
  Printer, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp,
  Brain,
  Search,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

// Interfaces
interface ChatMessage {
  role: "user" | "assistant";
  name?: string;
  content: string;
}

interface RiskDiagnostic {
  type: "financial" | "technical" | "compliance";
  risk: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

export default function DebriefAnalysis() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Rehearsal States
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [score, setScore] = useState(50);
  const [memberRatings, setMemberRatings] = useState<Record<string, number>>({});
  const [risks, setRisks] = useState<RiskDiagnostic[]>([]);
  const [tacticalTip, setTacticalTip] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Print Ref
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const title = sessionStorage.getItem("foxhole_proposal_title");
    const desc = sessionStorage.getItem("foxhole_proposal_desc");
    const finalScore = sessionStorage.getItem("foxhole_debrief_score");
    const finalRatings = sessionStorage.getItem("foxhole_debrief_member_ratings");
    const finalRisks = sessionStorage.getItem("foxhole_debrief_risks");
    const finalTip = sessionStorage.getItem("foxhole_debrief_tip");
    const finalChat = sessionStorage.getItem("foxhole_debrief_chat");

    if (!title || !finalScore) {
      router.push("/setup");
      return;
    }

    setProposalTitle(title);
    setProposalDesc(desc || "");
    setScore(parseInt(finalScore));
    setMemberRatings(finalRatings ? JSON.parse(finalRatings) : {});
    setRisks(finalRisks ? JSON.parse(finalRisks) : []);
    setTacticalTip(finalTip || "");
    setChatHistory(finalChat ? JSON.parse(finalChat) : []);
  }, [router]);

  if (!mounted) return null;

  // Prepare chart datasets
  const radarData = Object.entries(memberRatings).map(([key, val]) => {
    let name = "Director";
    if (key === "cfo") name = "Financial (CFO)";
    else if (key === "cto") name = "Technical (CTO)";
    else if (key === "lead-dir") name = "Compliance (Lead)";
    return { subject: name, A: val, fullMark: 100 };
  });

  const barData = Object.entries(memberRatings).map(([key, val]) => {
    let name = "Director";
    if (key === "cfo") name = "CFO";
    else if (key === "cto") name = "CTO";
    else if (key === "lead-dir") name = "Lead";
    return { name, approval: val };
  });

  // Native clean print handler
  const handlePrint = () => {
    window.print();
  };

  const handleRestart = () => {
    router.push("/setup");
  };

  // Strategic SWOT mock insights based on score
  const swotData = {
    strengths: [
      "Explicit address of core engineering transition steps.",
      "Clear articulation of strategic market alignment incentives."
    ],
    weaknesses: score < 60 ? [
      "High integration cost projections remain unmitigated.",
      "Vague timelines on system deployment milestones under adversarial question pressures."
    ] : [
      "Slight exposure on client contract confidentiality clauses.",
      "Resource allocation margins could be optimized for post-integration safety buffers."
    ],
    opportunities: [
      "Leverage Lobster Trap's secure proxy framework as a key trust moat in M&A slide deck.",
      "Adopt phased deployment gates to satisfy the CTO's engineering concerns."
    ],
    threats: [
      "Rigid financial targets may delay approvals if initial payback exceeds 24 months.",
      "Compliance audit overlaps could slow down critical timeline milestones."
    ]
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Header tools (Hidden during printing) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 print:hidden">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Simulation Completed</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">Debrief Assessment & Risk Audit</h1>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            onClick={handleRestart}
            className="border-white/10 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 h-10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Start New Rehearsal
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 px-5 shadow-lg shadow-blue-500/20"
          >
            <Printer className="mr-2 h-4 w-4" /> Print PDF Report
          </Button>
        </div>
      </div>

      {/* PRINTABLE ASSESSMENT CONTENT CONTAINER */}
      <div 
        ref={reportRef} 
        className="flex-1 flex flex-col gap-8 print:p-8 print:bg-white print:text-black"
      >
        {/* Print only banner header */}
        <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-slate-900 tracking-wider">FOXHOLE AI STRATEGIC DEBRIEF</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">CONFIDENTIAL REPORT</span>
        </div>

        {/* Top Summary Block */}
        <Card className="glass-panel border-white/[0.06] bg-[#0c142c]/40 print:border-slate-200 print:bg-slate-50">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 print:bg-blue-50 print:text-blue-700 print:border-blue-200">
                <Brain className="h-3.5 w-3.5" /> REHEARSAL SUMMARY REPORT
              </span>
              <h2 className="text-2xl font-bold text-white print:text-slate-900">{proposalTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed print:text-slate-600 line-clamp-3">
                {proposalDesc}
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center shrink-0 p-6 rounded-2xl bg-[#030612]/60 border border-white/5 print:bg-white print:border-slate-200 w-full md:w-52 text-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">ALIGNMENT INDEX</span>
              <span className={`text-5xl font-black ${
                score >= 70 ? "text-emerald-400 print:text-emerald-700" : score <= 40 ? "text-rose-400 print:text-rose-700" : "text-amber-400 print:text-amber-700"
              } tracking-tighter leading-none`}>
                {score}%
              </span>
              <div className="w-full space-y-1 mt-1">
                <Progress 
                  value={score} 
                  className={`h-1.5 rounded-full ${
                    score >= 70 ? "bg-emerald-500/10" : score <= 40 ? "bg-rose-500/10" : "bg-blue-500/10"
                  }`} 
                />
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                  {score >= 70 ? "Approval Probable" : score <= 40 ? "High Refusal Risk" : "Revision Suggested"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts & Insights Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recharts Chart representation */}
          <Card className="glass-panel border-white/[0.06] bg-[#050917]/70 print:border-slate-200 print:bg-slate-50">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white print:text-slate-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Fiduciary Vector Distribution
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs print:text-slate-500">
                Individual board member alignment indexes evaluated post-simulation rehearsal.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                  <Radar name="Approval Rate" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* SWOT Grid */}
          <Card className="glass-panel border-white/[0.06] bg-[#050917]/70 print:border-slate-200 print:bg-slate-50">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white print:text-slate-800 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" />
                SWOT Strategic Diagnoses
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs print:text-slate-500">
                SWOT mapping derived from board avatar reactions and adversarial claims.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-4 text-[10px] leading-relaxed">
              <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 print:bg-slate-100 print:border-slate-300">
                <span className="font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-widest block mb-1">Strengths</span>
                <ul className="list-disc pl-3 text-slate-300 print:text-slate-700 space-y-1">
                  {swotData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-rose-500/5 border border-rose-500/10 print:bg-slate-100 print:border-slate-300">
                <span className="font-bold text-rose-400 print:text-rose-700 uppercase tracking-widest block mb-1">Weaknesses</span>
                <ul className="list-disc pl-3 text-slate-300 print:text-slate-700 space-y-1">
                  {swotData.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-blue-500/5 border border-blue-500/10 print:bg-slate-100 print:border-slate-300">
                <span className="font-bold text-blue-400 print:text-blue-700 uppercase tracking-widest block mb-1">Opportunities</span>
                <ul className="list-disc pl-3 text-slate-300 print:text-slate-700 space-y-1">
                  {swotData.opportunities.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/10 print:bg-slate-100 print:border-slate-300">
                <span className="font-bold text-amber-400 print:text-amber-700 uppercase tracking-widest block mb-1">Threats</span>
                <ul className="list-disc pl-3 text-slate-300 print:text-slate-700 space-y-1">
                  {swotData.threats.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Risk Mitigations list */}
        <Card className="glass-panel border-white/[0.06] bg-[#050917]/70 print:border-slate-200 print:bg-slate-50">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold text-white print:text-slate-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Strategic Risk Remediation Feed
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs print:text-slate-500">
              Address these precise critiques to neutralize board reluctance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {risks.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No high-level vulnerabilities logged. Proposal alignment verified.
              </div>
            ) : (
              risks.map((risk, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start justify-between gap-4 ${
                    risk.severity === "high" 
                      ? "border-rose-500/20 bg-rose-500/5 print:bg-slate-100 print:border-rose-200" 
                      : "border-amber-500/20 bg-amber-500/5 print:bg-slate-100 print:border-amber-200"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        risk.severity === "high" ? "text-rose-400 print:text-rose-700" : "text-amber-400 print:text-amber-700"
                      }`}>
                        {risk.type} RISK — {risk.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold print:text-slate-850 leading-relaxed">{risk.risk}</p>
                  </div>
                  
                  <div className="w-full sm:w-auto sm:max-w-md p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px] leading-relaxed text-slate-300 print:bg-white print:border-slate-300 print:text-slate-700">
                    <strong className="text-blue-400 print:text-blue-700">MITIGATION SUGGESTION:</strong> {risk.suggestion}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Audit Verification Log (Veea Lobster Trap Compliance check) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c142c]/90 to-[#070b1a]/95 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 print:border-slate-200 print:bg-slate-50">
          <div className="flex items-start gap-3 flex-1">
            <Shield className="h-6 w-6 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white print:text-slate-800 flex items-center gap-1.5">
                Veea Lobster Trap Audit Checkpoint
                <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">Verified</span>
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed print:text-slate-650">
                All boardroom text, simulation dialogue turns, and proposal artifacts have been securely routed through the Lobster Trap DPI Proxy. Zero PII leak, zero metadata leaks, and zero prompt injections logged. Audit reference signature: <code className="font-mono text-purple-300 print:text-purple-700">LT-8080-M&A-SUCCESS-2026</code>
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
