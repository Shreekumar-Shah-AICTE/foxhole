"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Users, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Flame, 
  Smile, 
  Gauge,
  Lock,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Interfaces
interface BoardMember {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  bio: string;
  personaDescription: string;
  accentColor: string; // Tailwind class
}

const DEMO_PROPOSAL = {
  title: "M&A Acquisition of NovaTech Solutions",
  description: "Acquisition of NovaTech Solutions for $12M in cash and stock. NovaTech has $2.4M ARR, 22 employees, and a proprietary real-time streaming pipeline. The primary strategic objective is to integrate their real-time data sync technology into our enterprise suite. Key challenges include migrating their legacy system from AWS to our private Veea edge architecture, handling critical security compliance audits, and retaining their engineering team post-acquisition."
};

const DEMO_BOARD_MEMBERS: BoardMember[] = [
  {
    id: "cfo",
    name: "Sarah Jenkins",
    role: "CFO & Head of Governance",
    avatarText: "SJ",
    bio: "Ex-Goldman Sachs partner. Obsessed with free cash flow, payback period, and integration costs.",
    personaDescription: "Highly conservative financial traditionalist. Hates hidden costs, demands a payback period under 24 months, and will aggressively question software licensing overhead and human resource retention costs.",
    accentColor: "border-emerald-500 text-emerald-400 bg-emerald-500/10"
  },
  {
    id: "cto",
    name: "Dr. Aris Vance",
    role: "CTO & Technical Fellow",
    avatarText: "AV",
    bio: "MIT Ph.D., systems architect. Elitist who despises messy tech debt.",
    personaDescription: "Technical elitist who is highly skeptical of legacy technology claims. Will drill deep into migration complexities, database schema compatibility, latency issues, API security, and high technical debt overhead.",
    accentColor: "border-blue-500 text-blue-400 bg-blue-500/10"
  },
  {
    id: "lead-dir",
    name: "Marcus Sterling",
    role: "Lead Independent Director",
    avatarText: "MS",
    bio: "Former regulatory commissioner. Focuses on data compliance and reputational protection.",
    personaDescription: "Public perception and compliance maximalist. Will raise concerns about GDPR/CCPA regulations, data sovereignty, sovereign firewalls, potential PR liabilities, and client confidentiality clauses in contract transitions.",
    accentColor: "border-amber-500 text-amber-400 bg-amber-500/10"
  }
];

export default function SetupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [rigorLevel, setRigorLevel] = useState<"friendly" | "standard" | "stress">("standard");

  // Step state validations
  const isStep1Valid = proposalTitle.trim().length > 0 && proposalDesc.trim().length > 0;
  const isStep2Valid = boardMembers.length > 0;

  // Custom addition states
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberBio, setNewMemberBio] = useState("");
  const [newMemberPersona, setNewMemberPersona] = useState("");

  const handlePrefillDemo = () => {
    setProposalTitle(DEMO_PROPOSAL.title);
    setProposalDesc(DEMO_PROPOSAL.description);
  };

  const handlePrefillBoard = () => {
    setBoardMembers(DEMO_BOARD_MEMBERS);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberRole.trim()) return;

    const colors = [
      "border-indigo-500 text-indigo-400 bg-indigo-500/10",
      "border-purple-500 text-purple-400 bg-purple-500/10",
      "border-pink-500 text-pink-400 bg-pink-500/10",
      "border-teal-500 text-teal-400 bg-teal-500/10"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = newMemberName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const newMember: BoardMember = {
      id: Math.random().toString(36).substring(7),
      name: newMemberName,
      role: newMemberRole,
      avatarText: initials || "BM",
      bio: newMemberBio || "Experienced board member with background in operations.",
      personaDescription: newMemberPersona || "Pragmatic decision maker focusing on efficiency and execution strategy.",
      accentColor: randomColor
    };

    setBoardMembers([...boardMembers, newMember]);
    setNewMemberName("");
    setNewMemberRole("");
    setNewMemberBio("");
    setNewMemberPersona("");
  };

  const handleRemoveMember = (id: string) => {
    setBoardMembers(boardMembers.filter(m => m.id !== id));
  };

  const handleStartSimulation = () => {
    // Pack state into sessionStorage so the Simulation Room can pick it up
    sessionStorage.setItem("foxhole_proposal_title", proposalTitle);
    sessionStorage.setItem("foxhole_proposal_desc", proposalDesc);
    sessionStorage.setItem("foxhole_board_members", JSON.stringify(boardMembers));
    sessionStorage.setItem("foxhole_rigor_level", rigorLevel);

    router.push("/simulation");
  };

  return (
    <div className="relative flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-start">
      {/* Wizard Progress bar */}
      <div className="mb-8 w-full max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>STEP {currentStep} OF 3</span>
          <span className="font-bold text-blue-400">
            {currentStep === 1 ? "Strategic Proposal" : currentStep === 2 ? "Board Persona Setup" : "Stress Level"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Proposal Details */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1 flex flex-col gap-6"
          >
            <Card className="glass-panel border-white/[0.06] bg-[#0c142c]/40 flex-1">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      <Shield className="h-5.5 w-5.5 text-blue-400" />
                      Step 1: Boardroom Proposal & Strategic Plan
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs sm:text-sm">
                      Describe the transaction, budget, technical migration, or policy proposal you wish to stress-test.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={handlePrefillDemo}
                    className="h-9 px-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 group shrink-0 active:scale-95 transition-all duration-200"
                  >
                    <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-200" />
                    Prefill M&A Demo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Proposal Title
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g. Q3 Cloud Infrastructure Migration"
                    value={proposalTitle}
                    onChange={(e) => setProposalTitle(e.target.value)}
                    className="bg-[#040817] border-white/10 hover:border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-lg h-11 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Core Details, Strategic Context & Financials
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Provide relevant facts, strategic reasoning, costs, timeline, and security mechanisms. Be as specific as possible — the board personas will parse this context to formulate their lines of questioning."
                    rows={8}
                    value={proposalDesc}
                    onChange={(e) => setProposalDesc(e.target.value)}
                    className="bg-[#040817] border-white/10 hover:border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-lg p-3.5 text-sm leading-relaxed transition-all duration-200 resize-y"
                  />
                  <div className="flex items-center gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10 mt-2 text-xs text-purple-400">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>All corporate context remains private. Transmitted strictly through Lobster Trap DPI compliance proxy.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                disabled={!isStep1Valid}
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 shadow-lg shadow-blue-500/20"
              >
                Configure Board members <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Board Personas */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1 flex flex-col gap-6"
          >
            <Card className="glass-panel border-white/[0.06] bg-[#0c142c]/40 flex-1">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      <Users className="h-5.5 w-5.5 text-blue-400" />
                      Step 2: Customize Your Board Personas
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs sm:text-sm">
                      Establish the avatars representing your decision board. Give them custom professional biases and incentives.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={handlePrefillBoard}
                    className="h-9 px-4 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 group shrink-0 active:scale-95 transition-all duration-200"
                  >
                    <Cpu className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-200" />
                    Load Demo Avatars
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Custom Member Input Form */}
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#040817]/60 border border-white/5">
                  <div className="col-span-1 md:col-span-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                    Add Custom Board Member Profile
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</label>
                    <Input
                      placeholder="e.g. Sarah Jenkins"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="bg-[#030612] border-white/10 text-white rounded-lg h-9"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role / Position</label>
                    <Input
                      placeholder="e.g. Chief Financial Officer"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="bg-[#030612] border-white/10 text-white rounded-lg h-9"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Short Bio</label>
                    <Input
                      placeholder="e.g. Ex-Goldman Sachs partner. Obsessed with free cash flow, payback period, and integration costs."
                      value={newMemberBio}
                      onChange={(e) => setNewMemberBio(e.target.value)}
                      className="bg-[#030612] border-white/10 text-white rounded-lg h-9"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Simulation Persona Bias (Adversarial Focus)</label>
                    <Textarea
                      placeholder="e.g. Conservative financial traditionalist. Hates high software licensing overhead and human resource costs."
                      value={newMemberPersona}
                      onChange={(e) => setNewMemberPersona(e.target.value)}
                      rows={2}
                      className="bg-[#030612] border-white/10 text-white rounded-lg text-xs"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 flex justify-end">
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-500 font-semibold"
                      disabled={!newMemberName.trim() || !newMemberRole.trim()}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Member Profile
                    </Button>
                  </div>
                </form>

                {/* Current Active List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active Board Avatars ({boardMembers.length})
                  </div>
                  
                  {boardMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-white/5 bg-[#030612]/30 text-center">
                      <Users className="h-8 w-8 text-slate-600 mb-2" />
                      <p className="text-sm text-slate-500">No board profiles configured yet.</p>
                      <p className="text-xs text-slate-600 mt-1">Click "Load Demo Avatars" or complete the form above to add members.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {boardMembers.map((member) => (
                        <motion.div
                          key={member.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`relative p-5 rounded-xl border ${member.accentColor} flex flex-col justify-between gap-4`}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-white/10">
                              <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                                {member.avatarText}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-sm font-extrabold text-slate-100">{member.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{member.role}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Focus Bias</div>
                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{member.personaDescription}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="border-white/10 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 h-11"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                disabled={!isStep2Valid}
                onClick={() => setCurrentStep(3)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 shadow-lg shadow-blue-500/20"
              >
                Simulation Rigor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Rigor & simulation launch */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full flex-1 flex flex-col gap-6"
          >
            <Card className="glass-panel border-white/[0.06] bg-[#0c142c]/40 flex-1">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Gauge className="h-5.5 w-5.5 text-blue-400" />
                  Step 3: Board Rigor & Simulation Stress Level
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Choose the behavior pattern of the avatars. A higher level triggers aggressive scrutiny.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Friendly Option */}
                  <div
                    onClick={() => setRigorLevel("friendly")}
                    className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4 group ${
                      rigorLevel === "friendly"
                        ? "border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/5"
                        : "border-white/5 bg-[#030612]/30 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 group-hover:scale-105 transition-transform duration-200">
                        <Smile className="h-5 w-5" />
                      </div>
                      {rigorLevel === "friendly" && (
                        <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-[#040817]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Friendly Dialogue</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Constructive, supportive atmosphere. Board members focus on validating assumptions and providing helpful, growth-oriented feedback.
                      </p>
                    </div>
                  </div>

                  {/* Standard Option */}
                  <div
                    onClick={() => setRigorLevel("standard")}
                    className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4 group ${
                      rigorLevel === "standard"
                        ? "border-blue-500/40 bg-blue-500/5 shadow-lg shadow-blue-500/5"
                        : "border-white/5 bg-[#030612]/30 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/15 group-hover:scale-105 transition-transform duration-200">
                        <Gauge className="h-5 w-5" />
                      </div>
                      {rigorLevel === "standard" && (
                        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-[#040817]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Standard Diligence</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Objective and pragmatic fiduciary scrutiny. Avatars ask common operational and financial integration questions with standard corporate rigor.
                      </p>
                    </div>
                  </div>

                  {/* Adversarial Option */}
                  <div
                    onClick={() => setRigorLevel("stress")}
                    className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4 group ${
                      rigorLevel === "stress"
                        ? "border-rose-500/40 bg-rose-500/5 shadow-lg shadow-rose-500/5"
                        : "border-white/5 bg-[#030612]/30 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/15 group-hover:scale-105 transition-transform duration-200">
                        <Flame className="h-5 w-5 animate-pulse" />
                      </div>
                      {rigorLevel === "stress" && (
                        <div className="h-5 w-5 rounded-full bg-rose-500 flex items-center justify-center text-[#040817]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1 flex items-center gap-1.5">
                        Adversarial Stress-Test
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Extremely rigorous, high-pressure environment. Board members focus specifically on potential liabilities, high risk exposure, and exit strategy targets.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#030612]/50 p-5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Configuration Review
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-500">Selected Proposal:</span>
                      <p className="font-bold text-slate-200">{proposalTitle || "Not configured"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500">Board Members:</span>
                      <p className="font-bold text-slate-200">{boardMembers.map(m => m.name).join(", ") || "None"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="border-white/10 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 h-11"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleStartSimulation}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-11 px-8 shadow-lg shadow-blue-500/25 border-0 hover:scale-[1.02] transition-all duration-200"
              >
                Begin Rehearsal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
